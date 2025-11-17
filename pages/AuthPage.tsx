import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';
import AuthShell from '../components/AuthShell';

interface AuthPageProps {
  language: Language;
}

const AuthPage: React.FC<AuthPageProps> = ({ language }) => {
  const { user, isLoading, signInWithPassword, sendMagicLink, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const t = translations[language];
  const authCopy = t.auth;
  const common = authCopy?.common;
  const loginCopy = authCopy?.login;
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const heroBullets = [
    {
      title: t.heroTrust1,
      description: t.heroTrust2,
    },
    {
      title: t.heroTrust3,
      description: t.features?.[0]?.description ?? 'Des rendus premium prêts à publier.',
    },
  ];
  const totalUsers =
    t.heroSocialProof?.totalUsersOverride ??
    (t.heroSocialProof?.totalUsers ? `${t.heroSocialProof.totalUsers}+` : '10k+');
  const heroStats = [
    { label: t.heroSocialProof?.totalLabel ?? 'Créateurs heureux', value: totalUsers },
    { label: t.heroSocialProof?.ratingLabel ?? 'Average rating', value: `${t.heroSocialProof?.rating ?? '4.8'}/5` },
  ];

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectUrl, { replace: true });
    }
  }, [user, isLoading, navigate, redirectUrl]);

  if (!isLoading && user) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMagicLinkMessage(null);
    setResetMessage(null);

    if (!email || !password) {
      setError(loginCopy?.missingFields ?? common?.genericError ?? 'Missing credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithPassword(email, password);
      navigate(redirectUrl);
    } catch (authError) {
      const message =
        authError && typeof authError === 'object' && 'message' in authError
          ? (authError as { message?: string }).message
          : common?.genericError;
      setError(message ?? common?.genericError ?? 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError(loginCopy?.missingFields ?? common?.genericError ?? 'Missing email.');
      return;
    }
    setError(null);
    setMagicLinkMessage(null);
    setResetMessage(null);
    setIsMagicLoading(true);
    try {
      await sendMagicLink(email);
      setMagicLinkMessage(loginCopy?.magicLinkSuccess ?? 'Magic link sent!');
    } catch (linkError) {
      const message =
        linkError && typeof linkError === 'object' && 'message' in linkError
          ? (linkError as { message?: string }).message
          : common?.genericError;
      setError(message ?? common?.genericError ?? 'Unable to send magic link.');
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError(loginCopy?.forgotMissingEmail ?? common?.genericError ?? 'Enter your email.');
      return;
    }
    setError(null);
    setMagicLinkMessage(null);
    setResetMessage(null);
    setIsResetLoading(true);
    try {
      await sendPasswordReset(email);
      setResetMessage(loginCopy?.forgotSuccess ?? 'Reset email sent.');
    } catch (resetError) {
      const message =
        resetError && typeof resetError === 'object' && 'message' in resetError
          ? (resetError as { message?: string }).message
          : common?.genericError;
      setError(message ?? common?.genericError ?? 'Unable to send reset link.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <AuthShell
      brandTitle={authCopy?.brandTitle}
      brandSubtitle={authCopy?.brandSubtitle}
      badge="Secure Access"
      heroTitle={loginCopy?.title ?? 'Sign in'}
      heroSubtitle={loginCopy?.subtitle ?? 'Use your email and password to continue.'}
      bullets={heroBullets}
      stats={heroStats}
    >
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <img src={logoImage} alt="Viralis Studio" className="h-20 w-auto md:h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">{loginCopy?.title ?? 'Sign in'}</h2>
          <p className="text-slate-400 text-sm">{loginCopy?.subtitle ?? 'Use your credentials to access the studio.'}</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}
        {magicLinkMessage && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {magicLinkMessage}
          </div>
        )}
        {resetMessage && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {resetMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
              {common?.emailLabel ?? 'Email'}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-5 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
                placeholder={common?.emailPlaceholder ?? 'you@email.com'}
                autoComplete="email"
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-slate-500 pointer-events-none">@</div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
              {common?.passwordLabel ?? 'Password'}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-5 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
                placeholder={common?.passwordPlaceholder ?? '••••••••'}
                autoComplete="current-password"
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-slate-500 pointer-events-none">•••</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {isSubmitting ? loginCopy?.submitting ?? 'Signing in…' : loginCopy?.submit ?? 'Sign in'}
          </button>
        </form>

        <div className="flex flex-col text-sm text-slate-300 gap-2">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-left text-emerald-300 hover:text-emerald-200 transition disabled:opacity-60"
            disabled={isResetLoading}
          >
            {isResetLoading ? loginCopy?.forgotSending ?? 'Sending…' : loginCopy?.forgotCta ?? 'Forgot password?'}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            className="text-left text-emerald-300 hover:text-emerald-200 transition disabled:opacity-60"
            disabled={isMagicLoading}
          >
            {isMagicLoading ? loginCopy?.magicLinkSending ?? 'Sending link…' : loginCopy?.magicLinkCta ?? 'Send magic link'}
          </button>
        </div>

        <div className="text-center text-sm text-slate-400">
          {loginCopy?.registerPrompt ?? 'No account yet?'}{' '}
          <Link to="/register" className="text-emerald-300 font-semibold hover:text-emerald-200 transition">
            {loginCopy?.registerCta ?? 'Create an account'}
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a href="/" className="text-emerald-300 hover:text-emerald-200 transition-colors text-sm">
          {common?.backHome ?? '← Back to home'}
        </a>
      </div>
    </AuthShell>
  );
};

export default AuthPage;
