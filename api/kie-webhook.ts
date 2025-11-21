import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface KIEWebhookPayload {
  code: number;
  msg: string;
  data: {
    taskId: string;
    model: string;
    state: 'success' | 'fail' | 'pending';
    param: string;
    resultJson?: string;
    resultWaterMarkUrls?: string[];
    failCode?: string;
    failMsg?: string;
    completeTime?: number;
    createTime?: number;
    updateTime?: number;
  };
}

// Interface pour les tâches en attente stockées dans Supabase
interface PendingVideoTask {
  task_id: string;
  user_id: string;
  prompt: string;
  aspect_ratio: string;
  resolution: string;
  tokens_used: number;
  model?: string;
  status: 'pending' | 'completed' | 'failed';
  video_url?: string;
  created_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: KIEWebhookPayload = req.body;
    console.log('[KIE Webhook] Received payload:', JSON.stringify(payload, null, 2));

    // Verify the webhook payload structure
    if (!payload.data || !payload.data.taskId) {
      return res.status(400).json({ error: 'Invalid webhook payload: missing taskId' });
    }

    const { taskId, state, resultJson, failMsg } = payload.data;

    // If task failed, log and update pending task
    if (state === 'fail') {
      console.error('[KIE Webhook] Task failed:', taskId, failMsg);
      
      // Mettre à jour la tâche en attente pour marquer comme échouée
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('pending_video_tasks')
          .update({ 
            status: 'failed',
            completed_at: new Date().toISOString()
          })
          .eq('task_id', taskId);
      }
      
      return res.status(200).json({ received: true, status: 'failed' });
    }

    // If task is successful, process the video
    if (state === 'success' && resultJson) {
      let resultData;
      let videoUrls: string[] = [];
      
      try {
        resultData = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson;
      } catch (e) {
        console.error('[KIE Webhook] Error parsing resultJson:', e);
        return res.status(400).json({ error: 'Invalid resultJson format' });
      }

      // Sora utilise resultJson.resultUrls, Veo3 utilise response.resultUrls
      if (resultData.resultUrls) {
        // Structure Sora
        videoUrls = resultData.resultUrls;
      } else if ((resultData as any).response?.resultUrls) {
        // Structure Veo3
        videoUrls = (resultData as any).response.resultUrls;
      } else if ((payload.data as any).response?.resultUrls) {
        // Structure Veo3 alternative (directement dans payload.data)
        videoUrls = (payload.data as any).response.resultUrls;
      }
      
      if (videoUrls.length === 0) {
        console.error('[KIE Webhook] No video URLs found in response');
        return res.status(400).json({ error: 'No video URLs found' });
      }

      const videoUrl = videoUrls[0];

      // Parse the param to get user info and video details
      let paramData: any;
      try {
        paramData = typeof payload.data.param === 'string' 
          ? JSON.parse(payload.data.param) 
          : payload.data.param;
      } catch (e) {
        console.error('[KIE Webhook] Error parsing param:', e);
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      // Utiliser service_role key pour le webhook afin de contourner RLS
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Chercher une tâche en attente avec ce taskId dans la table pending_video_tasks
        // Si elle existe, créer la vidéo dans la table videos
        const { data: pendingTask, error: pendingError } = await supabase
          .from('pending_video_tasks')
          .select('*')
          .eq('task_id', taskId)
          .single();

        if (pendingError || !pendingTask) {
          console.warn('[KIE Webhook] No pending task found for taskId:', taskId);
          // Si pas de tâche en attente, on retourne quand même le succès
          // Le frontend pourra récupérer la vidéo via polling ou autre méthode
          return res.status(200).json({ 
            received: true, 
            status: 'success',
            videoUrl,
            taskId,
            note: 'No pending task found, video URL available but not saved to database'
          });
        }

        // Créer la vidéo dans la table videos
        const { data: savedVideo, error: saveError } = await supabase
          .from('videos')
          .insert([{
            user_id: pendingTask.user_id,
            prompt: pendingTask.prompt,
            video_url: videoUrl,
            aspect_ratio: pendingTask.aspect_ratio,
            resolution: pendingTask.resolution,
            tokens_used: pendingTask.tokens_used,
          }])
          .select()
          .single();

        if (saveError) {
          console.error('[KIE Webhook] Error saving video:', saveError);
          return res.status(500).json({ error: 'Failed to save video', details: saveError.message });
        }

        // Mettre à jour la tâche en attente pour marquer comme complétée
        await supabase
          .from('pending_video_tasks')
          .update({ 
            status: 'completed',
            video_url: videoUrl,
            completed_at: new Date().toISOString()
          })
          .eq('task_id', taskId);

        // Décrémenter les tokens de l'utilisateur
        // Utiliser la fonction SQL decrement_tokens si elle existe, sinon mettre à jour directement
        try {
          const { error: tokenError } = await supabase.rpc('decrement_tokens', {
            user_id: pendingTask.user_id,
            tokens_to_use: pendingTask.tokens_used,
          });

          if (tokenError) {
            console.error('[KIE Webhook] Error updating tokens via RPC:', tokenError);
            // Fallback: mettre à jour directement la table users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('tokens')
              .eq('id', pendingTask.user_id)
              .single();
            
            if (!userError && userData) {
              const newTokens = Math.max(0, (userData.tokens || 0) - pendingTask.tokens_used);
              await supabase
                .from('users')
                .update({ tokens: newTokens })
                .eq('id', pendingTask.user_id);
            }
          }
        } catch (rpcError) {
          // Si la fonction RPC n'existe pas, utiliser le fallback direct
          console.warn('[KIE Webhook] RPC function not available, using direct update');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('tokens')
            .eq('id', pendingTask.user_id)
            .single();
          
          if (!userError && userData) {
            const newTokens = Math.max(0, (userData.tokens || 0) - pendingTask.tokens_used);
            await supabase
              .from('users')
              .update({ tokens: newTokens })
              .eq('id', pendingTask.user_id);
          }
        }

        console.log('[KIE Webhook] Video saved successfully:', savedVideo.id, 'for user:', pendingTask.user_id);
        
        return res.status(200).json({ 
          received: true, 
          status: 'success',
          videoUrl,
          taskId,
          videoId: savedVideo.id
        });
      } else {
        console.warn('[KIE Webhook] Supabase not configured, cannot save video');
        return res.status(200).json({ received: true, status: 'success', videoUrl });
      }
    }

    // If still pending, just acknowledge
    return res.status(200).json({ received: true, status: 'pending' });
  } catch (error: any) {
    console.error('[KIE Webhook] Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

