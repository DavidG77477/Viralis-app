
import React from 'react';
import { XCircleIcon, CheckCircleIcon, TicketIcon } from './icons/Icons';
import type { TokenPackage, SubscriptionPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenPackages: TokenPackage[];
  subscriptionPlans: SubscriptionPlan[];
  onPurchaseTokens: (pkg: TokenPackage) => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  tokenPackages,
  subscriptionPlans,
  onPurchaseTokens,
  onSubscribe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-brand-green">Passer Pro</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        
        <p className="text-slate-400 mb-8 text-center">Libérez tout votre potentiel créatif. Choisissez un forfait ou rechargez vos jetons.</p>

        {/* Subscriptions */}
        <div className="mb-10">
            <h3 className="text-2xl font-semibold text-center mb-6">Abonnements Mensuels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className={`bg-panel-gradient p-6 rounded-lg border ${plan.highlight ? 'border-brand-green' : 'border-slate-800'} flex flex-col relative shadow-inner-panel`}>
                        {plan.highlight && (
                          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="text-center bg-brand-green text-slate-950 text-sm font-bold py-1 px-4 rounded-full">Le plus Populaire</div>
                          </div>
                        )}
                        <h4 className="text-xl font-bold text-center mt-2">{plan.name}</h4>
                        <p className="text-4xl font-extrabold text-center my-4">${plan.price}<span className="text-base font-normal text-slate-400">/mois</span></p>
                        <ul className="space-y-3 mb-6 flex-grow">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-1" />
                                    <span className="text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => onSubscribe(plan)} className={`w-full mt-auto text-slate-950 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${plan.highlight ? 'bg-brand-green hover:bg-opacity-90' : 'bg-slate-300 hover:bg-white'}`}>
                            S'abonner
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Token Packs */}
        <div>
            <h3 className="text-2xl font-semibold text-center mb-6">Packs de Jetons Uniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tokenPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-panel-gradient p-6 rounded-lg border border-slate-800 text-center shadow-inner-panel">
                        <TicketIcon className="w-10 h-10 text-brand-green mx-auto mb-2" />
                        <h4 className="text-lg font-bold">{pkg.name}</h4>
                        <p className="text-2xl font-bold my-2">{pkg.tokens.toLocaleString()} Jetons</p>
                        <p className="text-xl font-semibold text-brand-green mb-4">${pkg.price}</p>
                        <button onClick={() => onPurchaseTokens(pkg)} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Acheter
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PricingModal;