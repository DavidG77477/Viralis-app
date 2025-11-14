import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import logoImage from '../attached_assets/LOGO.png';

type AuthMode = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

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

          <SignedIn>
            <Navigate to="/dashboard" replace />
          </SignedIn>

          <SignedOut>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-3">Bienvenue chez Viralis Studio</h2>
              <p className="text-slate-300 text-base">
                Authentifie-toi avec Clerk pour profiter de la génération vidéo et synchroniser tes données Supabase.
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  mode === 'signin' ? 'bg-brand-green text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-brand-green text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Inscription
              </button>
            </div>

            <div className="mx-auto ml-6 max-w-md rounded-xl bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(2,10,18,0.55)] border border-white/10">
              {mode === 'signin' ? (
                <SignIn
                  appearance={{
                    variables: {
                      colorPrimary: '#22D3EE',
                      colorText: '#E0F2F1',
                      colorTextSecondary: '#A5F3FC',
                      colorInputBackground: 'rgba(15,23,42,0.65)',
                      colorInputText: '#E0F2F1',
                      colorInputBorder: 'rgba(94,234,212,0.45)',
                      fontFamily: 'Inter, sans-serif',
                    },
                    elements: {
                      card: 'bg-transparent shadow-none p-0',
                      rootBox: 'text-white',
                      form: 'space-y-4',
                      headerTitle: 'text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#22D3EE]',
                      headerSubtitle: 'text-slate-200',
                      socialButtons:
                        'space-y-3 [&>button]:bg-[rgba(15,23,42,0.65)] [&>button]:text-white [&>button]:hover:bg-[rgba(30,41,59,0.8)]',
                      formFieldLabel: 'text-slate-200',
                      formFieldInput:
                        'bg-[rgba(15,23,42,0.65)] border border-teal-300/40 text-slate-100 placeholder:text-slate-400 focus:border-[#38BDF8] focus:ring-[#38BDF8]',
                      formFieldInputShowPasswordButton: 'text-slate-300',
                      formFieldInput__password__showButton: 'text-slate-300',
                      formFieldAction: 'text-slate-200 hover:text-white',
                      formButtonPrimary:
                        'bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#22D3EE] text-slate-950 font-semibold hover:from-[#22D3EE] hover:to-[#34D399] transition-all border-0 shadow-[0_12px_35px_rgba(34,211,238,0.35)]',
                      footer: 'hidden',
                      dividerText: 'text-slate-200',
                    },
                  }}
                  routing="path"
                  path="/auth"
                  signUpUrl="/auth"
                  afterSignInUrl="/dashboard"
                />
              ) : (
                <SignUp
                  appearance={{
                    variables: {
                      colorPrimary: '#22D3EE',
                      colorText: '#E0F2F1',
                      colorTextSecondary: '#A5F3FC',
                      colorInputBackground: 'rgba(15,23,42,0.65)',
                      colorInputText: '#E0F2F1',
                      colorInputBorder: 'rgba(94,234,212,0.45)',
                      fontFamily: 'Inter, sans-serif',
                    },
                    elements: {
                      card: 'bg-transparent shadow-none p-0',
                      rootBox: 'text-white',
                      form: 'space-y-4',
                      headerTitle: 'text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#22D3EE]',
                      headerSubtitle: 'text-slate-200',
                      socialButtons:
                        'space-y-3 [&>button]:bg-[rgba(15,23,42,0.65)] [&>button]:text-white [&>button]:hover:bg-[rgba(30,41,59,0.8)]',
                      formFieldLabel: 'text-slate-200',
                      formFieldInput:
                        'bg-[rgba(15,23,42,0.65)] border border-teal-300/40 text-slate-100 placeholder:text-slate-400 focus:border-[#38BDF8] focus:ring-[#38BDF8]',
                      formFieldInputShowPasswordButton: 'text-slate-300',
                      formFieldInput__password__showButton: 'text-slate-300',
                      formFieldAction: 'text-slate-200 hover:text-white',
                      formButtonPrimary:
                        'bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#22D3EE] text-slate-950 font-semibold hover:from-[#22D3EE] hover:to-[#34D399] transition-all border-0 shadow-[0_12px_35px_rgba(34,211,238,0.35)]',
                      footer: 'hidden',
                      dividerText: 'text-slate-200',
                    },
                  }}
                  routing="path"
                  path="/auth/sign-up"
                  signInUrl="/auth"
                  afterSignUpUrl="/dashboard"
                />
              )}
            </div>
          </SignedOut>
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
