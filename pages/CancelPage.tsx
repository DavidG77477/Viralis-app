import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Language } from '../App';
import { translations } from '../translations';

interface CancelPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const CancelPage: React.FC<CancelPageProps> = ({ language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header language={language} onLanguageChange={onLanguageChange} />

      <main className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-brand-green/5 blur-[180px]" />
          <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-sky-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-12 text-center">
            {/* Cancel Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-slate-700/50 rounded-full blur-xl opacity-50" />
                <div className="relative w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-200">
              {language === 'fr' 
                ? 'Paiement annulé'
                : language === 'es'
                ? 'Pago cancelado'
                : 'Payment Cancelled'}
            </h1>

            <p className="text-lg text-slate-300 mb-4">
              {language === 'fr'
                ? "Vous avez annulé le processus de paiement. Aucun montant n'a été débité."
                : language === 'es'
                ? 'Has cancelado el proceso de pago. No se ha cobrado ningún monto.'
                : "You've cancelled the payment process. No amount has been charged."}
            </p>

            <p className="text-base text-slate-400 mb-8">
              {language === 'fr'
                ? "Si vous souhaitez continuer votre achat, vous pouvez retourner à la page des tarifs."
                : language === 'es'
                ? 'Si deseas continuar con tu compra, puedes volver a la página de precios.'
                : 'If you want to continue your purchase, you can return to the pricing page.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="px-8 py-3 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-semibold rounded-lg transition-all duration-200"
              >
                {language === 'fr' ? 'Retour aux tarifs' : language === 'es' ? 'Volver a precios' : 'Back to Pricing'}
              </Link>
              <Link
                to="/"
                className="px-8 py-3 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-300 font-medium rounded-lg transition-all duration-200"
              >
                {language === 'fr' ? "Retour à l'accueil" : language === 'es' ? 'Volver al inicio' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default CancelPage;

