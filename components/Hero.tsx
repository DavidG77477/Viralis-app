import React from 'react';
import type { Language } from '../App';
import { translations } from '../translations';
import heroImage from '../attached_assets/2k.png';
import secondaryImage from '../attached_assets/10k.png';
import laptopImage from '../attached_assets/laptop.png';
import tokenImage from '../attached_assets/token.png';

interface FloatingReaction {
  id: string;
  emoji: string;
  top: string;
  left: string;
  floatX: string;
  floatY: string;
  delay: string;
  duration: string;
  startScale: number;
  endScale: number;
}

const Hero: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];

  const floatingReactions: FloatingReaction[] = [
    {
      id: 'reaction-heart-1',
      emoji: '❤️',
      top: '58%',
      left: '28%',
      floatX: '-220px',
      floatY: '-220px',
      delay: '0s',
      duration: '11s',
      startScale: 0.55,
      endScale: 1.65,
    },
    {
      id: 'reaction-like-1',
      emoji: '💙',
      top: '61%',
      left: '76%',
      floatX: '240px',
      floatY: '-210px',
      delay: '2.5s',
      duration: '12s',
      startScale: 0.5,
      endScale: 1.6,
    },
    {
      id: 'reaction-heart-2',
      emoji: '💖',
      top: '66%',
      left: '22%',
      floatX: '-210px',
      floatY: '-180px',
      delay: '4.2s',
      duration: '13s',
      startScale: 0.6,
      endScale: 1.7,
    },
    {
      id: 'reaction-like-2',
      emoji: '👍🏼',
      top: '52%',
      left: '82%',
      floatX: '260px',
      floatY: '-190px',
      delay: '5.5s',
      duration: '12.5s',
      startScale: 0.55,
      endScale: 1.75,
    },
    {
      id: 'reaction-heart-3',
      emoji: '💛',
      top: '70%',
      left: '80%',
      floatX: '280px',
      floatY: '-160px',
      delay: '7s',
      duration: '14s',
      startScale: 0.6,
      endScale: 1.8,
    },
    {
      id: 'reaction-heart-4',
      emoji: '❤️',
      top: '54%',
      left: '18%',
      floatX: '-250px',
      floatY: '-200px',
      delay: '8s',
      duration: '12s',
      startScale: 0.5,
      endScale: 1.7,
    },
  ];

  const Laurel: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'left' }) => (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.35)] ${
        direction === 'right' ? 'scale-x-[-1]' : ''
      }`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.4 53.6c-6.8-6-10.1-13.8-9.2-23.1 5.8 1.2 10.1 4 12.7 8.4-4.6-12.3-2.2-22.1 7.2-29.4 3.1 6.6 3.3 12.5 0.4 17.7 6.6-8.7 13.9-11.4 22-8-3.1 7.9-8 12.6-14.8 14.1 9.1 0 15.8 4.3 20 12.9-8 2-14.5 0.7-19.4-3.9 3.8 7.5 3.2 14.3-1.8 20.4-6.5-4.2-9.8-9.6-9.8-16.4-2 5.9-6.4 9.7-13.2 11.3Z"
        fill="currentColor"
      />
    </svg>
  );

  const scrollToGenerator = () => {
    const generatorElement = document.getElementById('generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="pt-40 pb-16 md:pt-48 md:pb-24 animate-fade-in">
      <style>
        {`
          @keyframes viralis-float-reaction {
            0% {
              transform: translate3d(0, 0, 0) scale(var(--start-scale, 0.6));
              opacity: 0;
            }
            12% {
              opacity: 1;
            }
            70% {
              opacity: 0.9;
            }
            100% {
              transform: translate3d(var(--float-x, 0px), var(--float-y, -180px), 0) scale(var(--end-scale, 1.6));
              opacity: 0;
            }
          }
          @keyframes float-gentle {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          /* iPad landscape specific adjustment for 10k image - déplacer plus à droite */
          @media only screen 
            and (min-width: 834px) 
            and (max-width: 1366px) 
            and (orientation: landscape) {
            .ipad-landscape-right {
              right: calc(1.5rem - 200px) !important; /* Déplacer de 200px vers la droite */
            }
          }
          /* iPad portrait specific adjustment for 10k image - déplacer plus à droite */
          @media only screen 
            and (min-width: 768px) 
            and (max-width: 1024px) 
            and (orientation: portrait) {
            .ipad-landscape-right {
              right: calc(1.5rem - 200px) !important; /* Déplacer de 200px vers la droite */
            }
          }
        `}
      </style>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start lg:items-center">
          <div className="flex-1 max-w-2xl text-center md:text-left w-full md:w-auto">
            <h1
              className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
              style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}
            >
              {t.heroTitle} 🎬
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8">
              {t.heroSubtitle}
            </p>
            <button
              onClick={scrollToGenerator}
              className="bg-gradient-green text-slate-950 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,153,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green flex items-center justify-center gap-3"
            >
              <img src={tokenImage} alt="Token" className="w-6 h-6" />
              {t.heroCta}
            </button>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 text-muted md:flex-row md:items-center md:justify-start md:gap-8">
              <span>{t.heroTrust1}</span>
              <span>{t.heroTrust2}</span>
              <span>{t.heroTrust3}</span>
            </div>
          </div>
          <div className="relative flex-1 flex justify-center translate-x-2 md:translate-x-4 lg:translate-x-8">
            {floatingReactions.map((reaction) => {
              const reactionStyle: React.CSSProperties = {
                top: reaction.top,
                left: reaction.left,
                animationDelay: reaction.delay,
                animationDuration: reaction.duration,
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
                animationName: 'viralis-float-reaction',
              };

              (reactionStyle as unknown as Record<string, string | number>)['--float-x'] = reaction.floatX;
              (reactionStyle as unknown as Record<string, string | number>)['--float-y'] = reaction.floatY;
              (reactionStyle as unknown as Record<string, string | number>)['--start-scale'] = reaction.startScale;
              (reactionStyle as unknown as Record<string, string | number>)['--end-scale'] = reaction.endScale;

              return (
                <div
                  key={reaction.id}
                  className="pointer-events-none absolute hidden md:flex items-center justify-center z-30 mix-blend-screen"
                  style={reactionStyle}
                >
                  <span className="text-3xl md:text-4xl drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
                    {reaction.emoji}
                  </span>
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
              <div className="relative h-[440px] w-[560px] max-w-full rounded-[40px]">
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-[#00ff9d]/60 via-[#00b3ff]/50 to-[#00ff9d]/60 blur-[120px] opacity-50" />
                <div 
                  className="relative h-full w-full rounded-[40px] bg-gradient-to-r from-[#00ff9d]/80 via-[#00b3ff]/70 to-[#00ff9d]/80"
                  style={{
                    boxShadow: `
                      0 0 40px rgba(0, 255, 157, 0.4),
                      0 0 80px rgba(0, 179, 255, 0.3),
                      0 0 120px rgba(0, 255, 157, 0.25),
                      0 0 160px rgba(0, 179, 255, 0.2),
                      0 0 200px rgba(0, 255, 157, 0.15),
                      0 0 240px rgba(0, 179, 255, 0.1),
                      inset 0 0 30px rgba(0, 255, 157, 0.3),
                      inset 0 0 60px rgba(0, 179, 255, 0.2),
                      inset 0 0 90px rgba(0, 255, 157, 0.15)
                    `
                  }}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute left-0 top-28 hidden translate-x-8 translate-y-9 scale-[1.45] md:block z-15 
                            lg:left-[-2rem]">
              <img
                src={laptopImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="max-w-[360px] w-full rounded-2xl opacity-100"
                style={{
                  animation: 'float-gentle 3s ease-in-out infinite',
                  animationDelay: '0s'
                }}
              />
            </div>
            <div className="pointer-events-none absolute right-6 top-10 hidden translate-x-1 translate-y-1 scale-[1.02] md:block z-20 ipad-landscape-right">
              <img
                src={secondaryImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="max-w-[360px] w-full rounded-2xl opacity-100 blur-[0.5px]"
                style={{
                  animation: 'float-gentle 3.5s ease-in-out infinite',
                  animationDelay: '1.2s'
                }}
              />
            </div>
            <img
              src={heroImage}
              alt="Preview of viral video"
              loading="lazy"
              className="relative z-20 rounded-2xl shadow-lg max-w-[480px] h-auto"
              style={{
                animation: 'float-gentle 4s ease-in-out infinite',
                animationDelay: '0.6s'
              }}
            />
            <div className="absolute -bottom-16 left-1/2 flex w-full max-w-xl -translate-x-1/2 flex-col items-center gap-3">
              <div className="mt-6 flex items-center justify-center gap-6 text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.25)]">
                <Laurel direction="left" />
                <Laurel direction="right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
