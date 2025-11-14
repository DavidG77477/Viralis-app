import React from 'react';
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
                                                src={mediaAssets[ex.mediaKey]!}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                preload="auto"
                                                playsInline
                                                muted
                                                loop
                                                autoPlay
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
