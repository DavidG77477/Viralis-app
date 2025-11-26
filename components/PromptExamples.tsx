import React, { useRef, useEffect } from 'react';
import { FilmIcon, PlayIcon } from './icons/Icons';
import type { Language } from '../App';
import { translations } from '../translations';

const PromptExamples: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const examples = t.promptExamples;
    const mediaAssets: Record<string, string> = {
        giraffeInterview: '/videos/Giraffe.mp4',
        chienVolant: '/videos/chien_volant.mp4',
    };
    
    // Créer des refs pour toutes les vidéos
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    
    // Détecter Safari (y compris iPhone)
    const isSafari = typeof window !== 'undefined' && 
      (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
       /iPhone|iPad|iPod/i.test(navigator.userAgent));
    
    // Forcer l'autoplay sur Safari après chargement
    useEffect(() => {
        const tryPlayVideos = () => {
            console.log('[PromptExamples] Attempting to play all videos on Safari...');
            
            videoRefs.current.forEach((videoRef, index) => {
                if (videoRef && videoRef.paused) {
                    videoRef.play().then(() => {
                        console.log(`[PromptExamples] Video ${index} started playing`);
                    }).catch((err) => {
                        console.log(`[PromptExamples] Video ${index} autoplay prevented:`, err);
                    });
                }
            });
        };

        if (isSafari) {
            // Pour Safari, essayer plusieurs fois avec des délais différents
            const timeouts: NodeJS.Timeout[] = [];
            
            // Premier essai après 500ms
            timeouts.push(setTimeout(tryPlayVideos, 500));
            
            // Deuxième essai après 1.5s (quand les vidéos sont chargées)
            timeouts.push(setTimeout(tryPlayVideos, 1500));
            
            // Troisième essai après 3s
            timeouts.push(setTimeout(tryPlayVideos, 3000));
            
            // Aussi essayer après interaction utilisateur (clique n'importe où)
            const handleUserInteraction = () => {
                console.log('[PromptExamples] User interaction detected, attempting to play videos');
                tryPlayVideos();
            };
            
            document.addEventListener('touchstart', handleUserInteraction, { once: true });
            document.addEventListener('click', handleUserInteraction, { once: true });
            
            return () => {
                timeouts.forEach(timeout => clearTimeout(timeout));
                document.removeEventListener('touchstart', handleUserInteraction);
                document.removeEventListener('click', handleUserInteraction);
            };
        } else {
            // Pour les autres navigateurs, essayer une fois après chargement
            const timeout = setTimeout(tryPlayVideos, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isSafari]);

    return (
        <section className="py-24 px-4 md:px-8">
            <div className="container mx-auto text-center animate-fade-in-up">
                <h2
                    className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4"
                    style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}
                >
                    {t.promptExamplesTitle}
                </h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-16">
                    {t.promptExamplesSubtitle}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {examples.map((ex, index) => (
                        <div key={index} className="space-y-6" role="listitem">
                            <div className="bg-panel-gradient p-1 rounded-2xl border border-slate-800 shadow-lg shadow-inner-panel text-left flex flex-col">
                                <div className="flex items-center justify-between p-5">
                                    <span className="inline-block bg-slate-800 text-slate-300 text-sm font-medium py-1 px-3 rounded-full" role="status" aria-label="Category">
                                        {ex.category}
                                    </span>
                                    <p className="text-slate-400 font-semibold" aria-label="Generation time">
                                        ⚡ {t.generatedIn} {ex.generationTime}
                                    </p>
                                </div>
                                <div
                                    className={`relative w-full aspect-video rounded-lg mx-1 mb-4 overflow-hidden ${
                                        ex.mediaKey && mediaAssets[ex.mediaKey]
                                            ? 'bg-black/60 border border-slate-800'
                                            : 'bg-slate-900/50 border-2 border-dashed border-slate-700'
                                    }`}
                                    aria-label="Media preview"
                                >
                                    {ex.mediaKey && mediaAssets[ex.mediaKey] ? (
                                        <>
                                            <video
                                                ref={(el) => {
                                                    if (el) {
                                                        const videoIndex = examples.findIndex((ex2) => ex2.mediaKey === ex.mediaKey);
                                                        videoRefs.current[videoIndex] = el;
                                                    }
                                                }}
                                                src={mediaAssets[ex.mediaKey]!}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                preload="auto"
                                                playsInline
                                                muted
                                                loop
                                                autoPlay
                                                // @ts-ignore - Safari-specific attributes
                                                webkit-playsinline="true"
                                                // @ts-ignore - Safari-specific attributes
                                                x-webkit-airplay="allow"
                                                onLoadedMetadata={() => {
                                                    // Safari: Essayer aussi après chargement des métadonnées (plus tôt)
                                                    const videoIndex = examples.findIndex((ex2) => ex2.mediaKey === ex.mediaKey);
                                                    const videoRef = videoRefs.current[videoIndex];
                                                    if (isSafari && videoRef && videoRef.paused) {
                                                        setTimeout(() => {
                                                            if (videoRef && videoRef.paused) {
                                                                videoRef.play().then(() => {
                                                                    console.log(`[PromptExamples] Video ${videoIndex} started after loadedMetadata`);
                                                                }).catch((err) => {
                                                                    console.log(`[PromptExamples] Video ${videoIndex} autoplay failed after metadata:`, err);
                                                                });
                                                            }
                                                        }, 200);
                                                    }
                                                }}
                                                onLoadedData={() => {
                                                    // Safari: Forcer la lecture quand la vidéo est chargée
                                                    const videoIndex = examples.findIndex((ex2) => ex2.mediaKey === ex.mediaKey);
                                                    const videoRef = videoRefs.current[videoIndex];
                                                    if (isSafari && videoRef) {
                                                        setTimeout(() => {
                                                            if (videoRef && videoRef.paused) {
                                                                videoRef.play().then(() => {
                                                                    console.log(`[PromptExamples] Video ${videoIndex} started after loadedData`);
                                                                }).catch((err) => {
                                                                    console.log(`[PromptExamples] Video ${videoIndex} autoplay failed after load:`, err);
                                                                });
                                                            }
                                                        }, 100);
                                                    }
                                                }}
                                                onCanPlay={() => {
                                                    // Safari: Essayer de jouer quand la vidéo peut jouer
                                                    const videoIndex = examples.findIndex((ex2) => ex2.mediaKey === ex.mediaKey);
                                                    const videoRef = videoRefs.current[videoIndex];
                                                    if (isSafari && videoRef && videoRef.paused) {
                                                        videoRef.play().then(() => {
                                                            console.log(`[PromptExamples] Video ${videoIndex} started after canPlay`);
                                                        }).catch((err) => {
                                                            console.log(`[PromptExamples] Video ${videoIndex} autoplay failed after canplay:`, err);
                                                        });
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full blur-xl opacity-40"></div>
                                                    <div className="relative bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full p-4 shadow-[0_0_30px_rgba(0,255,153,0.4)]">
                                                        <PlayIcon className="w-8 h-8 text-slate-950" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <FilmIcon className="w-16 h-16 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-300 text-sm uppercase tracking-[0.2em] mb-2">
                                        {t.promptExamplesLabel}
                                    </p>
                                    <p
                                        className="text-slate-200 text-base leading-relaxed"
                                        aria-label="Prompt text"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        “{ex.prompt}”
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromptExamples;
