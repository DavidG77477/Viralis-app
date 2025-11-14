import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateVideo, pollVideoOperation, generateScript, fileToBase64, enhancePromptWithTheme } from '../services/kieService';
import { ImageIcon, WandIcon, XCircleIcon, AspectRatioIcon, BrainCircuitIcon, FilmIcon, GridPattern, ResolutionIcon, ArrowDownCircleIcon } from './icons/Icons';
import { VIDEO_GENERATION_COST_720P, VIDEO_GENERATION_COST_1080P, SCRIPT_GENERATION_COST } from '../constants';
import type { AspectRatio, Resolution } from '../types';
import type { Language } from '../App';
import { translations } from '../translations';
import { saveVideo, updateUserTokens, IS_SUPABASE_CONFIGURED } from '../services/supabaseClient';
import type { Video } from '../services/supabaseClient';
import { appendClosingClip } from '../services/videoPostProcessor';
import SocialProofStats from './SocialProofStats';

interface VideoGeneratorProps {
    userTokens: number;
    setUserTokens: React.Dispatch<React.SetStateAction<number>>;
    language: Language;
    onVideoGenerated?: (video: Video) => void;
    supabaseUserId?: string | null;
    showSocialProof?: boolean;
}

type StyleOption = {
    value: string;
    label: string;
    promptInstruction?: string;
};

type StyleCategory = {
    id: string;
    title: string;
    description?: string;
    options: StyleOption[];
};

