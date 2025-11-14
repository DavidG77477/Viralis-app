import React from 'react';
import { Navigate } from 'react-router-dom';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const { user, isLoading, signInWithGoogle } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

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
            <h2 className="text-3xl font-bold text-white mb-3">Bienvenue chez Viralis Studio</h2>
            <p className="text-slate-300 text-base">
              Connecte-toi avec Google pour générer des vidéos et synchroniser tes jetons Supabase.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(2,10,18,0.55)] border border-white/10 text-center">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.6 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 3-4.33 3-7.53Z"
                />
                <path
                  fill="currentColor"
                  d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.06.95-3.38.95-2.6 0-4.8-1.76-5.58-4.12H3.03v2.58A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="currentColor"
                  d="M6.42 13.9a5.99 5.99 0 0 1 0-3.8V7.52H3.03a10 10 0 0 0 0 8.96l3.39-2.57Z"
                />
                <path
                  fill="currentColor"
                  d="M12 6.04c1.47 0 2.8.5 3.84 1.5l2.88-2.88C16.96 3.26 14.7 2.4 12 2.4a10 10 0 0 0-8.97 5.12l3.39 2.57C7.2 7.8 9.4 6.04 12 6.04Z"
                />
              </svg>
              Continuer avec Google
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-brand-green hover:text-brand-green/80 transition-colors text-sm">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
