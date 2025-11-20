import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserProfileById,
  ensureUserProfile,
  UserProfile,
  getUserVideos,
  Video,
  deleteVideo,
  IS_SUPABASE_CONFIGURED,
  SupabaseCredentialsError,
  isUserPro,
} from '../services/supabaseClient';
import { createPortalSession } from '../services/stripeService';
import VideoGenerator from '../components/VideoGenerator';
import type { Language } from '../App';
import logoImage from '../attached_assets/LOGO.png';
import tokenIcon from '../attached_assets/token.png';
import { translations } from '../translations';
import { DEFAULT_FREE_TOKENS } from '../constants';

const dashboardLabels: Record<
  Language,
  {
    loading: string;
    signInMessage: string;
    backHome: string;
    logout: string;
    generateTitle: string;
    myVideos: string;
    refresh: string;
    videosLoading: string;
    noVideosTitle: string;
    noVideosSubtitle: string;
    confirmDelete: string;
    deleteError: string;
    deleteLabel: string;
    openLabel: string;
  }
> = {
  fr: {
    loading: 'Chargement...',
    signInMessage: 'Connecte-toi avec Google pour retrouver tes jetons et générer des vidéos en toute sécurité.',
    backHome: "Retour à l’accueil",
    logout: 'Déconnexion',
    generateTitle: 'Générer une nouvelle vidéo',
    myVideos: 'Mes vidéos',
    refresh: 'Actualiser',
    videosLoading: 'Chargement des vidéos...',
    noVideosTitle: 'Aucune vidéo créée',
    noVideosSubtitle: 'Crée ta première vidéo avec le générateur ci-dessus !',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette vidéo ?',
    deleteError: 'Erreur lors de la suppression de la vidéo',
    deleteLabel: 'Supprimer',
    openLabel: 'Ouvrir',
  },
  en: {
    loading: 'Loading...',
    signInMessage: 'Sign in with Google to restore your tokens and generate videos securely.',
    backHome: 'Back to home',
    logout: 'Log out',
    generateTitle: 'Generate a new video',
    myVideos: 'My videos',
    refresh: 'Refresh',
    videosLoading: 'Loading videos...',
    noVideosTitle: 'No videos yet',
    noVideosSubtitle: 'Create your first video with the generator above!',
    confirmDelete: 'Are you sure you want to delete this video?',
    deleteError: 'Error while deleting the video',
    deleteLabel: 'Delete',
    openLabel: 'Open',
  },
  es: {
    loading: 'Cargando...',
    signInMessage: 'Inicia sesión con Google para recuperar tus tokens y generar videos de forma segura.',
    backHome: 'Volver al inicio',
    logout: 'Cerrar sesión',
    generateTitle: 'Generar un nuevo video',
    myVideos: 'Mis videos',
    refresh: 'Actualizar',
    videosLoading: 'Cargando videos...',
    noVideosTitle: 'Todavía no hay videos',
    noVideosSubtitle: '¡Crea tu primer video con el generador de arriba!',
    confirmDelete: '¿Seguro que quieres eliminar este video?',
    deleteError: 'Error al eliminar el video',
    deleteLabel: 'Eliminar',
    openLabel: 'Abrir',
  },
};

