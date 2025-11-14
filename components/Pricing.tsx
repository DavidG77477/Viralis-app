import React from 'react';
import { CheckCircleIcon } from './icons/Icons';
import type { Language } from '../App';
import { translations } from '../translations';
import tokenIcon from '../attached_assets/token.png';


const Pricing: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const pricingPlans = t.pricingPlans;
    const tokenPacks = pricingPlans.slice(0, 2);
    const proPlans = pricingPlans.slice(2);
    
    return (
        <section id="pricing" className="relative pt-6 pb-24 px-4 md:px-8 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[#3DFF8C]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-[#5AC8FF]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

            <div className="relative container mx-auto text-center animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-50 mb-4"
                    style={{background: 'linear-gradient(90deg, #3DFF8C, #5AC8FF)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
                    {t.pricingTitle}
                </h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12">
                    {t.pricingSubtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                    {/* Column 1: Stacked Token Packs */}
                    <div className="flex flex-col gap-8">
                        {tokenPacks.map((plan) => (
                             <div key={plan.title} className="bg-gradient-to-br from-[#3DFF8C] to-[#5AC8FF] p-[1.5px] rounded-2xl shadow-[0_0_20px_rgba(61,255,140,0.1),_0_0_20px_rgba(90,200,255,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(61,255,140,0.2),_0_0_30px_rgba(90,200,255,0.2)]">
                                <div className="bg-[#171A1F] bg-panel-gradient p-6 rounded-[14.5px] flex flex-col h-full relative" role="region" aria-labelledby={`plan-title-${plan.title}`}>
                                    {plan.badge && (
                                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF] text-slate-950 text-xs font-bold py-1 px-4 rounded-full">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <div className="pt-4 flex-grow flex flex-col">
                                        <h3 id={`plan-title-${plan.title}`} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF]">{plan.title}</h3>
                                        <p className="text-4xl font-extrabold text-white my-4">{plan.price} <span className="text-base font-normal text-slate-400">{t.pricingVat}</span></p>
                                        <div className="flex items-start justify-center gap-2 text-slate-400 mb-6 min-h-[3rem]">
                                            <img src={tokenIcon} alt="Tokens" className="w-5 h-5 mt-1" />
                                            <span>{plan.priceSubtitle}</span>
                                        </div>
                                        
                                        <a href={plan.href} className="w-full mt-auto bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                                            {plan.ctaText}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Columns 2 & 3: Pro Plans */}
                    {proPlans.map((plan) => (
                        <div key={plan.title} className="bg-gradient-to-br from-[#3DFF8C] to-[#5AC8FF] p-[1.5px] rounded-2xl shadow-[0_0_20px_rgba(61,255,140,0.1),_0_0_20px_rgba(90,200,255,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(61,255,140,0.2),_0_0_30px_rgba(90,200,255,0.2)] h-full">
                            <div className="bg-[#171A1F] bg-panel-gradient p-6 rounded-[14.5px] flex flex-col h-full relative" role="region" aria-labelledby={`plan-title-${plan.title}`}>
                                {plan.badge && (
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF] text-slate-950 text-xs font-bold py-1 px-4 rounded-full">
                                        {plan.badge}
                                    </div>
                                )}
                                <div className="pt-4 flex-grow flex flex-col">
                                    <h3 id={`plan-title-${plan.title}`} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF]">{plan.title}</h3>
                                    <p className="text-4xl font-extrabold text-white my-4">{plan.price} <span className="text-base font-normal text-slate-400">{t.pricingVat}</span></p>
                                    <div className="flex items-start justify-center gap-2 text-slate-400 mb-6 min-h-[3rem]">
                                        <img src={tokenIcon} alt="Tokens" className="w-5 h-5 mt-1" />
                                        <span>{plan.priceSubtitle}</span>
                                    </div>
                                    
                                    {plan.features && (
                                        <ul className="space-y-3 mb-8 text-left flex-grow">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start">
                                                    <CheckCircleIcon className="w-5 h-5 text-brand-green mr-3 flex-shrink-0 mt-1" />
                                                    <span className="text-slate-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    
                                    <a href={plan.href} className="w-full mt-auto bg-gradient-to-r from-[#3DFF8C] to-[#5AC8FF] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                                        {plan.ctaText}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;