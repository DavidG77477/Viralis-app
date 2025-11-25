import { createClient } from '@supabase/supabase-js';

export class SupabaseCredentialsError extends Error {
  constructor(message = 'Supabase API key invalide. Vérifie VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.') {
    super(message);
    this.name = 'SupabaseCredentialsError';
  }
}

const isInvalidApiKeyError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const message = (error as { message?: string }).message?.toLowerCase() ?? '';
  return message.includes('invalid api key');
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const IS_SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);

if (!IS_SUPABASE_CONFIGURED) {
  console.warn(
    '[Supabase] Credentials missing (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Running in guest mode with local memory only.',
  );
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  tokens: number;
  provider?: string;
  updated_at?: string;
  clerk_id?: string | null;
  subscription_status?: 'free' | 'pro_monthly' | 'pro_annual' | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

export const isUserPro = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  return profile.subscription_status === 'pro_monthly' || profile.subscription_status === 'pro_annual';
};

export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return null;
  }
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Erreur lors de la récupération du profil (id):', error);
    return null;
  }

  return data;
};

interface SupabaseUserPayload {
  userId: string;
  email: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  provider?: string | null;
}

export const ensureUserProfile = async (payload: SupabaseUserPayload): Promise<UserProfile | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return null;
  }
  
  // First, try to get existing profile
  const { data: existingProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.userId)
    .maybeSingle();
  
  // Only include fields that exist in the table
  const profilePayload: any = {
    id: payload.userId,
    email: payload.email,
    name: payload.name ?? payload.email?.split('@')[0] ?? 'Utilisateur',
    avatar_url: payload.avatarUrl ?? undefined,
    provider: payload.provider ?? 'google',
  };
  
  // Only include clerk_id if the column exists (it might not be in all schemas)
  // We'll use update instead of upsert if profile exists, to avoid errors
  
  if (existingProfile) {
    // Profile exists, just update non-null fields
    const { data, error } = await supabase
      .from('users')
      .update({
        email: payload.email,
        name: payload.name ?? existingProfile.name,
        avatar_url: payload.avatarUrl ?? existingProfile.avatar_url,
        provider: payload.provider ?? existingProfile.provider,
      })
      .eq('id', payload.userId)
      .select()
      .maybeSingle();
    
    if (error) {
      if (isInvalidApiKeyError(error)) {
        throw new SupabaseCredentialsError();
      }
      console.error('Erreur lors de la mise à jour du profil Supabase :', error);
      // Return existing profile instead of null to avoid breaking the app
      return existingProfile;
    }
    
    return data;
  } else {
    // Profile doesn't exist, insert it
    const { data, error } = await supabase
      .from('users')
      .insert(profilePayload)
      .select()
      .maybeSingle();
    
    if (error) {
      if (isInvalidApiKeyError(error)) {
        throw new SupabaseCredentialsError();
      }
      console.error('Erreur lors de la création du profil Supabase :', error);
      return null;
    }
    
    return data;
  }
};

export const updateUserTokens = async (userId: string, tokensUsed: number): Promise<number | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return null;
  }
  const { data, error } = await supabase.rpc('decrement_tokens', {
    user_id: userId,
    tokens_to_use: tokensUsed,
  });
  
  if (error || data === null) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error updating tokens:', error);
    return null;
  }
  
  return data;
};

export const updateUserSubscriptionStatus = async (
  userId: string,
  subscriptionStatus: 'free' | 'pro_monthly' | 'pro_annual' | null,
  stripeCustomerId?: string | null,
  stripeSubscriptionId?: string | null
): Promise<void> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return;
  }

  const updateData: any = {
    subscription_status: subscriptionStatus,
  };

  if (stripeCustomerId !== undefined) {
    updateData.stripe_customer_id = stripeCustomerId;
  }

  if (stripeSubscriptionId !== undefined) {
    updateData.stripe_subscription_id = stripeSubscriptionId;
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

export interface Video {
  id: string;
  user_id: string;
  title?: string;
  prompt: string;
  video_url: string;
  thumbnail_url?: string;
  aspect_ratio: string;
  resolution: string;
  tokens_used: number;
  created_at: string;
}

export const saveVideo = async (video: Omit<Video, 'id' | 'created_at'>): Promise<Video | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Video save skipped.');
    return null;
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select()
    .single();

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error saving video:', error);
    throw error;
  }

  return data;
};

export const getUserVideos = async (userId: string, limit: number = 10): Promise<Video[]> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Returning empty videos.');
    return [];
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
};

