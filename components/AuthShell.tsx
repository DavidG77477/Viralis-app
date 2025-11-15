import React from 'react';

interface AuthShellProps {
  brandTitle?: string;
  brandSubtitle?: string;
  heroTitle: string;
  heroSubtitle: string;
  badge?: string;
  bullets?: { title: string; description: string }[];
  stats?: { label: string; value: string }[];
  children: React.ReactNode;
}

const AuthShell: React.FC<AuthShellProps> = ({
  brandTitle = 'Viralis Studio',
  brandSubtitle = 'Générateur vidéo IA',
  heroTitle,
  heroSubtitle,
  badge,
  bullets,
  stats,
  children,
}) => {
  return (
    <div className="relative min-h-screen bg-[#030a07] text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-1/3 -left-1/4 h-[80vw] w-[80vw] bg-emerald-500/10 blur-[180px]" />
        <div className="absolute top-0 right-0 h-[60vw] w-[60vw] bg-sky-500/10 blur-[200px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400/30 to-sky-500/30 backdrop-blur border border-white/10 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/70">{brandTitle}</p>
              <p className="text-slate-400 text-sm">{brandSubtitle}</p>
            </div>
          </div>
          {badge && (
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-200">
              {badge}
            </span>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-900/40 via-slate-900/40 to-sky-900/40 p-8 lg:p-10 shadow-[0_40px_80px_rgba(4,12,9,0.6)] backdrop-blur">
            <p className="text-emerald-300 font-semibold text-xs tracking-[0.4em] uppercase mb-4">
              {badge ?? 'Creator Hub'}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">{heroTitle}</h1>
            <p className="text-slate-300 mb-8 leading-relaxed">{heroSubtitle}</p>

            {bullets && bullets.length > 0 && (
              <div className="space-y-4 mb-8">
                {bullets.map((bullet) => (
                  <div key={bullet.title} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400" />
                    <div>
                      <p className="font-semibold text-sm text-white">{bullet.title}</p>
                      <p className="text-slate-400 text-sm">{bullet.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5/5 px-5 py-4">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full max-w-lg lg:ml-auto">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 shadow-[0_20px_70px_rgba(2,10,12,0.6)] backdrop-blur-xl p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;

