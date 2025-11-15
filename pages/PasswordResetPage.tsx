import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../App';
import { translations } from '../translations';
import AuthShell from '../components/AuthShell';

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
  const t = translations[language];
  const authCopy = t.auth;
  const common = authCopy?.common;
  const resetCopy = authCopy?.reset;
  const heroBullets = [
    {
      title: 'Sécurité maximale',
      description: 'Chaque lien de réinitialisation expire automatiquement après usage.',
    },
    {
      title: 'Support prioritaire',
      description: "Notre équipe peut t'accompagner si tu es bloqué.",
    },
  ];
  const heroStats = [
    { label: 'Sessions protégées', value: '100%' },
    { label: t.heroSocialProof?.ratingLabel ?? 'Avis', value: `${t.heroSocialProof?.rating ?? '4.8'}/5` },
  ];

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
    <AuthShell
      badge="Security first"
      heroTitle={resetCopy?.title ?? 'Reset password'}
      heroSubtitle={resetCopy?.subtitle ?? 'Choose a new password to secure your account.'}
      bullets={heroBullets}
      stats={heroStats}
    >
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <img src={logoImage} alt="Viralis Studio" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">{resetCopy?.title ?? 'Reset password'}</h2>
          <p className="text-slate-400 text-sm">{resetCopy?.subtitle ?? 'Choose a new password to secure your account.'}</p>
        </div>

        {missingSessionNotice && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {missingSessionNotice}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}
        {success && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-green focus:outline-none transition"
              placeholder={common?.confirmPasswordPlaceholder ?? '••••••••'}
              autoComplete="new-password"
            />
          </div>

        <button
          type="submit"
          disabled={isSubmitting || !!missingSessionNotice}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:opacity-60"
        >
          {isSubmitting ? resetCopy?.submitting ?? 'Updating…' : resetCopy?.submit ?? 'Update password'}
        </button>
      </form>

      <div className="flex justify-between text-sm text-slate-400">
        <Link to="/" className="text-emerald-300 hover:text-emerald-200 transition">
          {common?.backHome ?? '← Back to home'}
        </Link>
        <Link to="/auth" className="text-emerald-300 hover:text-emerald-200 transition">
          {common?.backToLogin ?? '← Back to login'}
        </Link>
      </div>
    </div>
  </AuthShell>
  );
};

export default PasswordResetPage;