const VideoGenerator: React.FC<VideoGeneratorProps> = ({
    userTokens,
    setUserTokens,
    language,
    onVideoGenerated,
    supabaseUserId,
    showSocialProof = true,
}) => {
    const t = translations[language];
    const navigate = useNavigate();
    const location = useLocation();
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [resolution, setResolution] = useState<Resolution>('720p');
    const [useThinkingMode, setUseThinkingMode] = useState(false);
    const themeOptions = useMemo(() => t.generatorThemeOptions ?? [], [t]);
    const musicOptions = useMemo(() => t.generatorMusicOptions ?? [], [t]);
    const styleCategories = useMemo<StyleCategory[]>(() => {
        const categories = t.generatorStyleCategories as StyleCategory[] | undefined;
        return Array.isArray(categories) ? categories : [];
    }, [t]);

    const [selectedTheme, setSelectedTheme] = useState<string>(themeOptions[0]?.value ?? '');
    const [selectedMusic, setSelectedMusic] = useState<string>(musicOptions[0]?.value ?? '');
    const [selectedStyle, setSelectedStyle] = useState<string>('none');
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
    const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
    const selectedThemeOption = useMemo(
        () => themeOptions.find(option => option.value === selectedTheme),
        [themeOptions, selectedTheme]
    );
    const selectedMusicOption = useMemo(
        () => musicOptions.find(option => option.value === selectedMusic),
        [musicOptions, selectedMusic]
    );
    const selectedStyleOption = useMemo(() => {
        if (selectedStyle === 'none') {
            return null;
        }
        for (const category of styleCategories) {
            const match = category.options.find(option => option.value === selectedStyle);
            if (match) {
                return match;
            }
        }
        return null;
    }, [selectedStyle, styleCategories]);
    const themeDropdownRef = useRef<HTMLDivElement | null>(null);
    const musicDropdownRef = useRef<HTMLDivElement | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(t.loadingMessages[0]);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [generatedScript, setGeneratedScript] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const playableVideoUrl = generatedVideoUrl;
    const styleButtonLabel = selectedStyleOption?.label ?? t.generatorStyleButton;

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        if (isLoading) {
            let messageIndex = 0;
            interval = setInterval(() => {
                messageIndex = (messageIndex + 1) % t.loadingMessages.length;
                setLoadingMessage(t.loadingMessages[messageIndex]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading, t.loadingMessages]);

    useEffect(() => {
        if (!themeOptions.length) {
            setSelectedTheme('');
            setIsThemeDropdownOpen(false);
        } else if (!themeOptions.some(option => option.value === selectedTheme)) {
            setSelectedTheme(themeOptions[0].value);
        }

        if (!musicOptions.length) {
            setSelectedMusic('');
            setIsMusicDropdownOpen(false);
        } else if (!musicOptions.some(option => option.value === selectedMusic)) {
            setSelectedMusic(musicOptions[0].value);
        }
    }, [themeOptions, selectedTheme, musicOptions, selectedMusic]);

    useEffect(() => {
        if (selectedStyle === 'none') {
            return;
        }
        const styleExists = styleCategories.some(category =>
            category.options.some(option => option.value === selectedStyle),
        );
        if (!styleExists) {
            setSelectedStyle('none');
        }
    }, [selectedStyle, styleCategories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(target)) {
                setIsThemeDropdownOpen(false);
            }
            if (musicDropdownRef.current && !musicDropdownRef.current.contains(target)) {
                setIsMusicDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isStyleModalOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsStyleModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isStyleModalOpen]);

    const handleStyleSelection = useCallback(
        (value: string) => {
            setSelectedStyle(value);
            setIsStyleModalOpen(false);
        },
        [setSelectedStyle, setIsStyleModalOpen],
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const videoCost = resolution === '1080p' ? VIDEO_GENERATION_COST_1080P : VIDEO_GENERATION_COST_720P;

    const handleGenerate = async () => {
        if (!supabaseUserId) {
            setError('Connecte-toi pour générer ta vidéo.');
            const redirectParam = encodeURIComponent(location.pathname + location.search);
            navigate(`/auth?intent=generate&next=${redirectParam}`);
            return;
        }

        const shouldPersist = Boolean(supabaseUserId && IS_SUPABASE_CONFIGURED);
        if (!shouldPersist) {
            console.warn('Supabase user ID absent : enregistrement désactivé pour cette génération.');
        }

        setError(null);
        setGeneratedVideoUrl(null);
        setGeneratedScript(null);
        
        if (!prompt && !imageFile) {
            setError(t.errorPromptOrImage);
            return;
        }

        const themeInstruction = selectedThemeOption?.promptInstruction ?? selectedThemeOption?.label ?? undefined;
        const musicInstruction = selectedMusicOption?.promptInstruction ?? selectedMusicOption?.label ?? undefined;
        const styleInstruction = selectedStyleOption?.promptInstruction ?? selectedStyleOption?.label ?? undefined;

        if (useThinkingMode) {
            if (userTokens < SCRIPT_GENERATION_COST) {
                setError(t.errorTokensThinking);
                return;
            }
            setIsThemeDropdownOpen(false);
            setIsMusicDropdownOpen(false);
            setIsStyleModalOpen(false);
            setIsLoading(true);
            setLoadingMessage(t.enhancingPromptMessage ?? t.loadingCreative);
            setUserTokens(prev => prev - SCRIPT_GENERATION_COST);
            try {
                const enhancedPrompt = await enhancePromptWithTheme(prompt, { themeInstruction, musicInstruction, styleInstruction });
                const script = await generateScript(enhancedPrompt);
                setGeneratedScript(script);
                setPrompt(prev => `${prev}\n\n${t.generatedScriptIdea}:\n${script}`);
            } catch (err: any) {
                setError(err.message || t.errorScriptGeneration);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (userTokens < videoCost && shouldPersist) {
            navigate('/pricing?reason=low-tokens');
            return;
        }

        setIsThemeDropdownOpen(false);
        setIsMusicDropdownOpen(false);
        setIsStyleModalOpen(false);

        setIsLoading(true);
        setLoadingMessage(t.enhancingPromptMessage ?? t.loadingMessages[0]);
        let tokensDeducted = false;

        try {
            let imagePayload;
            if (imageFile) {
                const base64 = await fileToBase64(imageFile);
                imagePayload = { base64, mimeType: imageFile.type };
            }
            
                const enhancedPrompt = await enhancePromptWithTheme(prompt, { themeInstruction, musicInstruction, styleInstruction });
            setLoadingMessage(t.loadingMessages[0]);
            if (shouldPersist) {
                setUserTokens(prev => prev - videoCost);
                tokensDeducted = true;
            }
            
            let initialOperation = await generateVideo({ prompt: enhancedPrompt, aspectRatio, resolution, image: imagePayload });
            const finalOperation = await pollVideoOperation(initialOperation);

            const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error(t.errorRetrieveVideo);
            }

            setGeneratedVideoUrl(downloadLink);
            setLoadingMessage(t.loadingMessages[1] ?? t.loadingMessages[0]);
            const finalPersistedUrl = downloadLink;

            if (shouldPersist && supabaseUserId) {
                try {
                    const savedVideo = await saveVideo({
                        user_id: supabaseUserId,
                        prompt: enhancedPrompt,
                        video_url: finalPersistedUrl,
                        aspect_ratio: aspectRatio,
                        resolution,
                        tokens_used: videoCost,
                    });

                    if (!savedVideo) {
                        throw new Error('Impossible de sauvegarder la vidéo générée.');
                    }

                    const updatedTokenBalance = await updateUserTokens(supabaseUserId, videoCost);
                    if (updatedTokenBalance === null) {
                        setUserTokens(prev => prev + videoCost);
                        setError('Impossible de mettre à jour tes jetons. Réessaie plus tard.');
                        return;
                    }
                    setUserTokens(updatedTokenBalance);

                    if (onVideoGenerated) {
                        onVideoGenerated(savedVideo);
                    }
                } catch (saveError) {
                    console.error('Error saving video to database:', saveError);
                }
            } else {
                // Mode invité : on décrémente localement mais on ne persiste pas
                setUserTokens(prev => Math.max(0, prev - videoCost));
                tokensDeducted = true;
            }
        } catch (err: any) {
            if (err.message && err.message.includes("Requested entity was not found.")) {
                 setError(t.errorInvalidApiKey);
            } else {
                setError(err.message || t.errorUnknown);
            }
            if (tokensDeducted) {
                setUserTokens(prev => prev + videoCost); // Refund tokens on failure
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = useCallback(async () => {
        if (!generatedVideoUrl || isDownloading) {
            return;
        }

        setIsDownloading(true);
        setDownloadMessage(t.downloadPreparing ?? 'Préparation du téléchargement…');

        try {
            const processed = await appendClosingClip(generatedVideoUrl, {
                resolutionLabel: resolution,
                requestedAspectRatio: aspectRatio,
                preferredFileName: `viralis-${Date.now()}`,
            });

            if (!processed) {
                throw new Error('Post-traitement impossible.');
            }

            setDownloadMessage(t.downloadFinalizing ?? 'Finalisation…');
            const url = URL.createObjectURL(processed.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = processed.outputFileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            setDownloadMessage(null);
        } catch (downloadError) {
            console.error('Erreur lors du téléchargement :', downloadError);
            setError(t.downloadError ?? 'Impossible de télécharger la vidéo. Réessaie.');
        } finally {
            setIsDownloading(false);
            setDownloadMessage(null);
        }
    }, [
        generatedVideoUrl,
        isDownloading,
        resolution,
        aspectRatio,
        t.downloadPreparing,
        t.downloadFinalizing,
        t.downloadError,
    ]);

    return (
        <>
            {showSocialProof && <SocialProofStats language={language} />}
            <div className="max-w-6xl mx-auto animate-fade-in-up">
                <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-50 mb-4" style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
                    {t.generatorTitle}
                </h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                   {t.generatorSubtitle}
                </p>
            </div>

            {/* Generator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                {/* Left Side - Controls */}
                <div className="lg:col-span-2 relative">
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff9d]/20 via-[#00b3ff]/20 to-[#00ff9d]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <h2 className="text-2xl font-bold mb-6" style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
                            {t.generatorSettingsTitle}
                        </h2>
                        <div className="space-y-5">
                        {styleCategories.length > 0 && (
                            <div className="relative">
                                <label className="text-slate-300 font-medium flex items-center gap-2 mb-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-semibold">🎨</span>
                                    {t.generatorStyleLabel}
                                </label>
                                <p className="text-xs text-slate-400 mb-3">
                                    {t.generatorStyleDescription}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsStyleModalOpen(true)}
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                                        isLoading
                                            ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900/60 text-slate-400'
                                            : 'border-slate-700/50 bg-gradient-to-r from-slate-900/60 to-slate-800/60 text-slate-200 hover:border-[#00ff9d]/50 hover:bg-gradient-to-r hover:from-[#00ff9d]/10 hover:to-[#00b3ff]/10 hover:text-white hover:shadow-[0_0_15px_rgba(0,255,153,0.2)]'
                                    }`}
                                    aria-haspopup="dialog"
                                    aria-expanded={isStyleModalOpen}
                                >
                                    <span className="flex items-center gap-3">
                                        <span
                                            className={`h-3 w-3 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(0,255,153,0.35)] ${
                                                selectedStyleOption ? 'bg-brand-green' : 'bg-slate-600/80'
                                            }`}
                                        />
                                        <span className="font-medium truncate">{styleButtonLabel}</span>
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isStyleModalOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {selectedStyleOption ? (
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <p className="text-xs text-brand-green/90 font-semibold">
                                            {selectedStyleOption.label}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedStyle('none')}
                                            className="text-xs text-slate-400 hover:text-brand-green transition-colors"
                                        >
                                            {t.generatorStyleNone}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 mt-2">
                                        {t.generatorStyleNone}
                                    </p>
                                )}
                            </div>
                        )}

                        {themeOptions.length > 0 && (
                            <div ref={themeDropdownRef} className="relative">
                                <label className="text-slate-300 font-medium flex items-center gap-2 mb-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-semibold">🎬</span>
                                    {t.generatorThemeLabel}
                                </label>
                                <p className="text-xs text-slate-400 mb-3">
                                    {t.generatorThemeDescription}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsThemeDropdownOpen(prev => !prev)}
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                                        isLoading
                                            ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900/60 text-slate-400'
                                            : 'border-slate-700/50 bg-gradient-to-r from-slate-900/60 to-slate-800/60 text-slate-200 hover:border-[#00ff9d]/50 hover:bg-gradient-to-r hover:from-[#00ff9d]/10 hover:to-[#00b3ff]/10 hover:text-white hover:shadow-[0_0_15px_rgba(0,255,153,0.2)]'
                                    }`}
                                    aria-haspopup="listbox"
                                    aria-expanded={isThemeDropdownOpen}
                                >
                                    <span className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                            style={{ backgroundColor: selectedThemeOption?.color ?? '#3DFF8C' }}
                                        />
                                        <span className="font-medium">{selectedThemeOption?.label ?? 'Sélectionner un thème'}</span>
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isThemeDropdownOpen && (
                                    <div
                                        className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] animate-fade-in"
                                        role="listbox"
                                    >
                                        {themeOptions.map(option => {
                                            const isActive = option.value === selectedTheme;
                                            return (
                                                <button
                                                    type="button"
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSelectedTheme(option.value);
                                                        setIsThemeDropdownOpen(false);
                                                    }}
                                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                                                        isActive
                                                            ? 'bg-brand-green/15 text-white'
                                                            : 'text-slate-300 hover:bg-brand-green/10 hover:text-white'
                                                    }`}
                                                    role="option"
                                                    aria-selected={isActive}
                                                >
                                                    <span
                                                        className="h-3 w-3 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                                                        style={{ backgroundColor: option.color ?? '#3DFF8C' }}
                                                    />
                                                    <span>{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {musicOptions.length > 0 && (
                            <div ref={musicDropdownRef} className="relative">
                                <label className="text-slate-300 font-medium flex items-center gap-2 mb-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-semibold">🎵</span>
                                    {t.generatorMusicLabel}
                                </label>
                                <p className="text-xs text-slate-400 mb-3">
                                    {t.generatorMusicDescription}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsMusicDropdownOpen(prev => !prev)}
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                                        isLoading
                                            ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900/60 text-slate-400'
                                            : 'border-slate-700/50 bg-gradient-to-r from-slate-900/60 to-slate-800/60 text-slate-200 hover:border-[#00ff9d]/50 hover:bg-gradient-to-r hover:from-[#00ff9d]/10 hover:to-[#00b3ff]/10 hover:text-white hover:shadow-[0_0_15px_rgba(0,255,153,0.2)]'
                                    }`}
                                    aria-haspopup="listbox"
                                    aria-expanded={isMusicDropdownOpen}
                                >
                                    <span className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                            style={{ backgroundColor: selectedMusicOption?.color ?? '#3DFF8C' }}
                                        />
                                        <span className="font-medium">{selectedMusicOption?.label ?? 'Sélectionner une ambiance sonore'}</span>
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isMusicDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isMusicDropdownOpen && (
                                    <div
                                        className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] animate-fade-in"
                                        role="listbox"
                                    >
                                        {musicOptions.map(option => {
                                            const isActive = option.value === selectedMusic;
                                            return (
                                                <button
                                                    type="button"
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSelectedMusic(option.value);
                                                        setIsMusicDropdownOpen(false);
                                                    }}
                                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                                                        isActive
                                                            ? 'bg-brand-green/15 text-white'
                                                            : 'text-slate-300 hover:bg-brand-green/10 hover:text-white'
                                                    }`}
                                                    role="option"
                                                    aria-selected={isActive}
                                                >
                                                    <span
                                                        className="h-3 w-3 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                                                        style={{ backgroundColor: option.color ?? '#3DFF8C' }}
                                                    />
                                                    <span>{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <textarea
                            className="w-full bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ff9d]/50 focus:border-[#00ff9d]/50 transition-all duration-300 backdrop-blur-sm resize-none"
                            rows={5}
                            placeholder={t.promptPlaceholder}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                        
                        {imagePreview ? (
                            <div className="relative group">
                                <img src={imagePreview} alt="Upload preview" className="w-full h-auto rounded-lg" />
                                <button onClick={removeImage} className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100" disabled={isLoading}>
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-br from-slate-900/60 to-slate-800/60 hover:from-[#00ff9d]/10 hover:to-[#00b3ff]/10 border border-dashed border-slate-600/50 hover:border-[#00ff9d]/50 rounded-xl p-6 text-slate-400 hover:text-white transition-all duration-300 group" disabled={isLoading}>
                               <ImageIcon className="w-6 h-6 group-hover:text-[#00ff9d] transition-colors" />
                               <span className="font-medium">{t.uploadImageLabel}</span>
                            </button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

                        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-900/40 to-slate-800/40 rounded-xl border border-slate-700/30">
                             <label className="text-slate-200 font-semibold flex items-center gap-2"><AspectRatioIcon className="w-5 h-5 text-[#00ff9d]"/>{t.aspectRatioLabel}</label>
                            <div className="flex space-x-2 bg-slate-900/60 p-1 rounded-lg border border-slate-700/50">
                                <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${aspectRatio === '9:16' ? 'bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] text-slate-950 shadow-[0_0_15px_rgba(0,255,153,0.4)]' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'} transform hover:scale-105`} disabled={isLoading}>9:16</button>
                                <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${aspectRatio === '16:9' ? 'bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] text-slate-950 shadow-[0_0_15px_rgba(0,255,153,0.4)]' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'} transform hover:scale-105`} disabled={isLoading}>16:9</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-900/40 to-slate-800/40 rounded-xl border border-slate-700/30">
                            <label className="text-slate-200 font-semibold flex items-center gap-2"><ResolutionIcon className="w-5 h-5 text-[#00ff9d]"/>{t.qualityLabel}</label>
                            <div className="flex space-x-2 bg-slate-900/60 p-1 rounded-lg border border-slate-700/50">
                                <button onClick={() => setResolution('720p')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${resolution === '720p' ? 'bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] text-slate-950 shadow-[0_0_15px_rgba(0,255,153,0.4)]' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'} transform hover:scale-105`} disabled={isLoading}>720p</button>
                                <button onClick={() => setResolution('1080p')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${resolution === '1080p' ? 'bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] text-slate-950 shadow-[0_0_15px_rgba(0,255,153,0.4)]' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'} transform hover:scale-105`} disabled={isLoading}>1080p</button>
                            </div>
                        </div>

                         <div className="flex items-center justify-between bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-slate-700/50 p-4 rounded-xl hover:border-[#00ff9d]/30 transition-all duration-300">
                             <label htmlFor="thinking-mode" className="text-slate-200 font-semibold flex items-center gap-3 cursor-pointer">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00ff9d]/20 to-[#00b3ff]/20">
                                    <BrainCircuitIcon className="w-5 h-5 text-[#00ff9d]"/>
                                </div>
                                <div>
                                    <p className="font-medium">{t.thinkingModeLabel}</p>
                                    <p className="text-xs text-slate-400">{t.thinkingModeDescription}</p>
                                </div>
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" id="thinking-mode" checked={useThinkingMode} onChange={() => setUseThinkingMode(!useThinkingMode)} className="sr-only peer" disabled={isLoading} />
                              <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00ff9d]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00ff9d] peer-checked:to-[#00b3ff] shadow-[0_0_10px_rgba(0,255,153,0.4)]"></div>
                            </label>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || (!prompt && !imageFile)}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:from-[#00ff9d]/90 hover:to-[#00b3ff]/90 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-[0_0_25px_rgba(0,255,153,0.3)] hover:shadow-[0_0_40px_rgba(0,255,153,0.5)] relative overflow-hidden group"
                        >
                            <style>
                                {`
                                    @keyframes sparkle {
                                        0%, 100% {
                                            opacity: 0;
                                            transform: scale(0) rotate(0deg);
                                        }
                                        50% {
                                            opacity: 1;
                                            transform: scale(1) rotate(180deg);
                                        }
                                    }
                                    .sparkle {
                                        animation: sparkle 1.5s ease-in-out infinite;
                                    }
                                    .sparkle:nth-child(1) { animation-delay: 0s; }
                                    .sparkle:nth-child(2) { animation-delay: 0.3s; }
                                    .sparkle:nth-child(3) { animation-delay: 0.6s; }
                                    .sparkle:nth-child(4) { animation-delay: 0.9s; }
                                `}
                            </style>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            {isLoading ? (
                                <span>{loadingMessage}</span>
                            ) : (
                                <>
                                    <div className="relative z-10 flex items-center justify-center w-6 h-6">
                                        <span className="absolute sparkle text-lg">✨</span>
                                        <span className="absolute sparkle text-sm" style={{transform: 'translate(-8px, -4px)'}}>⭐</span>
                                        <span className="absolute sparkle text-xs" style={{transform: 'translate(8px, 4px)'}}>✨</span>
                                        <span className="absolute sparkle text-sm" style={{transform: 'translate(0px, -8px)'}}>⭐</span>
                                    </div>
                                    <span className="relative z-10">{useThinkingMode ? `${t.generateScriptButton} (${SCRIPT_GENERATION_COST} ${t.tokens})` : `${t.generateVideoButton} (${videoCost} ${t.tokens})`}</span>
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-400 text-center">{error}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Side - Output */}
                <div className={`lg:col-span-3 relative flex`}>
                    {/* Background Glow */}
                    <div className={`absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-500 ${isLoading ? 'bg-gradient-to-r from-[#00ff9d]/30 via-[#00b3ff]/30 to-[#00ff9d]/30 opacity-75 animate-pulse' : 'bg-gradient-to-r from-[#00ff9d]/10 via-[#00b3ff]/10 to-[#00ff9d]/10 opacity-50'}`}></div>
                    
                    <div className={`relative bg-gradient-to-br from-slate-950/95 to-slate-900/95 backdrop-blur-xl border ${isLoading ? 'border-[#00ff9d]/50' : 'border-slate-800/50'} p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col w-full h-full overflow-hidden`}>
                        <GridPattern className="opacity-30"/>
                        <div className="relative z-10 w-full flex-grow flex flex-col items-center justify-center gap-4">
                        {isLoading && !playableVideoUrl && (
                            <div className="text-center text-slate-200">
                                 <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-[#00ff9d]/20 border-t-[#00ff9d] border-r-[#00b3ff] mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,153,0.4)]">
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00ff9d] animate-spin" style={{animationDuration: '1.5s'}}></div>
                                 </div>
                                <p className="text-lg font-bold bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] bg-clip-text text-transparent">{loadingMessage}</p>
                            </div>
                        )}
                        {playableVideoUrl && (
                            <>
                                <div className="relative w-full flex-grow">
                                    <video
                                        src={playableVideoUrl}
                                        controls
                                        autoPlay
                                        loop
                                        className="w-full h-full object-contain rounded-lg min-h-0"
                                    />
                                </div>
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="flex-shrink-0 mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:from-[#00ff9d]/90 hover:to-[#00b3ff]/90 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none shadow-[0_0_25px_rgba(0,255,153,0.3)] hover:shadow-[0_0_40px_rgba(0,255,153,0.5)] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <ArrowDownCircleIcon className="w-6 h-6 relative z-10" />
                                    <span className="relative z-10">{isDownloading ? (downloadMessage ?? t.downloadWorking ?? 'Téléchargement…') : t.downloadVideo}</span>
                                </button>
                                {downloadMessage && (
                                    <p className="text-xs text-slate-400 text-center max-w-md">
                                        {downloadMessage}
                                    </p>
                                )}
                            </>
                        )}
                        {!playableVideoUrl && !isLoading && (
                             <div className="text-center text-slate-400 flex flex-col items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00ff9d]/10 to-[#00b3ff]/10">
                                    <FilmIcon className="w-16 h-16 text-[#00ff9d]" />
                                </div>
                                <p className="text-xl font-bold bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] bg-clip-text text-transparent">{t.outputTitle}</p>
                                <p className="text-slate-400">{t.outputSubtitle}</p>
                            </div>
                        )}
                    </div>
                    {/* Watermark Warning Banner */}
                </div>
            </div>
            </div>

            {isStyleModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setIsStyleModalOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/95 shadow-[0_0_40px_rgba(0,255,153,0.2)]"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t.generatorStyleModalTitle}
                    >
                        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{t.generatorStyleModalTitle}</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    {t.generatorStyleModalSubtitle}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsStyleModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 border-b border-slate-800">
                            <button
                                type="button"
                                onClick={() => handleStyleSelection('none')}
                                className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all ${
                                    selectedStyle === 'none'
                                        ? 'border-brand-green/70 bg-brand-green/10 text-brand-green'
                                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-brand-green/40 hover:text-white'
                                }`}
                            >
                                <span>{t.generatorStyleNone}</span>
                                <span className={`text-xs font-semibold ${selectedStyle === 'none' ? 'text-brand-green' : 'text-slate-500'}`}>
                                    {selectedStyle === 'none' ? '✓' : ''}
                                </span>
                            </button>
                        </div>
                        <div className="px-6 pb-6 pt-5 overflow-y-auto max-h-[calc(85vh-180px)] space-y-8 pr-2">
                            {styleCategories.map(category => (
                                <div key={category.id} className="space-y-3">
                                    <div>
                                        <h4 className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                                            {category.title}
                                        </h4>
                                        {category.description && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {category.options.map(option => {
                                            const isActive = selectedStyle === option.value;
                                            return (
                                                <button
                                                    type="button"
                                                    key={option.value}
                                                    onClick={() => handleStyleSelection(option.value)}
                                                    className={`w-full text-left rounded-xl border px-4 py-4 transition-all ${
                                                        isActive
                                                            ? 'border-brand-green/80 bg-brand-green/15 text-white shadow-[0_0_25px_rgba(0,255,153,0.18)]'
                                                            : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-brand-green/40 hover:bg-slate-900/80'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <span className="font-semibold">{option.label}</span>
                                                        {isActive && <span className="text-brand-green text-xs font-semibold">✓</span>}
                                                    </div>
                                                    {option.promptInstruction && (
                                                        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                                            {option.promptInstruction}
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default VideoGenerator;