import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Language } from '../App';
import { translations } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession, type PlanId, isSubscriptionPlan } from '../services/stripeService';
import { CheckCircleIcon } from '../components/icons/Icons';
import tokenIcon from '../attached_assets/token.png';

interface CheckoutPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const PLAN_MAPPING: Record<string, number> = {
  'token-pack': 0,
  'premium-tokens': 1,
  'pro-monthly': 2,
  'pro-annual': 3,
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planParam = searchParams.get('plan');
  const planId = planParam as PlanId | null;

  // Get plan data from translations
  const planIndex = planId ? PLAN_MAPPING[planId] : -1;
  const plan = planIndex >= 0 ? t.pricingPlans[planIndex] : null;

  useEffect(() => {
    if (!user) {
      const checkoutUrl = `/checkout${planId ? `?plan=${planId}` : ''}`;
      navigate(`/auth?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    if (!planId || !plan) {
      navigate('/pricing');
    }
  }, [user, planId, plan, navigate]);

  const handleCheckout = async () => {
    if (!user || !planId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createCheckoutSession(planId, user.id);
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout');
      setIsLoading(false);
    }
  };

  if (!plan || !planId) {
    return null; // Will redirect
  }

  const isSubscription = isSubscriptionPlan(planId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header language={language} onLanguageChange={onLanguageChange} />

      <main className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-brand-green/5 blur-[180px]" />
          <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-sky-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] bg-clip-text text-transparent">
                {language === 'fr' ? 'Résumé de la commande' : language === 'es' ? 'Resumen del pedido' : 'Order Summary'}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{plan.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <img src={tokenIcon} alt="Tokens" className="w-4 h-4" />
                      <span>{plan.priceSubtitle}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{plan.price}</p>
                    {isSubscription && (
                      <p className="text-xs text-slate-400 mt-1">
                        {planId === 'pro-annual'
                          ? (language === 'fr' ? '/an' : language === 'es' ? '/año' : '/year')
                          : (language === 'fr' ? '/mois' : language === 'es' ? '/mes' : '/month')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {plan.features && (
                <div className="border-t border-slate-700/50 pt-6">
                  <h4 className="font-semibold text-slate-300 mb-4">
                    {language === 'fr' ? 'Inclus dans cet abonnement :' : language === 'es' ? 'Incluido en esta suscripción:' : 'Included in this subscription:'}
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-slate-700/50 pt-6 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">
                    {language === 'fr' ? 'Total' : language === 'es' ? 'Total' : 'Total'}
                  </span>
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                </div>
                {isSubscription && (
                  <p className="text-xs text-slate-500 text-right">
                    {planId === 'pro-annual'
                      ? (language === 'fr'
                          ? 'Facturé annuellement'
                          : language === 'es'
                          ? 'Facturado anualmente'
                          : 'Billed annually')
                      : (language === 'fr'
                          ? 'Facturé mensuellement'
                          : language === 'es'
                          ? 'Facturado mensualmente'
                          : 'Billed monthly')}
                  </p>
                )}
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">
                {language === 'fr' ? 'Finaliser la commande' : language === 'es' ? 'Finalizar pedido' : 'Complete Order'}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg">
                <p className="text-amber-400 text-sm">
                  {language === 'fr'
                    ? '⚠️ Configuration Stripe en cours. Le paiement sera bientôt disponible.'
                    : language === 'es'
                    ? '⚠️ Configuración de Stripe en curso. El pago estará disponible pronto.'
                    : '⚠️ Stripe configuration in progress. Payment will be available soon.'}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading || true} // Disabled until Stripe is configured
                className="w-full py-4 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg transition-all duration-200 mb-4"
              >
                {isLoading
                  ? language === 'fr'
                    ? 'Traitement...'
                    : language === 'es'
                    ? 'Procesando...'
                    : 'Processing...'
                  : language === 'fr'
                  ? 'Procéder au paiement'
                  : language === 'es'
                  ? 'Proceder al pago'
                  : 'Proceed to Payment'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                {language === 'fr'
                  ? 'En cliquant sur "Procéder au paiement", vous serez redirigé vers Stripe pour finaliser votre paiement de manière sécurisée.'
                  : language === 'es'
                  ? 'Al hacer clic en "Proceder al pago", serás redirigido a Stripe para finalizar tu pago de forma segura.'
                  : 'By clicking "Proceed to Payment", you will be redirected to Stripe to securely complete your payment.'}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <Link
                  to="/pricing"
                  className="block text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {language === 'fr' ? '← Retour aux tarifs' : language === 'es' ? '← Volver a precios' : '← Back to Pricing'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default CheckoutPage;

