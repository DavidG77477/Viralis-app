import type { AspectRatio, Resolution } from '../types';

export type VideoModel = 
  | 'sora-2'
  | 'sora-2-pro'
  | 'veo-3-api'
  | 'veo-3-1-api';

export interface VideoModelInfo {
  value: VideoModel;
  label: string;
  description: string;
  requiresWatermarkRemoval?: boolean;
  endpoint?: string;
}

export const AVAILABLE_MODELS: VideoModelInfo[] = [
  {
    value: 'sora-2',
    label: 'Sora 2',
    description: 'OpenAI Sora 2 - Standard',
    requiresWatermarkRemoval: true,
  },
  {
    value: 'sora-2-pro',
    label: 'Sora 2 Pro',
    description: 'OpenAI Sora 2 Pro - Premium',
    requiresWatermarkRemoval: true,
  },
  {
    value: 'veo-3-api',
    label: 'Veo 3',
    description: 'Google Veo 3 - Fast generation',
  },
  {
    value: 'veo-3-1-api',
    label: 'Veo 3.1',
    description: 'Google Veo 3.1 - Enhanced quality',
  },
];

interface GenerateVideoParams {
    prompt: string;
    aspectRatio: AspectRatio;
    resolution: Resolution;
    model?: VideoModel;
    image?: {
        base64: string;
        mimeType: string;
    };
    userId?: string; // Pour stocker le taskId avec l'utilisateur pour le webhook
    videoCost?: number; // Coût en tokens pour sauvegarder dans le webhook
}

interface KieVideoResponse {
    taskId: string;
    status: string;
}

interface KieVideoResult {
    taskId: string;
    status: string;
    videoUrl?: string;
    coverUrl?: string;
    error?: string;
}

interface VideoOperationResult {
    done: boolean;
    response?: {
        generatedVideos?: Array<{
            video: {
                uri: string;
            };
        }>;
    };
}

const KIE_API_BASE = 'https://api.kie.ai/api/v1';

/**
 * Map internal model names to KIE API model identifiers
 * Sora models use /jobs/createTask endpoint with different model names
 */
const mapModelToKieApiModel = (internalModel: string): string => {
    const modelMapping: Record<string, string> = {
        // Sora models - use text-to-video suffix for /jobs/createTask endpoint
        'sora-2': 'sora-2-text-to-video',
        'sora-2-pro': 'sora-2-pro-text-to-video',
        // Veo models - use /veo/generate endpoint
        // veo3 = Quality, veo3_fast = Fast (selon la documentation)
        'veo-3-api': 'veo3_fast', // Fast par défaut
        'veo-3-1-api': 'veo3', // Quality pour la version 3.1
        // Fallback pour les anciens modèles
        'veo3_quality': 'veo3',
        'veo3_fast': 'veo3',
    };
    
    return modelMapping[internalModel] || internalModel;
};

/**
 * Convert aspect ratio from "16:9" or "9:16" to "landscape" or "portrait"
 */
const convertAspectRatio = (aspectRatio: AspectRatio): string => {
    return aspectRatio === '16:9' ? 'landscape' : 'portrait';
};

const getApiKey = () => {
    const runtimeWindow = typeof window !== 'undefined' ? (window as Record<string, unknown>) : undefined;
    const apiKeyCandidate =
        (runtimeWindow?.__KIE_API_KEY as string | undefined) ??
        import.meta.env.KIE_API_KEY ??
        import.meta.env.VITE_KIE_API_KEY ??
        (typeof process !== 'undefined' ? process.env?.KIE_API_KEY : undefined) ??
        (typeof process !== 'undefined' ? process.env?.VITE_KIE_API_KEY : undefined);

    const apiKey = apiKeyCandidate?.trim();

    if (!apiKey) {
        throw new Error('KIE_API_KEY is not configured. Please add your KIE API key in the Secrets tab.');
    }
    return apiKey;
};

