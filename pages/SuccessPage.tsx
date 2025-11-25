import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Language } from '../App';
import { translations } from '../translations';

interface SuccessPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('type') || 'purchase';
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard?from=success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getSuccessMessage = () => {
    if (planType === 'token-pack' || planType === 'premium-tokens') {
      return {
        title: language === 'fr' ? 'Paiement réussi !' : language === 'es' ? '¡Pago exitoso!' : 'Payment Successful!',
        message: language === 'fr' 
          ? 'Vos tokens ont été ajoutés à votre compte. Vous pouvez maintenant générer vos vidéos !'
          : language === 'es'
          ? 'Tus tokens han sido agregados a tu cuenta. ¡Ahora puedes generar tus videos!'
          : 'Your tokens have been added to your account. You can now generate your videos!',
      };
    } else {
      return {
        title: language === 'fr' ? 'Abonnement activé !' : language === 'es' ? '¡Suscripción activada!' : 'Subscription Activated!',
        message: language === 'fr'
          ? 'Votre abonnement Pro a été activé avec succès. Profitez de tous les avantages !'
          : language === 'es'
          ? 'Tu suscripción Pro ha sido activada con éxito. ¡Disfruta de todos los beneficios!'
          : 'Your Pro subscription has been successfully activated. Enjoy all the benefits!',
      };
    }
  };

  const successInfo = getSuccessMessage();

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
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] bg-clip-text text-transparent">
              {successInfo.title}
            </h1>

            <p className="text-lg text-slate-300 mb-8">
              {successInfo.message}
            </p>

            <div className="bg-slate-800/50 rounded-lg p-4 mb-8 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-2">
                {language === 'fr' 
                  ? 'Redirection vers le dashboard dans'
                  : language === 'es'
                  ? 'Redirección al panel en'
                  : 'Redirecting to dashboard in'}
              </p>
              <p className="text-2xl font-bold text-[#00ff9d]">3</p>
            </div>

            <button
              onClick={() => navigate('/dashboard?from=success')}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 text-slate-950 font-semibold rounded-lg transition-all duration-200"
            >
              {language === 'fr' ? 'Aller au dashboard' : language === 'es' ? 'Ir al panel' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default SuccessPage;

