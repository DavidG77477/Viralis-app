import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Authentication will not work.');
}

let currentClerkUserId: string | null = null;

const withClerkHeader: typeof fetch = async (input, init: RequestInit = {}) => {
  const headers = new Headers(init.headers ?? {});

  if (currentClerkUserId) {
    headers.set('x-clerk-user-id', currentClerkUserId);
  } else {
    headers.delete('x-clerk-user-id');
  }

  return fetch(input, {
    ...init,
    headers,
  });
};

export const setClerkSupabaseAuth = (clerkId: string | null) => {
  currentClerkUserId = clerkId;
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    global: {
      fetch: withClerkHeader,
    },
  }
);

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  tokens: number;
  provider?: string;
  updated_at?: string;
}

export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la récupération du profil (id):', error);
    return null;
  }

  return data;
};

export const getUserProfileByClerkId = async (clerkId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la récupération du profil (clerk_id):', error);
    return null;
  }

  return data;
};

interface ClerkUserPayload {
  clerkId: string;
  email: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}

export const ensureUserProfile = async (payload: ClerkUserPayload): Promise<UserProfile | null> => {
  const profilePayload = {
    clerk_id: payload.clerkId,
    email: payload.email,
    name: payload.name ?? payload.email?.split('@')[0] ?? 'Utilisateur',
    avatar_url: payload.avatarUrl ?? undefined,
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(profilePayload, { onConflict: 'clerk_id' })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la synchronisation du profil Clerk → Supabase :', error);
    return null;
  }

  return data;
};

export const updateUserTokens = async (userId: string, tokensUsed: number): Promise<number | null> => {
  const { data, error } = await supabase.rpc('decrement_tokens', {
    user_uuid: userId,
    tokens_to_use: tokensUsed,
  });
  
  if (error || data === null) {
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
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Video save skipped.');
    return null;
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select()
    .single();

  if (error) {
    console.error('Error saving video:', error);
    throw error;
  }

  return data;
};

export const getUserVideos = async (userId: string, limit: number = 10): Promise<Video[]> => {
  if (!supabaseUrl || !supabaseAnonKey) {
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
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Video delete skipped.');
    return;
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId);

  if (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

const PROCESSED_VIDEO_BUCKET = 'processed-videos';

export const uploadProcessedVideo = async (file: File, storagePath: string): Promise<string | null> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Upload skipped.');
    return null;
  }

  const { error: uploadError } = await supabase.storage.from(PROCESSED_VIDEO_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'video/mp4',
  });

  if (uploadError) {
    console.error('Error uploading processed video:', uploadError);
    return null;
  }

  const { data: publicData } = supabase.storage.from(PROCESSED_VIDEO_BUCKET).getPublicUrl(storagePath);

  return publicData?.publicUrl ?? null;
};