const getOpenAiApiKey = (options?: { silent?: boolean }) => {
    const runtimeWindow = typeof window !== 'undefined' ? (window as Record<string, unknown>) : undefined;
    const apiKeyCandidate =
        (runtimeWindow?.__OPENAI_API_KEY as string | undefined) ??
        import.meta.env.OPENAI_API_KEY ??
        import.meta.env.VITE_OPENAI_API_KEY ??
        (typeof process !== 'undefined' ? process.env?.OPENAI_API_KEY : undefined) ??
        (typeof process !== 'undefined' ? process.env?.VITE_OPENAI_API_KEY : undefined);

    const apiKey = apiKeyCandidate?.trim();

    if (!apiKey && !options?.silent) {
        throw new Error('OpenAI API key is not configured. Please add it to your environment variables.');
    }

    return apiKey;
};

export const generateVideo = async (params: GenerateVideoParams) => {
    const apiKey = getApiKey();
    const { prompt, aspectRatio, resolution, model, image, userId, videoCost } = params;
    
    // Si aucun modèle n'est spécifié, utiliser la logique actuelle (rétrocompatibilité)
    let internalModel: string;
    if (model) {
        internalModel = model;
    } else {
        // Fallback sur l'ancienne logique
        internalModel = resolution === '1080p' ? 'veo3_quality' : 'veo3_fast';
    }
    
    // Vérifier si c'est un modèle Sora (utilise /jobs/createTask)
    const isSoraModel = internalModel.startsWith('sora-');
    // Vérifier si c'est un modèle Veo (peut aussi utiliser les webhooks)
    const isVeoModel = internalModel.startsWith('veo-') || internalModel.startsWith('veo3');
    
    // Convertir le nom de modèle interne vers le nom attendu par l'API KIE
    const kieApiModel = mapModelToKieApiModel(internalModel);
    
    console.log(`[KIE] Using model: ${internalModel} -> ${kieApiModel}`);
    
    // Déterminer l'endpoint selon le modèle
    let endpoint: string;
    let requestBody: any;
    
    if (isSoraModel) {
        // Sora utilise /jobs/createTask avec une structure différente
        endpoint = '/jobs/createTask';
        
        // Structure de base pour tous les modèles Sora
        const input: any = {
            prompt: prompt,
            aspect_ratio: convertAspectRatio(aspectRatio),
            n_frames: '10', // 10 secondes par défaut (peut être "10" ou "15")
            remove_watermark: true, // Retirer le watermark directement dans la requête
        };
        
        // Sora 2 Pro a un paramètre supplémentaire "size"
        if (kieApiModel === 'sora-2-pro-text-to-video') {
            input.size = 'high'; // 'standard' ou 'high'
        }
        
        // Construire l'URL du webhook
        // En production, utiliser l'URL Vercel, en dev utiliser ngrok ou similaire
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000');
        const callBackUrl = `${baseUrl}/api/kie-webhook`;
        
        requestBody = {
            model: kieApiModel,
            input: input,
            callBackUrl: callBackUrl, // Webhook pour recevoir les notifications
        };
        
        console.log('[KIE] Using webhook callback URL:', callBackUrl);
    } else if (isVeoModel) {
        // Veo utilise /veo/generate avec support optionnel des webhooks
        endpoint = '/veo/generate';
        
        // Construire l'URL du webhook si userId et videoCost sont fournis
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000');
        const callBackUrl = `${baseUrl}/api/kie-webhook`;
        
        // Pour Veo3, aspectRatio doit être "16:9" ou "9:16" (pas "landscape"/"portrait")
        const veoAspectRatio = aspectRatio; // Garder le format original "16:9" ou "9:16"
        
        requestBody = {
            prompt: prompt,
            model: kieApiModel,
            aspectRatio: veoAspectRatio,
            enableTranslation: true,
            generationType: image ? 'REFERENCE_2_VIDEO' : 'TEXT_2_VIDEO',
        };

        // Pour Veo3, uploader l'image vers Supabase Storage et utiliser imageUrls (array)
        if (image && userId) {
            try {
                const { uploadImageToStorage } = await import('./supabaseClient');
                const imageUrl = await uploadImageToStorage(image.base64, image.mimeType, userId);
                
                if (imageUrl) {
                    requestBody.imageUrls = [imageUrl];
                    console.log('[KIE] Image uploaded to Supabase Storage:', imageUrl);
                } else {
                    console.warn('[KIE] Failed to upload image, falling back to text-to-video');
                    requestBody.generationType = 'TEXT_2_VIDEO';
                }
            } catch (error) {
                console.error('[KIE] Error uploading image for Veo3:', error);
                requestBody.generationType = 'TEXT_2_VIDEO';
            }
        }
        
        // Ajouter callBackUrl si userId et videoCost sont fournis (pour webhooks)
        if (userId && videoCost) {
            requestBody.callBackUrl = callBackUrl;
            console.log('[KIE] Using webhook callback URL for Veo:', callBackUrl);
        }
    } else {
        // Autres modèles utilisent /veo/generate sans webhooks
        endpoint = '/veo/generate';
        requestBody = {
            prompt: prompt,
            model: kieApiModel,
            aspectRatio: aspectRatio,
            enableTranslation: true,
            generationType: 'TEXT_2_VIDEO',
        };

        if (image) {
            requestBody.imageUrl = `data:${image.mimeType};base64,${image.base64}`;
        }
    }

    console.log(`[KIE] Request body:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${KIE_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`KIE API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[KIE] Full API Response:', JSON.stringify(data, null, 2));
    
    // Selon la doc KIE, la réponse a cette structure :
    // { "code": 200, "message": "success", "data": { "taskId": "task_12345678" } }
    // ou en cas d'erreur : { "code": 422, "message": "error message", "data": null }
    
    if (data.code && data.code !== 200) {
        console.error('[KIE] API Error:', data);
        if (data.code === 402) {
            throw new Error('Crédits insuffisants sur votre compte KIE. Veuillez recharger votre compte sur https://kie.ai');
        }
        if (data.code === 422) {
            const errorMsg = data.message || data.msg || 'Invalid request';
            throw new Error(`Erreur API KIE (422): ${errorMsg}. Modèle utilisé: "${kieApiModel}"`);
        }
        throw new Error(data.message || data.msg || `Erreur API KIE (code ${data.code})`);
    }
    
    // Pour Sora (/jobs/createTask), le taskId est dans data.data.taskId selon la doc
    // Pour Veo (/veo/generate), le taskId peut être dans data.taskId ou data.data?.taskId
    let taskId: string | undefined;
    if (isSoraModel) {
        // Structure attendue pour Sora: { code: 200, message: "success", data: { taskId: "..." } }
        taskId = data.data?.taskId;
        console.log('[KIE] Sora response structure:', { code: data.code, message: data.message, taskId });
    } else {
        // Structure pour Veo peut varier
        taskId = data.taskId || data.data?.taskId;
        console.log('[KIE] Veo taskId from response:', taskId);
    }
    
    if (!taskId) {
        console.error('[KIE] Invalid API response - no taskId found:', JSON.stringify(data, null, 2));
        throw new Error('Réponse invalide de l\'API KIE : taskId manquant. Réponse: ' + JSON.stringify(data));
    }
    
    // Pour les modèles Sora et Veo, sauvegarder la tâche en attente si userId et tokens sont fournis
    if ((isSoraModel || isVeoModel) && params.userId && params.videoCost) {
        try {
            // Import dynamique pour éviter les dépendances circulaires
            const { savePendingVideoTask } = await import('./supabaseClient');
            // Pour Sora, convertir aspectRatio en landscape/portrait
            // Pour Veo3, garder le format original 16:9/9:16
            const aspectRatioForStorage = isSoraModel 
                ? convertAspectRatio(aspectRatio) 
                : aspectRatio;
            
            await savePendingVideoTask({
                task_id: taskId,
                user_id: params.userId,
                prompt: prompt,
                aspect_ratio: aspectRatioForStorage,
                resolution: resolution,
                tokens_used: params.videoCost,
                model: kieApiModel,
            });
            console.log('[KIE] Pending task saved for webhook:', taskId);
        } catch (error) {
            console.error('[KIE] Error saving pending task:', error);
            // Ne pas faire échouer la génération si la sauvegarde échoue
        }
    }
    
    return {
        taskId: taskId,
        status: data.status || 'pending'
    };
};

export const pollVideoOperation = async (operation: KieVideoResponse): Promise<VideoOperationResult> => {
    const apiKey = getApiKey();
    const { taskId } = operation;
    
    console.log('Polling for taskId:', taskId);
    
    if (!taskId) {
        throw new Error('Invalid taskId for polling');
    }
    
    const start = Date.now();
    const maxDurationMs = 10 * 60 * 1000; // 10 minutes pour Sora (génération peut prendre du temps)
    let attempts = 0;
    const baseDelay = 4000;
    const maxDelay = 10000;
    const maxAttemptsEstimate = Math.ceil(maxDurationMs / baseDelay);
    
    // Pour Sora, utiliser /common-api/get-task-status (endpoint standard KIE)
    // Pour Veo, utiliser /veo/record-info
    let useSoraEndpoint = true;
    
    while (Date.now() - start < maxDurationMs) {
        const delay = Math.min(baseDelay + attempts * 500, maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
        
            // Pour Sora, essayer différents endpoints possibles
        // Pour Veo, utiliser /veo/record-info
        let endpoint: string;
        let url: string;
        
        if (useSoraEndpoint) {
            // Essayer différentes variantes de l'endpoint pour Sora
            const soraEndpoints = [
                '/jobs/recordInfo',  // Selon la doc
                '/jobs/record-info', // Variante avec tiret
                '/jobs/getTask',     // Autre possibilité
                '/common-api/get-task-status' // Endpoint commun
            ];
            
            // Essayer le premier endpoint d'abord
            endpoint = soraEndpoints[0];
            url = `${KIE_API_BASE}${endpoint}?taskId=${taskId}`;
        } else {
            endpoint = '/veo/record-info';
            url = `${KIE_API_BASE}${endpoint}?taskId=${taskId}`;
        }
        
        console.log(`[KIE] Polling ${useSoraEndpoint ? 'Sora' : 'Veo'} endpoint:`, url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            // Si c'est une erreur 404 avec l'endpoint Sora, essayer Veo
            if (useSoraEndpoint && response.status === 404) {
                console.log(`[KIE] Sora endpoint ${endpoint} returned 404, trying Veo endpoint...`);
                console.log('[KIE] Note: If videos are successful in KIE dashboard but polling fails, you may need to use webhooks (callBackUrl) instead.');
                useSoraEndpoint = false;
                continue;
            }
            const errorText = await response.text();
            throw new Error(`Erreur de polling API KIE: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Polling response:', result);
        
        if (result.code && result.code !== 200) {
            throw new Error(result.msg || `Erreur API KIE (code ${result.code})`);
        }
        
        const data = result.data;
        
        // Si data est null, la tâche n'est pas encore disponible, continuer le polling
        if (!data || data === null) {
            console.log(`[KIE] recordInfo is null, task not yet available. Continuing polling... (attempt: ${attempts + 1}/${maxAttemptsEstimate})`);
            attempts++;
            continue;
        }
        
        // Gestion pour Sora (/jobs/recordInfo)
        if (useSoraEndpoint) {
            const state = data.state;
            console.log('[KIE] Sora task state:', state);
            console.log('[KIE] Full Sora response data:', JSON.stringify(data, null, 2));
            
            // Vérifier différents états possibles
            if (state === 'success' || state === 'completed' || data.state === 'success') {
                // Pour Sora, les URLs sont dans resultJson (string JSON)
                // Structure: { "resultUrls": [...], "resultWaterMarkUrls": [...] }
                let resultJson;
                try {
                    resultJson = typeof data.resultJson === 'string' 
                        ? JSON.parse(data.resultJson) 
                        : data.resultJson;
                    console.log('[KIE] Parsed resultJson:', resultJson);
                } catch (e) {
                    console.error('[KIE] Error parsing resultJson:', e, 'Raw resultJson:', data.resultJson);
                    resultJson = data.resultJson;
                }
                
                // Utiliser resultUrls (sans watermark car remove_watermark=true)
                const videoUrls = resultJson?.resultUrls || [];
                console.log('[KIE] Sora video generation completed. URLs:', videoUrls);
                
                if (!videoUrls || videoUrls.length === 0) {
                    // Essayer aussi resultWaterMarkUrls si resultUrls est vide
                    const watermarkUrls = resultJson?.resultWaterMarkUrls || [];
                    if (watermarkUrls.length > 0) {
                        console.log('[KIE] Using watermark URLs as fallback:', watermarkUrls);
                        return {
                            done: true,
                            response: {
                                generatedVideos: [{
                                    video: {
                                        uri: watermarkUrls[0]
                                    }
                                }]
                            }
                        };
                    }
                    throw new Error('Génération terminée mais aucune URL de vidéo fournie');
                }
                
                return {
                    done: true,
                    response: {
                        generatedVideos: [{
                            video: {
                                uri: videoUrls[0]
                            }
                        }]
                    }
                };
            }
            
            if (state === 'fail' || state === 'failed' || data.state === 'fail') {
                const errorMsg = data.failMsg || result.msg || 'La génération de vidéo a échoué';
                console.error('[KIE] Sora task failed:', errorMsg, 'Fail code:', data.failCode);
                throw new Error(errorMsg);
            }
            
            // Si state est 'pending', 'processing', 'in_progress' ou autre, continuer le polling
            console.log(`[KIE] Sora task still processing... (state: ${state}, attempt: ${attempts + 1}/${maxAttemptsEstimate})`);
        } else {
            // Gestion pour Veo (/veo/record-info)
            const successFlag = data.successFlag;
            
            if (successFlag === 1) {
                const videoUrls = data.response?.resultUrls;
                console.log('Veo video generation completed:', videoUrls);
                
                if (!videoUrls || videoUrls.length === 0) {
                    throw new Error('Génération terminée mais aucune URL de vidéo fournie');
                }
                
                return {
                    done: true,
                    response: {
                        generatedVideos: [{
                            video: {
                                uri: videoUrls[0]
                            }
                        }]
                    }
                };
            }
            
            if (successFlag === 2 || successFlag === 3) {
                throw new Error(result.msg || 'La génération de vidéo a échoué');
            }
        }
        
        console.log(`Génération en cours... (tentative ${attempts + 1}/${maxAttemptsEstimate})`);
        attempts++;
    }
    
    throw new Error('La génération de vidéo a expiré (plus de 5 minutes sans réponse).');
};

interface WatermarkRemovalResult {
    taskId: string;
    status: string;
}

export const removeSoraWatermark = async (videoUrl: string): Promise<WatermarkRemovalResult> => {
    const apiKey = getApiKey();
    
    const response = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'sora-watermark-remover',
            input: {
                video_url: videoUrl,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`KIE watermark removal error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.code && data.code !== 200) {
        throw new Error(data.msg || `Erreur API KIE (code ${data.code})`);
    }
    
    return {
        taskId: data.taskId || data.data?.taskId || data.id,
        status: data.status || 'pending',
    };
};

export const pollWatermarkRemoval = async (taskId: string): Promise<string> => {
    const apiKey = getApiKey();
    const maxAttempts = 30;
    const delay = 3000; // 3 secondes entre chaque tentative
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const response = await fetch(`${KIE_API_BASE}/common-api/get-task-status?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur de polling watermark removal: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.code && result.code !== 200) {
            throw new Error(result.msg || `Erreur API KIE (code ${result.code})`);
        }
        
        const data = result.data;
        
        // Si data est null, la tâche n'est pas encore disponible, continuer le polling
        if (!data || data === null) {
            console.log(`[KIE] Watermark removal: recordInfo is null, task not yet available. Continuing polling... (attempt: ${attempt + 1}/${maxAttempts})`);
            continue;
        }
        
        // Vérifier si la tâche est terminée
        if (data.status === 'completed' || data.successFlag === 1) {
            const videoUrl = data.response?.resultUrls?.[0] || data.output?.video_url || data.video_url;
            if (videoUrl) {
                return videoUrl;
            }
        }
        
        if (data.status === 'failed' || data.successFlag === 2 || data.successFlag === 3) {
            throw new Error(result.msg || 'Watermark removal failed');
        }
        
        console.log(`Watermark removal in progress... (attempt ${attempt + 1}/${maxAttempts})`);
    }
    
    throw new Error('Watermark removal timeout');
};

export const generateScript = async (prompt: string): Promise<string> => {
    const apiKey = getOpenAiApiKey();

    if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Script generation requires an OpenAI API key.');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative scriptwriter for viral TikTok videos.'
                },
                {
                    role: 'user',
                    content: `Based on the following prompt, generate a short, punchy, and engaging script for a viral TikTok video. The script should be creative and attention-grabbing. Prompt: "${prompt}"`
                }
            ],
            max_tokens: 500,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to generate script. Please check your OpenAI API key.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

/**
 * Generate a viral video prompt using ChatGPT via API route
 * This creates a completely new prompt from scratch designed to go viral
 */
export const generateViralPrompt = async (language: 'fr' | 'en' | 'es' = 'en'): Promise<string> => {
    const response = await fetch('/api/generate-viral-prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate viral prompt. Please check your OpenAI API key.');
    }

    const data = await response.json();
    return data.prompt;
};

interface PromptEnhancementOptions {
    themeInstruction?: string;
    musicInstruction?: string;
    styleInstruction?: string;
    aspectRatio?: string;
    language?: string;
    durationSec?: number | null;
}

const buildInstructionSummary = (options?: PromptEnhancementOptions): string => {
    if (!options) {
        return 'libre';
    }

    const parts: string[] = [];
    if (options.themeInstruction) {
        parts.push(`Thème : ${options.themeInstruction}`);
    }
    if (options.musicInstruction) {
        parts.push(`Ambiance musicale : ${options.musicInstruction}`);
    }
    if (options.styleInstruction) {
        parts.push(`Caméra : ${options.styleInstruction}`);
    }
    if (options.aspectRatio) {
        parts.push(`Ratio : ${options.aspectRatio}`);
    }
    if (typeof options.durationSec === 'number') {
        parts.push(`Durée cible : ${options.durationSec}s`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'libre';
};

export const enhancePromptWithTheme = async (prompt: string, options?: PromptEnhancementOptions): Promise<string> => {
    const apiKey = getOpenAiApiKey({ silent: true });

    const fallbackPrompt = (() => {
        if (!options) return prompt;
        const summary = buildInstructionSummary(options);
        return `${summary}. ${prompt}`;
    })();

    if (!apiKey) {
        console.warn('OpenAI API key is not configured. Using fallback prompt decoration.');
        return fallbackPrompt;
    }

    try {
        const systemPrompt = [
            'Tu es un Video Prompt Optimizer. Ton objectif : recevoir le prompt brut de l’utilisateur',
            'et l’améliorer pour le rendre viral tout en respectant strictement les paramètres fournis.',
            'Retourne UNIQUEMENT un JSON valide suivant le schéma imposé (pas de texte hors JSON).'
        ].join(' ');

        const payload = {
            input_style: options?.styleInstruction ?? 'libre',
            input_theme: options?.themeInstruction ?? 'libre',
            input_music: options?.musicInstruction ?? 'libre',
            input_duration_sec: options?.durationSec ?? null,
            input_aspect_ratio: options?.aspectRatio ?? '9:16',
            input_language: options?.language ?? 'fr',
            input_prompt: prompt,
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-5-thinking-mini',
                temperature: 0.7,
                max_tokens: 1024,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(payload, null, 2),
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to enhance prompt: ${errorData}`);
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content?.trim();
        if (!rawContent) {
            return fallbackPrompt;
        }

        try {
            const parsed = JSON.parse(rawContent);
            if (parsed && typeof parsed.kie_prompt === 'string' && parsed.kie_prompt.trim().length > 0) {
                return parsed.kie_prompt.trim();
            }
        } catch (jsonErr) {
            console.warn('Unable to parse optimizer JSON, falling back to raw content.', jsonErr);
            return rawContent;
        }

        return fallbackPrompt;
    } catch (error) {
        console.error('Error enhancing prompt with theme:', error);
        return fallbackPrompt;
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};