export interface PendingVideoTask {
  task_id: string;
  user_id: string;
  prompt: string;
  aspect_ratio: string;
  resolution: string;
  tokens_used: number;
  model?: string;
  status: 'pending' | 'completed' | 'failed';
  video_url?: string;
  created_at?: string;
  completed_at?: string;
}

export const savePendingVideoTask = async (task: Omit<PendingVideoTask, 'created_at' | 'status'>): Promise<PendingVideoTask | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Pending task save skipped.');
    return null;
  }

  // Retry logic pour gérer les erreurs de cache PostgREST
  let lastError: any = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from('pending_video_tasks')
      .insert([{
        ...task,
        status: 'pending',
      }])
      .select()
      .single();

    if (!error) {
      return data;
    }

    lastError = error;

    // Si c'est une erreur de cache PostgREST (PGRST205), attendre un peu et réessayer
    if (error.code === 'PGRST205') {
      console.warn(`[Supabase] Table not found in cache (attempt ${attempt + 1}/3), retrying...`);
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // 1s, 2s, 3s
        continue;
      }
    }

    // Pour les autres erreurs, arrêter immédiatement
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    
    // Si ce n'est pas une erreur de cache, arrêter
    break;
  }

  // Si toutes les tentatives ont échoué
  console.error('Error saving pending task after retries:', lastError);
  
  // Ne pas faire échouer la génération si c'est juste un problème de cache
  if (lastError?.code === 'PGRST205') {
    console.warn('[Supabase] Table pending_video_tasks not available in PostgREST cache. The webhook may still work, but task tracking is disabled.');
    return null;
  }
  
  throw lastError;
};

// Variable globale pour tracker si la table n'existe pas (évite les logs répétés)
let tableNotFoundLogged = false;

export const getPendingVideoTask = async (taskId: string, userId: string): Promise<PendingVideoTask | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return null;
  }

  const { data, error } = await supabase
    .from('pending_video_tasks')
    .select('*')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter les erreurs 404

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    
    // Erreur PGRST205 = table not found in schema cache
    if (error.code === 'PGRST205') {
      if (!tableNotFoundLogged) {
        console.warn('[Supabase] Table pending_video_tasks not found in PostgREST cache. This may indicate the table needs to be created or the cache needs to refresh.');
        tableNotFoundLogged = true; // Ne logger qu'une seule fois
      }
      // Retourner null silencieusement pour éviter les logs répétés
      return null;
    }
    
    // PGRST116 = no rows returned (normal si la tâche n'existe pas encore)
    if (error.code === 'PGRST116') {
      return null; // Pas d'erreur, juste pas de résultat
    }
    
    // Autres erreurs : logger seulement si ce n'est pas une erreur de cache
    console.warn('[Supabase] Error fetching pending task:', error.message);
    return null;
  }

  // Si on a des données, réinitialiser le flag (la table existe maintenant)
  if (data) {
    tableNotFoundLogged = false;
  }

  return data;
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Video delete skipped.');
    return;
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId);

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error deleting video:', error);
    throw error;
  }
};

const PROCESSED_VIDEO_BUCKET = 'processed-videos';
const INPUT_IMAGES_BUCKET = 'input-images';

export const uploadProcessedVideo = async (file: File, storagePath: string): Promise<string | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Upload skipped.');
    return null;
  }

  const { error: uploadError } = await supabase.storage.from(PROCESSED_VIDEO_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'video/mp4',
  });

  if (uploadError) {
    if (isInvalidApiKeyError(uploadError)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Error uploading processed video:', uploadError);
    return null;
  }

  const { data: publicData } = supabase.storage.from(PROCESSED_VIDEO_BUCKET).getPublicUrl(storagePath);

  return publicData?.publicUrl ?? null;
};

/**
 * Upload an image to Supabase Storage and return its public URL
 * Used for Veo3 image-to-video generation which requires public image URLs
 */
export const uploadImageToStorage = async (
  imageBase64: string,
  mimeType: string,
  userId: string
): Promise<string | null> => {
  if (!IS_SUPABASE_CONFIGURED) {
    console.warn('Supabase credentials not configured. Image upload skipped.');
    return null;
  }

  try {
    // Convert base64 to Blob
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Determine file extension from mime type
    const extension = mimeType.split('/')[1]?.split(';')[0] || 'jpg';
    const fileName = `${userId}/${Date.now()}.${extension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(INPUT_IMAGES_BUCKET)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      if (isInvalidApiKeyError(uploadError)) {
        throw new SupabaseCredentialsError();
      }
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from(INPUT_IMAGES_BUCKET).getPublicUrl(fileName);

    return publicData?.publicUrl ?? null;
  } catch (error) {
    console.error('Error converting or uploading image:', error);
    return null;
  }
};
