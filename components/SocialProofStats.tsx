import React from 'react';
import type { Language } from '../App';
import { translations } from '../translations';

type SocialProofAvatar = {
  name: string;
  src: string;
};

type SocialProofContent = {
  introText: string;
  linkText: string;
  linkHref: string;
  totalUsers: number;
  totalUsersOverride?: string;
  totalLabel: string;
  rating: number;
  ratingLabel: string;
  avatars: SocialProofAvatar[];
};

const defaultSocialProof: SocialProofContent = {
  introText: 'Already using Viralis Studio?',
  linkText: 'Sign In',
  linkHref: '/auth?mode=sign-in',
  totalUsers: 2291,
  totalUsersOverride: '10,000+',
  totalLabel: 'Happy customers',
  rating: 4.8,
  ratingLabel: 'Average rating',
  avatars: [
    { name: 'Alicia Green', src: 'https://i.pravatar.cc/80?img=14' },
    { name: 'Michael Torres', src: 'https://i.pravatar.cc/80?img=39' },
    { name: 'Priya Singh', src: 'https://i.pravatar.cc/80?img=58' },
    { name: 'Noah Johnson', src: 'https://i.pravatar.cc/80?img=60' },
  ],
};

const localeMap: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
};

const avatarAltPrefix: Record<Language, string> = {
  fr: 'Avatar de',
  en: 'Avatar of',
  es: 'Avatar de',
};

const ratingAriaLabel = (language: Language, ratingLabel: string, rating: number) => {
  const value = rating.toFixed(1);
  switch (language) {
    case 'fr':
      return `${ratingLabel} : ${value} sur 5`;
    case 'es':
      return `${ratingLabel}: ${value} de 5`;
    default:
      return `${ratingLabel}: ${value} out of 5`;
  }
};

const getStarIcon = (key: string, variant: 'full' | 'half' | 'empty') => {
  if (variant === 'half') {
    return (
      <svg key={key} className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={`half-star-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="rgba(148,163,184,0.6)" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#half-star-${key})`}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.457a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.38-2.457a1 1 0 0 0-1.176 0l-3.38 2.457c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L3.047 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 0 0 .95-.69l1.286-3.967Z"
        />
      </svg>
    );
  }

  if (variant === 'empty') {
    return (
      <svg key={key} className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.457a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.38-2.457a1 1 0 0 0-1.176 0l-3.38 2.457c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L3.047 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 0 0 .95-.69l1.286-3.967Z"
        />
      </svg>
    );
  }

  return (
    <svg key={key} className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 0 0 .95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.457a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.38-2.457a1 1 0 0 0-1.176 0l-3.38 2.457c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L3.047 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 0 0 .95-.69l1.286-3.967Z"
      />
    </svg>
  );
};

const SocialProofStats: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const socialProofSource = (t.heroSocialProof ?? {}) as Partial<SocialProofContent>;
  const socialProof: SocialProofContent = {
    ...defaultSocialProof,
    ...socialProofSource,
    avatars: socialProofSource.avatars && socialProofSource.avatars.length > 0
      ? socialProofSource.avatars
      : defaultSocialProof.avatars,
  };

  const displayedAvatars = socialProof.avatars.slice(0, 3);
  const extraAvatarCount = Math.max(0, socialProof.avatars.length - displayedAvatars.length);
  const formattedTotalUsers =
    typeof socialProof.totalUsersOverride === 'string'
      ? socialProof.totalUsersOverride
      : socialProof.totalUsers.toLocaleString(localeMap[language]);

  const ratingStars = (() => {
    const stars: JSX.Element[] = [];
    const rating = Math.max(0, Math.min(5, socialProof.rating));
    const fullStars = Math.floor(rating);
    const fraction = rating - fullStars;
    const hasHalfStar = fraction >= 0.25 && fraction < 0.75;

    for (let i = 0; i < fullStars; i += 1) {
      stars.push(getStarIcon(`full-${i}`, 'full'));
    }

    if (hasHalfStar) {
      stars.push(getStarIcon(`half-${fullStars}`, 'half'));
    } else if (fraction >= 0.75) {
      stars.push(getStarIcon(`extra-${fullStars}`, 'full'));
    }

    while (stars.length < 5) {
      stars.push(getStarIcon(`empty-${stars.length}`, 'empty'));
    }

    return stars.slice(0, 5);
  })();

  return (
    <div className="mx-auto mb-14 mt-20 max-w-6xl px-2 md:mb-16 md:mt-28 md:px-4 lg:mt-32">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-6 py-7 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-sm md:px-10 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-2 text-slate-300 md:items-start">
            <p className="text-sm font-medium text-slate-300">{socialProof.introText}</p>
            <a
              href={socialProof.linkHref}
              className="text-sm font-semibold text-[#8b7bff] hover:text-[#a495ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b7bff]"
            >
              {socialProof.linkText}
            </a>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <div className="flex justify-center md:justify-start">
              <div className="flex -space-x-3">
                {displayedAvatars.map((avatar, index) => (
                  <img
                    key={`${avatar.name}-${index}`}
                    src={avatar.src}
                    alt={`${avatarAltPrefix[language]} ${avatar.name}`}
                    className="h-12 w-12 rounded-full border-2 border-slate-900 object-cover shadow-sm"
                    loading="lazy"
                  />
                ))}
                {extraAvatarCount > 0 && (
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800/80 text-xs font-semibold text-slate-200 shadow-sm">
                    +{extraAvatarCount}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-extrabold tracking-tight text-white">{formattedTotalUsers}</p>
              <p className="text-sm font-medium text-slate-400">{socialProof.totalLabel}</p>
            </div>
          </div>

          <div className="hidden h-16 w-px bg-slate-800 md:block" aria-hidden="true" />

          <div className="flex flex-col items-center gap-2 md:min-w-[160px]">
            <div
              className="flex flex-col items-center md:items-end"
              role="img"
              aria-label={ratingAriaLabel(language, socialProof.ratingLabel, socialProof.rating)}
            >
              <p className="text-lg font-semibold text-white">
                {socialProof.rating.toFixed(1)}/5
              </p>
              <div className="flex items-center" aria-hidden="true">
                {ratingStars}
              </div>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
              {socialProof.ratingLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofStats;

