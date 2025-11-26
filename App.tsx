import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import DashboardPage from './pages/DashboardPage';
import AdminAuthReady from './pages/AdminAuthReady';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DynamicBackground from './components/DynamicBackground';
import { useAuth } from './contexts/AuthContext';

export type Language = 'fr' | 'en' | 'es';
const SUPPORTED_LANGUAGES: Language[] = ['fr', 'en', 'es'];

const getInitialLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const langs = navigator.languages || [navigator.language];

  for (const lang of langs) {
    const primaryLang = lang.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(primaryLang as Language)) {
      return primaryLang as Language;
    }
  }

  return 'en';
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage());
  const [languageLocked, setLanguageLocked] = useState(false);

  useEffect(() => {
    if (languageLocked || typeof window === 'undefined') {
      return;
    }

    let cancelled = false;

    const detectLocaleFromIp = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        const rawCandidates = [
          data.languages?.split(',')[0],
          data.language,
          data.country_code,
        ];

        for (const candidate of rawCandidates) {
          if (!candidate) continue;
          const normalized = candidate.toLowerCase().split('-')[0];
          if (SUPPORTED_LANGUAGES.includes(normalized as Language) && normalized !== language) {
            if (!cancelled) {
              setLanguage(normalized as Language);
            }
            break;
          }
        }
      } catch (error) {
        console.warn('Impossible de détecter la langue via IP:', error);
      }
    };

    detectLocaleFromIp();

    return () => {
      cancelled = true;
    };
  }, [languageLocked, language]);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    setLanguageLocked(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
        <DynamicBackground />
        <main>
          <Routes>
            <Route path="/" element={<HomePage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/auth" element={<AuthPage language={language} />} />
            <Route path="/register" element={<RegisterPage language={language} />} />
            <Route path="/auth/reset" element={<PasswordResetPage language={language} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage language={language} onLanguageChange={handleLanguageChange} />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<PricingPage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/checkout" element={<CheckoutPage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/success" element={<SuccessPage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/cancel" element={<CancelPage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/terms" element={<TermsOfServicePage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/privacy" element={<PrivacyPolicyPage language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/admin/auth_ready" element={<AdminAuthReady />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}