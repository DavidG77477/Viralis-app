import React from 'react';
import type { Language } from '../App';
import { translations } from '../translations';

const Features: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const features = t.features;

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto text-center animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-12"
            style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-panel-gradient p-6 rounded-xl border border-slate-800 shadow-inner-panel text-left transition-transform hover:scale-105">
              <div className="text-4xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;