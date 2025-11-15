import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';

interface PasswordResetPageProps {
  language: Language;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ language }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingSessionNotice, setMissingSessionNotice] = useState<string | null>(null);
  const authCopy = translations[language].auth;
  const common = authCopy?.common;
  const resetCopy = authCopy?.reset;

  useEffect(() => {
    if (!isLoading && !user) {
      setMissingSessionNotice(resetCopy?.sessionWarning ?? common?.genericError ?? null);
    } else {
      setMissingSessionNotice(null);
    }
  }, [user, isLoading, resetCopy, common]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError(resetCopy?.missingFields ?? common?.genericError ?? 'Fill the fields.');
      return;
    }

    if (password.length < 8) {
      setError(resetCopy?.passwordTooShort ?? 'Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError(resetCopy?.passwordMismatch ?? 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        throw updateError;
      }
      setSuccess(resetCopy?.successMessage ?? 'Password updated. Redirecting…');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (updateErr) {
      const message =
        updateErr && typeof updateErr === 'object' && 'message' in updateErr
          ? (updateErr as { message?: string }).message
          : common?.genericError;
      setError(message ?? common?.genericError ?? 'Unable to update password.');
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
            <h2 className="text-3xl font-bold text-white mb-3">{resetCopy?.title ?? 'Reset password'}</h2>
            <p className="text-slate-300 text-base">
              {resetCopy?.subtitle ?? 'Choose a new password to secure your account.'}
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(2,10,18,0.55)] border border-white/10">
            {missingSessionNotice && (
              <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
                {missingSessionNotice}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="reset-password" className="block text-sm font-medium text-slate-200 mb-1">
                  {common?.passwordLabel ?? 'Password'}
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none"
                  placeholder={common?.passwordPlaceholder ?? '••••••••'}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-slate-200 mb-1">
                  {common?.confirmPasswordLabel ?? 'Confirm password'}
                </label>
                <input
                  id="reset-confirm-password"
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
                disabled={isSubmitting || !!missingSessionNotice}
                className="w-full rounded-lg bg-brand-green/90 hover:bg-brand-green text-slate-950 font-semibold py-2.5 transition disabled:opacity-60"
              >
                {isSubmitting ? resetCopy?.submitting ?? 'Updating…' : resetCopy?.submit ?? 'Update password'}
              </button>
            </form>

            <div className="mt-4 flex justify-between text-sm text-slate-300">
              <Link to="/" className="text-brand-green hover:text-brand-green/80 transition">
                {common?.backHome ?? '← Back to home'}
              </Link>
              <Link to="/auth" className="text-brand-green hover:text-brand-green/80 transition">
                {common?.backToLogin ?? '← Back to login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;


