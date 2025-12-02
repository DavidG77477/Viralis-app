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
  pro_access_until?: string | null; // Date until which Pro access is valid (even after cancellation)
}

export const isUserPro = (profile: UserProfile | null, subscriptionStatus?: { status: string | null; currentPeriodEnd: string | null } | null): boolean => {
  if (!profile) return false;
  
  // Vérifier si l'utilisateur a un abonnement actif (mensuel ou annuel)
  if (profile.subscription_status === 'pro_monthly' || profile.subscription_status === 'pro_annual') {
    return true;
  }
  
  // Vérifier si l'utilisateur a encore accès Pro grâce à pro_access_until
  // Fonctionne pour les deux types d'abonnements :
  // - Mensuel : pro_access_until sera dans ~1 mois après annulation
  // - Annuel : pro_access_until sera dans ~1 an après annulation
  if (profile.pro_access_until) {
    const accessUntil = new Date(profile.pro_access_until);
    const now = new Date();
    if (accessUntil > now) {
      return true;
    }
  }
  
  // Vérifier aussi via subscriptionStatus si fourni (pour les cas où pro_access_until n'est pas encore mis à jour)
  if (subscriptionStatus?.status === 'canceled' && subscriptionStatus?.currentPeriodEnd) {
    const periodEnd = new Date(subscriptionStatus.currentPeriodEnd);
    const now = new Date();
    if (periodEnd > now) {
      return true;
    }
  }
  
  return false;
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
  
  if (!payload.email) {
    console.error('Cannot create profile without email');
    return null;
  }
  
  // First, try to get existing profile by ID
  const { data: existingProfileById } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.userId)
    .maybeSingle();
  
  // Also check if a profile exists with the same email (in case of email change or duplicate)
  const { data: existingProfileByEmail } = await supabase
    .from('users')
    .select('*')
    .eq('email', payload.email)
    .maybeSingle();
  
  // Only include fields that exist in the table
  const profilePayload: any = {
    id: payload.userId,
    email: payload.email,
    name: payload.name ?? payload.email?.split('@')[0] ?? 'Utilisateur',
    avatar_url: payload.avatarUrl ?? undefined,
    provider: payload.provider ?? 'google',
  };
  
  // Case 1: Profile exists with the same ID - update it
  if (existingProfileById) {
    const { data, error } = await supabase
      .from('users')
      .update({
        email: payload.email,
        name: payload.name ?? existingProfileById.name,
        avatar_url: payload.avatarUrl ?? existingProfileById.avatar_url,
        provider: payload.provider ?? existingProfileById.provider,
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
      return existingProfileById;
    }
    
    return data;
  }
  
  // Case 2: Profile exists with the same email but different ID
  // This should not happen normally (trigger creates profile with same ID as auth.users)
  // If it does, we return the existing profile to avoid conflicts
  if (existingProfileByEmail && existingProfileByEmail.id !== payload.userId) {
    console.warn(`Profile exists with email ${payload.email} but different ID. Existing ID: ${existingProfileByEmail.id}, New ID: ${payload.userId}. Returning existing profile.`);
    // Return the existing profile - the trigger should have created it with the correct ID
    // If there's a mismatch, there might be a data integrity issue
    return existingProfileByEmail;
  }
  
  // Case 3: No profile exists - create a new one
  const { data, error } = await supabase
    .from('users')
    .insert(profilePayload)
    .select()
    .maybeSingle();
  
  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    
    // If it's a duplicate key error, try to get the existing profile
    if (error.code === '23505') {
      console.warn('Duplicate key error, attempting to fetch existing profile');
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('email', payload.email)
        .maybeSingle();
      
      if (existingProfile) {
        return existingProfile;
      }
    }
    
    console.error('Erreur lors de la création du profil Supabase :', error);
    return null;
  }
  
  return data;
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

// Classe d'erreur pour indiquer que la table n'existe pas
export class TableNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TableNotFoundError';
  }
}

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
      // Lancer une erreur spécifique pour que le code appelant puisse la distinguer
      throw new TableNotFoundError('Table pending_video_tasks not found');
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
