import React from 'react';
import { Link } from 'react-router-dom';
import Pricing from '../components/Pricing';
import type { Language } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../translations';

interface PricingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header language={language} onLanguageChange={onLanguageChange} />

      <main className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-brand-green/5 blur-[180px]" />
          <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-sky-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 mb-12 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t.pricingTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="relative z-10">
          <Pricing language={language} />
        </div>

        <div className="relative z-10 mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-green/60 bg-brand-green/10 px-5 py-2.5 text-sm font-semibold text-brand-green transition hover:bg-brand-green/20 hover:text-white"
          >
            {t.auth?.common.backHome ?? '← Back to home'}
          </Link>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default PricingPage;

