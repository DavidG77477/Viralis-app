import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminAuthReady from './pages/AdminAuthReady';
import PricingPage from './pages/PricingPage';
import DynamicBackground from './components/DynamicBackground';
import { useAuth } from './contexts/AuthContext';

export type Language = 'fr' | 'en' | 'es';

const getInitialLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const langs = navigator.languages || [navigator.language];

  for (const lang of langs) {
    const primaryLang = lang.split('-')[0];
    if (['fr', 'en', 'es'].includes(primaryLang)) {
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

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
        <DynamicBackground />
        <main>
          <Routes>
            <Route path="/" element={<HomePage language={language} setLanguage={setLanguage} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage language={language} setLanguage={setLanguage} />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<PricingPage language={language} setLanguage={setLanguage} />} />
            <Route path="/admin/auth_ready" element={<AdminAuthReady />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}