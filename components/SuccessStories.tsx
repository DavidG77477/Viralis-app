import React from 'react';
import type { Language } from '../App';
import { translations } from '../translations';

interface SuccessStory {
  quote: string;
  name: string;
  amount: string;
  description: string;
  avatar: string;
}

const SuccessStories: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const stories = t.successStories;

  const scrollToGenerator = () => {
    const generatorElement = document.getElementById('generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="pt-24 pb-6 px-4 md:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-[#00ff9d]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-[#00b3ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="container mx-auto text-center animate-fade-in-up relative z-10">
        <h2 
          className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4"
          style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}
        >
          {t.successStoriesTitle}
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-16">
          {t.successStoriesSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-panel-gradient p-6 rounded-2xl border border-slate-800 shadow-lg shadow-inner-panel text-left transition-transform hover:scale-105 hover:border-brand-green/50"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-14 h-14 rounded-full border-2 border-brand-green/30 shadow-md"
                />
                <div className="flex-grow">
                  <p className="font-semibold text-white text-lg">{story.name}</p>
                  <p className="text-brand-green font-bold text-xl mt-1">{story.amount}</p>
                </div>
              </div>
              
              <blockquote className="text-slate-300 italic mb-4 leading-relaxed">
                "{story.quote}"
              </blockquote>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                {story.description}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToGenerator}
          className="bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,153,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {t.successStoriesCta}
        </button>
      </div>
    </section>
  );
};

export default SuccessStories;

