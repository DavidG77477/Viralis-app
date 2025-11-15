import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';
import AuthShell from '../components/AuthShell';

interface RegisterPageProps {
  language: Language;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ language }) => {
  const { user, isLoading, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = translations[language];
  const authCopy = t.auth;
  const common = authCopy?.common;
  const registerCopy = authCopy?.register;
  const heroBullets = [
    {
      title: t.features?.[0]?.title ?? 'Styles réalistes',
      description: t.features?.[0]?.description ?? 'Génère des prises de vue crédibles.',
    },
    {
      title: t.features?.[1]?.title ?? 'Génération rapide',
      description: t.features?.[1]?.description ?? 'Passe de ton idée à la vidéo en minutes.',
    },
  ];
  const heroStats = [
    { label: t.heroSocialProof?.totalLabel ?? 'Créateurs heureux', value: t.heroSocialProof?.totalUsersOverride ?? '10k+' },
    { label: t.heroSocialProof?.ratingLabel ?? 'Average rating', value: `${t.heroSocialProof?.rating ?? '4.8'}/5` },
  ];

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
    setSuccessMessage(null);

    if (!email || !password || !confirmPassword) {
      setError(registerCopy?.missingFields ?? common?.genericError ?? 'Fill all fields.');
      return;
    }

    if (password.length < 8) {
      setError(registerCopy?.passwordTooShort ?? 'Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError(registerCopy?.passwordMismatch ?? 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signUpWithEmail(email, password);
      if (data.session) {
        navigate('/dashboard');
        return;
      }
      setSuccessMessage(registerCopy?.successMessage ?? 'Account created. Check your inbox to confirm it.');
    } catch (signUpError) {
      const message =
        signUpError && typeof signUpError === 'object' && 'message' in signUpError
          ? (signUpError as { message?: string }).message
          : common?.genericError;
      setError(message ?? common?.genericError ?? 'Unable to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      badge="Create account"
      heroTitle={registerCopy?.title ?? 'Create an account'}
      heroSubtitle={registerCopy?.subtitle ?? 'Join Viralis Studio to generate AI videos.'}
      bullets={heroBullets}
      stats={heroStats}
    >
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <img src={logoImage} alt="Viralis Studio" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">{registerCopy?.title ?? 'Create an account'}</h2>
          <p className="text-slate-400 text-sm">{registerCopy?.subtitle ?? 'Join Viralis Studio to generate AI videos.'}</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}
        {successMessage && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-200 mb-1">
              {common?.emailLabel ?? 'Email'}
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
              placeholder={common?.emailPlaceholder ?? 'you@email.com'}
              autoComplete="email"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-200 mb-1">
                {common?.passwordLabel ?? 'Password'}
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
                placeholder={common?.passwordPlaceholder ?? '••••••••'}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-200 mb-1">
                {common?.confirmPasswordLabel ?? 'Confirm password'}
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
                placeholder={common?.confirmPasswordPlaceholder ?? '••••••••'}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {isSubmitting ? registerCopy?.submitting ?? 'Creating account…' : registerCopy?.submit ?? 'Create my account'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          {registerCopy?.hasAccountPrompt ?? 'Already a member?'}{' '}
          <Link to="/auth" className="text-emerald-300 font-semibold hover:text-emerald-200 transition">
            {registerCopy?.loginCta ?? 'Sign in'}
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-emerald-300 hover:text-emerald-200 transition-colors text-sm">
          {common?.backHome ?? '← Back to home'}
        </Link>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
