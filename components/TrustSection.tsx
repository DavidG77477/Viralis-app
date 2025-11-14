import React from 'react';
import { CheckCircleIcon } from './icons/Icons';
import type { Language } from '../App';
import { translations } from '../translations';


const TrustSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const vignettes = t.trustVignettes;
  const benefits = t.trustBenefits;
  
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4" style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
              {t.trustTitle}
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              {t.trustSubtitle}
            </p>
            <div className="space-y-4 mb-8">
                <p className="font-semibold text-white">{t.trustAllows}</p>
                <ul className="space-y-3">
                    {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start">
                            <CheckCircleIcon className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" />
                            <span className="text-slate-300">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-lg font-semibold text-brand-green">
              {t.trustJoin}
            </p>
          </div>

          {/* Right Column: Vignettes */}
          <div className="grid grid-cols-1 gap-6">
            {vignettes.map((vignette, index) => (
              <div key={index} className="bg-panel-gradient p-6 rounded-xl border border-slate-800 shadow-inner-panel flex items-center gap-5 transition-transform hover:scale-105">
                <div className="text-4xl">
                  {vignette.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{vignette.title}</h3>
                  <p className="text-slate-400">{vignette.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustSection;