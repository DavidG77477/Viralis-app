import React from 'react';
import logoImage from '../../attached_assets/LOGO.png';

type IconProps = React.SVGProps<SVGSVGElement>;
type LogoProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const ViralisFullLogo: React.FC<LogoProps> = (props) => (
    <img src={logoImage} alt="Viralis Studio" {...props} />
);

export const TicketIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h5.25m-5.25 0h5.25m-5.25 0h5.25M3 13.5h3.375m-3.375 0h3.375m-3.375 0h3.375M9 6.75h3.375m-3.375 0h3.375m-3.375 0h3.375M3 9h3.375M3 6.75h3.375m-3.375 0h3.375" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-1.108.892-2 2-2h15a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2-2h-15a2 2 0 0 1-2-2V6.75Z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-2.064.228 3 3 0 0 1-2.064.228m4.128-4.354a3 3 0 0 0 2.064-.228 3 3 0 0 1 2.064-.228m-8.256 8.508a3 3 0 0 0 2.064.228 3 3 0 0 1 2.064.228m-4.128-4.354a3 3 0 0 0 2.064.228 3 3 0 0 1 2.064.228M17.25 6.364a3 3 0 0 0-2.064-.228 3 3 0 0 1-2.064-.228m4.128 4.354a3 3 0 0 0-2.064.228 3 3 0 0 1-2.064-.228m4.128-4.354 1.878-1.878a1.5 1.5 0 1 1 2.122 2.122l-1.878 1.878m-2.122-2.122-1.878 1.878" />
    </svg>
);

export const ResolutionIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

export const AspectRatioIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5m3.75-12H21m-18 0h1.5m15 3.75H21m-18 0h1.5m9.75-10.5a.75.75 0 0 1 .75.75v14.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm-6.375 0a.75.75 0 0 1 .75.75v14.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Z" />
    </svg>
);

export const FilmIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M3 6h18M3 18h18M9 3v3m0 3v3m0 3v3m0 3v3m6-18v3m0 3v3m0 3v3m0 3v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18v12H3V6Z" />
    </svg>
);

export const VerifiedIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 11c0 6.075-4.925 11-11 11S0 17.075 0 11 4.925 0 11 0s11 4.925 11 11Z" fill="#1d9bf0" />
    <path d="m16.333 7.833-6.5 6.5-3.166-3.167" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XLogoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const RedditIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11" fill="#FF4500" />
    <path
      fill="#fff"
      d="M16.982 10.3a1.3 1.3 0 0 0-2.194-.928 6.37 6.37 0 0 0-3.244-.935l.517-2.43 1.772.377a.8.8 0 1 0 .158-.77l-2.15-.457a.8.8 0 0 0-.94.62l-.68 3.2a6.36 6.36 0 0 0-3.28.974 1.3 1.3 0 1 0-1.57 1.992 3.56 3.56 0 0 0-.05.58c0 2.207 2.68 4 5.99 4s5.99-1.793 5.99-4c0-.2-.018-.397-.05-.59.36-.24.59-.65.59-1.1Zm-9.6.9a1.05 1.05 0 1 1 1.05 1.05 1.05 1.05 0 0 1-1.05-1.05Zm5.885 2.76a3.77 3.77 0 0 1-2.268.71 3.77 3.77 0 0 1-2.268-.71.4.4 0 0 1 .47-.64 2.97 2.97 0 0 0 1.798.57 2.97 2.97 0 0 0 1.798-.57.4.4 0 1 1 .47.64Zm-.1-1.71a1.05 1.05 0 1 1 1.05-1.05 1.05 1.05 0 0 1-1.05 1.05Z"
    />
  </svg>
);

export const PinterestIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11" fill="#E60023" />
    <path
      fill="#fff"
      d="M12.35 5c-3 0-4.52 2.13-4.52 3.9 0 1.07.41 2 1.29 2.35.14.06.27 0 .31-.15.03-.11.1-.39.13-.51.04-.15.03-.2-.08-.34a2.9 2.9 0 0 1-.53-1.7c0-2.18 1.63-4.15 4.23-4.15 2.31 0 3.57 1.41 3.57 3.29 0 2.47-1.1 4.55-2.73 4.55-.9 0-1.57-.75-1.36-1.67.26-1.07.76-2.21.76-2.98 0-.69-.37-1.26-1.12-1.26-.89 0-1.61.92-1.61 2.16 0 .79.27 1.32.27 1.32l-1.08 4.58c-.32 1.36-.05 3.03-.03 3.19.02.09.13.12.18.05.09-.11 1.19-1.48 1.57-2.85.11-.41.63-2.54.63-2.54.31.6 1.2 1.14 2.16 1.14 2.84 0 4.78-2.59 4.78-6.07C17.75 7.07 15.44 5 12.35 5Z"
    />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path
      fill="#fff"
      d="M13.2 7.5h1.8V5.03c-.31-.04-1.37-.13-2.6-.13-2.58 0-4.35 1.58-4.35 4.48v2.47H6v2.63h2.05V19h2.63v-4.52h2.06l.33-2.63h-2.39V9.66c0-.76.21-1.27 1.32-1.27Z"
    />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const ReplyIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
    </svg>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="40" cy="40" r="40" fill="url(#play-gradient)" fillOpacity="0.8" />
    <path d="M55.5 38.1699C56.8333 38.9433 56.8333 40.8567 55.5 41.6301L34.5 54.0574C33.1667 54.8308 31.5 53.8741 31.5 52.3274L31.5 27.4726C31.5 25.9259 33.1667 24.9692 34.5 25.7426L55.5 38.1699Z" fill="white" />
    <defs>
      <radialGradient id="play-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 40) rotate(90) scale(40)">
        <stop stopColor="#1D9BF0"/>
        <stop offset="1" stopColor="#1A8CD8"/>
      </radialGradient>
    </defs>
  </svg>
);

export const GridPattern: React.FC<IconProps> = (props) => (
  <svg aria-hidden="true" className="absolute inset-0 h-full w-full" {...props}>
    <defs>
      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse" x="50%" y="0">
        <path d="M.5 0v40M0 .5h40" fill="none" stroke="hsl(222 47% 15% / 1)" strokeWidth="1"></path>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
  </svg>
);

export const ArrowDownCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);

export const TikTokIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.81-1.77-1.8-2.55-4.18-2.4-6.64.13-2.11.93-4.21 2.24-5.87 1.55-1.9 3.9-2.96 6.26-3.15.02 1.5.02 3 .01 4.5.23 1.56.87 3.09 1.79 4.21 1.06 1.21 2.56 1.86 4.13 1.9.11-1.55.08-3.09-.01-4.63-.23-1.54-.88-3.06-1.8-4.17C15.22 3.39 13.9.82 12.525.02Z" />
    </svg>
);

export const YouTubeIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816Zm-10.615 12.82V8.001l6.063 4.005-6.063 4.005Z" />
    </svg>
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163Zm0 1.626c-3.234 0-3.593.011-4.848.07-2.328.106-3.478 1.259-3.584 3.584-.059 1.254-.07 1.623-.07 4.848s.011 3.594.07 4.848c.106 2.325 1.256 3.478 3.584 3.584 1.255.059 1.614.07 4.848.07 3.234 0 3.593-.011 4.848-.07 2.328-.106 3.478-1.259 3.584-3.584.059-1.254.07-1.623.07-4.848s-.011-3.594-.07-4.848c-.106-2.325-1.256-3.478-3.584-3.584C15.593 3.799 15.234 3.789 12 3.789Zm0 4.416A3.797 3.797 0 1 0 12 15.797a3.797 3.797 0 0 0 0-7.592Zm0 6.183A2.386 2.386 0 1 1 12 9.614a2.386 2.386 0 0 1 0 4.775Z" />
        <path d="M16.965 6.576a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    </svg>
);