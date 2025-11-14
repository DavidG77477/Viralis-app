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
}

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
  const profilePayload = {
    id: payload.userId,
    email: payload.email,
    name: payload.name ?? payload.email?.split('@')[0] ?? 'Utilisateur',
    avatar_url: payload.avatarUrl ?? undefined,
    provider: payload.provider ?? 'google',
    clerk_id: null,
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(profilePayload, { onConflict: 'id' })
    .select()
    .maybeSingle();

  if (error) {
    if (isInvalidApiKeyError(error)) {
      throw new SupabaseCredentialsError();
    }
    console.error('Erreur lors de la synchronisation du profil Supabase :', error);
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
