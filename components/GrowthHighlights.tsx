import React from 'react';
import type { Language } from '../App';
import { translations } from '../translations';

const GrowthHighlights: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const highlights = t.growthHighlights ?? [];
  const subtitle = t.growthHighlightsSubtitle;

  if (!highlights.length) {
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto text-center animate-fade-in-up">
        <h2
          className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4"
          style={{
            background: 'linear-gradient(90deg, #00ff9d, #00b3ff)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {t.growthHighlightsTitle}
        </h2>
        {subtitle && (
          <p className="text-slate-400 max-w-3xl mx-auto mb-12">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-panel-gradient rounded-2xl border border-slate-800 px-8 py-10 text-left shadow-inner-panel transition-transform hover:-translate-y-2 hover:border-[#00ff9d]/60"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff8a5c] to-[#ff4f81] flex items-center justify-center text-3xl mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthHighlights;

