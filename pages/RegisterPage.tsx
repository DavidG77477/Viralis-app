import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';

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
  const authCopy = translations[language].auth;
  const common = authCopy?.common;
  const registerCopy = authCopy?.register;

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
            <h2 className="text-3xl font-bold text-white mb-3">{registerCopy?.title ?? 'Create an account'}</h2>
            <p className="text-slate-300 text-base">
              {registerCopy?.subtitle ?? 'Join Viralis Studio to generate AI videos.'}
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(2,10,18,0.55)] border border-white/10">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>
            )}
            {successMessage && (
              <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
                  placeholder={common?.emailPlaceholder ?? 'you@email.com'}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-200 mb-1">
                  {common?.passwordLabel ?? 'Password'}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
                  placeholder={common?.confirmPasswordPlaceholder ?? '••••••••'}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-brand-green/90 hover:bg-brand-green text-slate-950 font-semibold py-2.5 transition disabled:opacity-60"
              >
                {isSubmitting ? registerCopy?.submitting ?? 'Creating account…' : registerCopy?.submit ?? 'Create my account'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-300">
              <p>
                {registerCopy?.hasAccountPrompt ?? 'Already a member?'}{' '}
                <Link to="/auth" className="text-brand-green hover:text-brand-green/80 transition font-semibold">
                  {registerCopy?.loginCta ?? 'Sign in'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-brand-green hover:text-brand-green/80 transition-colors text-sm">
            {common?.backHome ?? '← Back to home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


