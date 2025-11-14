import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminAuthReady from './pages/AdminAuthReady';
import PricingPage from './pages/PricingPage';
import DynamicBackground from './components/DynamicBackground';

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
            <Route path="/dashboard" element={<DashboardPage language={language} setLanguage={setLanguage} />} />
            <Route path="/pricing" element={<PricingPage language={language} setLanguage={setLanguage} />} />
            <Route path="/admin/auth_ready" element={<AdminAuthReady />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}