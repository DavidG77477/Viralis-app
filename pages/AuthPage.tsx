import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';

interface AuthPageProps {
  language: Language;
}

const AuthPage: React.FC<AuthPageProps> = ({ language }) => {
  const { user, isLoading, signInWithPassword, sendMagicLink } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const authCopy = translations[language].auth;
  const common = authCopy?.common;
  const loginCopy = authCopy?.login;

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMagicLinkMessage(null);

    if (!email || !password) {
      setError(loginCopy?.missingFields ?? common?.genericError ?? 'Missing credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithPassword(email, password);
      navigate('/dashboard');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0D0F12' }}>
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-1/4 w-full h-full bg-brand-green/5 rounded-full blur-3xl animate-aurora-1"></div>
        <div className="absolute top-1/2 -right-1/4 w-full h-full bg-brand-green/5 rounded-full blur-3xl animate-aurora-2" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <img src={logoImage} alt="Viralis Studio" className="h-24 w-auto md:h-28" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-3">{loginCopy?.title ?? 'Sign in'}</h2>
            <p className="text-slate-300 text-base">
              {loginCopy?.subtitle ?? 'Use your email and password to continue.'}
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(2,10,18,0.55)] border border-white/10">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>
            )}
            {magicLinkMessage && (
              <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                {magicLinkMessage}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
                  {common?.emailLabel ?? 'Email'}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
                  placeholder={common?.emailPlaceholder ?? 'you@email.com'}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
                  {common?.passwordLabel ?? 'Password'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
                  placeholder={common?.passwordPlaceholder ?? '••••••••'}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-brand-green/90 hover:bg-brand-green text-slate-950 font-semibold py-2.5 transition disabled:opacity-60"
              >
                {isSubmitting ? loginCopy?.submitting ?? 'Signing in…' : loginCopy?.submit ?? 'Sign in'}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-300 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleMagicLink}
                className="text-brand-green hover:text-brand-green/80 transition disabled:opacity-60"
                disabled={isMagicLoading}
              >
                {isMagicLoading ? loginCopy?.magicLinkSending ?? 'Sending link…' : loginCopy?.magicLinkCta ?? 'Send magic link'}
              </button>
              <p>
                {loginCopy?.registerPrompt ?? 'No account yet?'}{' '}
                <Link to="/register" className="text-brand-green hover:text-brand-green/80 transition font-semibold">
                  {loginCopy?.registerCta ?? 'Create an account'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-brand-green hover:text-brand-green/80 transition-colors text-sm">
            {common?.backHome ?? '← Back to home'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
