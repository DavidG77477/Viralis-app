import type { AspectRatio, Resolution } from '../types';

export type VideoModel = 
  | 'sora-2'
  | 'sora-2-pro'
  | 'veo-3-api'
  | 'veo-3-1-api'
  | 'kling-api'
  | 'kling-2-1'
  | 'kling-2-5'
  | 'wan-video-api'
  | 'wan-2-2'
  | 'wan-2-5';

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
  {
    value: 'kling-api',
    label: 'KLING API',
    description: 'Kling AI - Standard',
  },
  {
    value: 'kling-2-1',
    label: 'Kling 2.1',
    description: 'Kling AI 2.1',
  },
  {
    value: 'kling-2-5',
    label: 'Kling 2.5',
    description: 'Kling AI 2.5 - Latest',
  },
  {
    value: 'wan-video-api',
    label: 'WAN VIDEO API',
    description: 'Wan Video - Standard',
  },
  {
    value: 'wan-2-2',
    label: 'Wan 2.2',
    description: 'Wan Video 2.2',
  },
  {
    value: 'wan-2-5',
    label: 'Wan 2.5',
    description: 'Wan Video 2.5 - Latest',
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

export const generateVideo = async ({ prompt, aspectRatio, image, resolution, model }: GenerateVideoParams) => {
    const apiKey = getApiKey();
    
    // Si aucun modèle n'est spécifié, utiliser la logique actuelle (rétrocompatibilité)
    let selectedModel: string;
    if (model) {
        selectedModel = model;
    } else {
        // Fallback sur l'ancienne logique
        selectedModel = resolution === '1080p' ? 'veo3_quality' : 'veo3_fast';
    }
    
    // Déterminer l'endpoint selon le modèle
    // Par défaut, on utilise /veo/generate pour Veo et les anciens modèles
    // Pour les autres modèles, on peut utiliser le même endpoint ou un endpoint spécifique
    let endpoint = '/veo/generate';
    
    // Si le modèle est spécifié explicitement, on peut ajuster l'endpoint
    // Note: KIE peut utiliser le même endpoint pour tous les modèles, le paramètre model détermine le modèle réel
    if (selectedModel.startsWith('sora-')) {
        endpoint = '/veo/generate'; // À ajuster selon la doc KIE
    } else if (selectedModel.startsWith('kling-')) {
        endpoint = '/veo/generate'; // À ajuster selon la doc KIE
    } else if (selectedModel.startsWith('wan-')) {
        endpoint = '/veo/generate'; // À ajuster selon la doc KIE
    }
    
    const requestBody: any = {
        prompt: prompt,
        model: selectedModel,
        aspectRatio: aspectRatio,
        enableTranslation: true,
        generationType: 'TEXT_2_VIDEO',
    };

    if (image) {
        requestBody.imageUrl = `data:${image.mimeType};base64,${image.base64}`;
    }

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
    console.log('KIE API Response:', data);
    
    if (data.code && data.code !== 200) {
        if (data.code === 402) {
            throw new Error('Crédits insuffisants sur votre compte KIE. Veuillez recharger votre compte sur https://kie.ai');
        }
        throw new Error(data.msg || `Erreur API KIE (code ${data.code})`);
    }
    
    const taskId = data.taskId || data.data?.taskId;
    if (!taskId) {
        console.error('Invalid API response:', data);
        throw new Error('Réponse invalide de l\'API KIE : taskId manquant');
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
    const maxDurationMs = 2 * 60 * 1000;
    let attempts = 0;
    const baseDelay = 4000;
    const maxDelay = 10000;
    const maxAttemptsEstimate = Math.ceil(maxDurationMs / baseDelay);
    
    while (Date.now() - start < maxDurationMs) {
        const delay = Math.min(baseDelay + attempts * 500, maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const response = await fetch(`${KIE_API_BASE}/veo/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur de polling API KIE: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Polling response:', result);
        
        if (result.code && result.code !== 200) {
            throw new Error(result.msg || `Erreur API KIE (code ${result.code})`);
        }
        
        const data = result.data;
        const successFlag = data.successFlag;
        
        if (successFlag === 1) {
            const videoUrls = data.response?.resultUrls;
            console.log('Video generation completed:', videoUrls);
            
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
        
        console.log(`Génération en cours... (tentative ${attempts + 1}/${maxAttemptsEstimate})`);
        attempts++;
    }
    
    throw new Error('La génération de vidéo a expiré (plus de 2 minutes sans réponse).');
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
        
        const response = await fetch(`${KIE_API_BASE}/jobs/task-info?taskId=${taskId}`, {
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