interface DashboardPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ language, onLanguageChange }) => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTokens, setUserTokens] = useState(DEFAULT_FREE_TOKENS);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const inferredProfile = (profile ?? null) as (UserProfile & {
    plan?: string | null;
    subscription_tier?: string | null;
    is_pro?: boolean | null;
    tier?: string | null;
  }) | null;
  const t = translations[language];
  const d = dashboardLabels[language];
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const previousUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  const languageOptions: { code: Language; name: string }[] = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  const userNameFromMetadata =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    undefined;
  const userAvatarFromMetadata =
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined) ||
    undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const currentUserId = user?.id ?? null;

    // Si l'utilisateur se déconnecte, réinitialiser l'état
    if (!user) {
      previousUserIdRef.current = null;
      hasLoadedRef.current = false;
      setProfile(null);
      setVideos([]);
      setIsLoading(false);
      setSupabaseError(null);
      return;
    }

    // Si c'est le même utilisateur et que les données sont déjà chargées, ne pas recharger
    if (hasLoadedRef.current && previousUserIdRef.current === currentUserId) {
      return;
    }

    // Marquer que nous allons charger les données pour cet utilisateur
    previousUserIdRef.current = currentUserId;

    const bootstrap = async () => {
      try {
        if (!IS_SUPABASE_CONFIGURED) {
          setProfile(null);
          setUserTokens(DEFAULT_FREE_TOKENS);
          setSupabaseError('Supabase n'est pas configuré. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
          setIsLoading(false);
          hasLoadedRef.current = true;
          return;
        }

        setSupabaseError(null);
        setIsLoading(true);
        const supabaseProfile = await loadUserProfile(user.id, {
          email: user.email ?? null,
          name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? null,
          avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? (user.user_metadata?.picture as string | undefined) ?? null,
        });
        if (supabaseProfile) {
          await loadUserVideos(supabaseProfile.id);
        }
        setIsLoading(false);
        hasLoadedRef.current = true;
      } catch (error) {
        if (error instanceof SupabaseCredentialsError) {
          setSupabaseError(error.message);
        } else {
          console.error('Erreur inattendue Dashboard:', error);
        }
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    };

    bootstrap();
  }, [authLoading, user]);

  const loadUserProfile = async (
    userId: string,
    metadata: { email: string | null; name?: string | null; avatarUrl?: string | null },
  ) => {
    try {
      let userProfile = await getUserProfileById(userId);

      if (!userProfile) {
        userProfile = await ensureUserProfile({
          userId,
          email: metadata.email,
          name: metadata.name,
          avatarUrl: metadata.avatarUrl,
          provider: 'email',
        });
      }

      if (userProfile) {
        setProfile(userProfile);
        setUserTokens(userProfile.tokens);
      }

      return userProfile;
    } catch (error) {
      if (error instanceof SupabaseCredentialsError) {
        setSupabaseError(error.message);
        throw error;
      }
      console.error('Erreur loadUserProfile:', error);
      return null;
    }
  };

  const loadUserVideos = async (userId: string) => {
    try {
      setIsLoadingVideos(true);
      const userVideos = await getUserVideos(userId, 10);
      setVideos(userVideos);
      setIsLoadingVideos(false);
    } catch (error) {
      if (error instanceof SupabaseCredentialsError) {
        setSupabaseError(error.message);
      } else {
        console.error('Erreur lors du chargement des vidéos:', error);
      }
      setIsLoadingVideos(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm(d.confirmDelete)) {
      return;
    }

    try {
      await deleteVideo(videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(d.deleteError);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    } finally {
      navigate('/');
    }
  };

  const handleVideoGenerated = async (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);

    if (user) {
      await loadUserProfile(user.id, {
        email: user.email ?? null,
        name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? null,
        avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? (user.user_metadata?.picture as string | undefined) ?? null,
      });
    }
  };

  const refreshVideos = async () => {
    if (profile) {
      await loadUserVideos(profile.id);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0F12' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">{d.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-200">
        <img src={logoImage} alt="Viralis Studio" className="h-24 w-auto md:h-28" />
        <p className="text-lg text-center px-6">{d.signInMessage}</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-brand-green px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-green/80"
        >
          {d.backHome}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-slate-950">
      {supabaseError && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 text-sm text-center">
          {supabaseError} Vérifie les variables Vercel (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) puis redeploie.
        </div>
      )}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#021C1F] via-[#031E30] to-[#04121D] opacity-95" />
        <div className="absolute -top-1/3 right-0 w-[60rem] h-[60rem] bg-emerald-400/25 rounded-full blur-[160px] animate-slow-spin" />
        <div
          className="absolute bottom-[-40%] left-[-20%] w-[70rem] h-[70rem] bg-cyan-500/20 rounded-full blur-[180px] animate-slow-spin"
          style={{ animationDirection: 'reverse' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_45%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-lg bg-slate-900/40">
          <div className="container mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img src={logoImage} alt="Viralis Studio" className="h-20 w-auto md:h-24" />
              </a>

              <div className="flex items-center gap-4">
                {/* User Info - Clickable to open profile modal */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  {profile?.avatar_url || userAvatarFromMetadata ? (
                    <img
                      src={profile?.avatar_url || userAvatarFromMetadata}
                      alt={profile?.name || userNameFromMetadata || 'Utilisateur'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-green to-blue-400 flex items-center justify-center text-white font-bold">
                      {(profile?.name || userNameFromMetadata || 'U')[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {profile?.name || userNameFromMetadata}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-green font-semibold">
                      <img src={tokenIcon} alt="Jetons" className="w-4 h-4" />
                      <span>
                        {userTokens} {t.tokens.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Buy Tokens Button */}
                <Link
                  to="/pricing"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-semibold rounded-lg transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {language === 'fr' ? 'Acheter des tokens' : language === 'es' ? 'Comprar tokens' : 'Buy Tokens'}
                </Link>

                {/* Language Dropdown */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-center border border-white/15 rounded-md px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-white/30 transition-colors min-w-[96px]"
                    aria-haspopup="true"
                    aria-expanded={isLangDropdownOpen}
                  >
                    <span>{language.toUpperCase()}</span>
                    <svg
                      className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
                        isLangDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isLangDropdownOpen && (
                    <ul
                      className="absolute right-0 mt-2 w-32 bg-slate-900/90 border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-md animate-fade-in"
                      role="menu"
                    >
                      {languageOptions.map((option) => (
                        <li key={option.code}>
                          <button
                            onClick={() => {
                              onLanguageChange(option.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                            role="menuitem"
                          >
                            {option.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm"
                >
                  {d.logout}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-8 py-8 space-y-12">
          {/* Video Generator Section */}
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{d.generateTitle}</h2>
            {user && (
              <VideoGenerator
                userTokens={userTokens}
                setUserTokens={setUserTokens}
                language={language}
                supabaseUserId={profile?.id ?? user.id}
                onVideoGenerated={handleVideoGenerated}
                showSocialProof={false}
                userProfile={profile}
              />
            )}
          </section>


          {/* My Videos Section */}
          <section className="relative">
            {/* Background Glow */}
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[#00ff9d]/5 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 
                className="text-3xl md:text-4xl font-extrabold tracking-tighter"
                style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}
              >
                {d.myVideos}
              </h2>
              <button
                onClick={refreshVideos}
                className="px-5 py-2.5 bg-gradient-to-r from-[#00ff9d]/10 to-[#00b3ff]/10 hover:from-[#00ff9d]/20 hover:to-[#00b3ff]/20 border border-[#00ff9d]/30 hover:border-[#00ff9d]/50 text-white rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-2 backdrop-blur-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,153,0.3)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {d.refresh}
              </button>
            </div>

            {isLoadingVideos ? (
              <div className="text-center py-16 relative z-10">
                <div className="w-16 h-16 border-4 border-[#00ff9d]/20 border-t-[#00ff9d] rounded-full animate-spin mx-auto mb-4 shadow-[0_0_20px_rgba(0,255,153,0.3)]"></div>
                <p className="text-slate-300 font-medium">{d.videosLoading}</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="relative z-10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00ff9d]/20 to-[#00b3ff]/20 mb-6">
                  <svg className="w-10 h-10 text-[#00ff9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{d.noVideosTitle}</h3>
                <p className="text-slate-400 text-lg">{d.noVideosSubtitle}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#00ff9d]/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,255,153,0.2)]"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/0 to-[#00b3ff]/0 group-hover:from-[#00ff9d]/5 group-hover:to-[#00b3ff]/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                    
                    <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden rounded-t-2xl">
                      <video
                        src={video.video_url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        controls={false}
                        preload="metadata"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Action button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:from-[#00ff9d]/90 hover:to-[#00b3ff]/90 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,153,0.4)]"
                        >
                          {d.openLabel}
                        </a>
                      </div>
                      
                      {/* Badge overlay */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                          {video.resolution}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 relative z-10">
                      <p className="text-white font-semibold mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-[#00ff9d] transition-colors duration-300">
                        {video.prompt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-1 text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{video.aspect_ratio}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#00ff9d] font-semibold">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {video.tokens_used} {t.tokens.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-400 hover:text-red-300 transition-all duration-300 p-2 rounded-lg hover:bg-red-500/10 group/delete"
                          title={d.deleteLabel}
                        >
                          <svg className="w-4 h-4 transform group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Profile Management Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                  {language === 'fr' ? 'Mon Profil' : language === 'es' ? 'Mi Perfil' : 'My Profile'}
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tokens Section */}
              <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      {language === 'fr' ? 'Mes Tokens' : language === 'es' ? 'Mis Tokens' : 'My Tokens'}
                    </p>
                    <div className="flex items-center gap-3">
                      <img src={tokenIcon} alt="Tokens" className="w-8 h-8" />
                      <p className="text-3xl font-bold text-white">{userTokens}</p>
                    </div>
                  </div>
                  <Link
                    to="/pricing"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-semibold rounded-lg transition-all duration-200 text-sm"
                  >
                    {language === 'fr' ? 'Acheter' : language === 'es' ? 'Comprar' : 'Buy More'}
                  </Link>
                </div>
              </div>

              {/* Active Subscription Section */}
              {isUserPro(profile) ? (
                <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'fr' ? 'Abonnement Actif' : language === 'es' ? 'Suscripción Activa' : 'Active Subscription'}
                    </h3>
                    <div className="px-3 py-1 bg-gradient-to-r from-[#00ff9d]/20 to-[#00b3ff]/20 border border-[#00ff9d]/30 rounded-lg">
                      <span className="text-[#00ff9d] font-semibold text-xs">
                        {language === 'fr' ? 'ACTIF' : language === 'es' ? 'ACTIVO' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">
                        {language === 'fr' ? 'Plan' : language === 'es' ? 'Plan' : 'Plan'}
                      </p>
                      <p className="text-white font-semibold">
                        {profile?.subscription_status === 'pro_monthly' 
                          ? (language === 'fr' ? 'Pro Mensuel' : language === 'es' ? 'Pro Mensual' : 'Pro Monthly')
                          : (language === 'fr' ? 'Pro Annuel' : language === 'es' ? 'Pro Anual' : 'Pro Annual')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">
                        {language === 'fr' ? 'Prix' : language === 'es' ? 'Precio' : 'Price'}
                      </p>
                      <p className="text-white font-semibold">
                        {profile?.subscription_status === 'pro_monthly' ? '$19.99' : '$199.99'}
                        <span className="text-xs text-slate-400 ml-1">
                          {profile?.subscription_status === 'pro_monthly' 
                            ? (language === 'fr' ? '/mois' : language === 'es' ? '/mes' : '/month')
                            : (language === 'fr' ? '/an' : language === 'es' ? '/año' : '/year')}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={async () => {
                        if (!user || !profile) return;
                        try {
                          // TODO Phase 2: Replace with actual portal session
                          alert(language === 'fr' 
                            ? 'Configuration Stripe en cours. Cette fonctionnalité sera bientôt disponible.'
                            : language === 'es'
                            ? 'Configuración de Stripe en curso. Esta funcionalidad estará disponible pronto.'
                            : 'Stripe configuration in progress. This feature will be available soon.');
                        } catch (error) {
                          console.error('Error opening portal:', error);
                        }
                      }}
                      disabled={true}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition-all duration-200 text-sm"
                    >
                      {language === 'fr' ? 'Modifier' : language === 'es' ? 'Modificar' : 'Modify'}
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        setShowCancelModal(true);
                      }}
                      className="flex-1 px-4 py-2 border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 text-red-400 font-medium rounded-lg transition-all duration-200 text-sm"
                    >
                      {language === 'fr' ? 'Annuler' : language === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700/50 text-center">
                  <p className="text-slate-400 text-sm mb-3">
                    {language === 'fr' ? 'Aucun abonnement actif' : language === 'es' ? 'No hay suscripción activa' : 'No active subscription'}
                  </p>
                  <Link
                    to="/pricing"
                    onClick={() => setShowProfileModal(false)}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-semibold rounded-lg transition-all duration-200 text-sm"
                  >
                    {language === 'fr' ? 'Voir les plans' : language === 'es' ? 'Ver planes' : 'View Plans'}
                  </Link>
                </div>
              )}

              {/* Recent Purchases Section */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'fr' ? 'Derniers Achats' : language === 'es' ? 'Últimas Compras' : 'Recent Purchases'}
                </h3>
                <div className="space-y-3">
                  {/* TODO Phase 2: Replace with actual purchase history from Stripe */}
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {language === 'fr' 
                      ? 'Aucun achat récent'
                      : language === 'es'
                      ? 'No hay compras recientes'
                      : 'No recent purchases'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-md w-full p-6 md:p-8">
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {language === 'fr' ? 'Annuler l\'abonnement ?' : language === 'es' ? '¿Cancelar suscripción?' : 'Cancel Subscription?'}
              </h3>
              <p className="text-slate-400 text-sm text-center">
                {language === 'fr'
                  ? 'Êtes-vous sûr de vouloir annuler votre abonnement Pro ? Vous perdrez l\'accès aux fonctionnalités premium à la fin de la période de facturation.'
                  : language === 'es'
                  ? '¿Estás seguro de que deseas cancelar tu suscripción Pro? Perderás el acceso a las funciones premium al final del período de facturación.'
                  : 'Are you sure you want to cancel your Pro subscription? You will lose access to premium features at the end of the billing period.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-300 font-medium rounded-lg transition-all duration-200"
              >
                {language === 'fr' ? 'Conserver mon abonnement' : language === 'es' ? 'Mantener mi suscripción' : 'Keep Subscription'}
              </button>
              <button
                onClick={async () => {
                  if (!user || !profile) return;
                  setIsCancelling(true);
                  try {
                    // TODO Phase 2: Replace with actual cancellation API call
                    alert(language === 'fr'
                      ? 'Configuration Stripe en cours. Cette fonctionnalité sera bientôt disponible.'
                      : language === 'es'
                      ? 'Configuración de Stripe en curso. Esta funcionalidad estará disponible pronto.'
                      : 'Stripe configuration in progress. This feature will be available soon.');
                    setShowCancelModal(false);
                  } catch (error) {
                    console.error('Error cancelling subscription:', error);
                    alert(language === 'fr'
                      ? 'Une erreur est survenue lors de l\'annulation.'
                      : language === 'es'
                      ? 'Ocurrió un error al cancelar.'
                      : 'An error occurred while cancelling.');
                  } finally {
                    setIsCancelling(false);
                  }
                }}
                disabled={isCancelling}
                className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-400 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling
                  ? (language === 'fr' ? 'Annulation...' : language === 'es' ? 'Cancelando...' : 'Cancelling...')
                  : (language === 'fr' ? 'Oui, annuler' : language === 'es' ? 'Sí, cancelar' : 'Yes, Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
