import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface SubscriptionPageProps {
  onBack: () => void;
  currentTier?: string;
  isMobile?: boolean;
}

export function SubscriptionPage({ onBack, currentTier = 'free', isMobile = false }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState(currentTier);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualTotalPrice: 0,
      annualMonthlyEquivalent: 0,
      description: 'Liens illimités et Link in Bio personnalisable',
      features: [
        'Liens illimités',
        'Page personnalisable',
        'Analytics basiques',
        '1 QR Code'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 9.99,
      annualTotalPrice: 95.88,
      annualMonthlyEquivalent: 7.99,
      description: 'Plus de personnalisation et de contrôle.',
      features: [
        'Tout de Free +',
        'QR Codes illimités',
        'Personnalisation avancée',
        'Statistiques détaillées',
        'Suppression du branding'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 24.99,
      annualTotalPrice: 239.88,
      annualMonthlyEquivalent: 19.99,
      freeTrial: true,
      description: 'Développez et maîtrisez votre audience avec un Linktree de marque.',
      features: [
        'Tout de Starter +',
        'Domaine personnalisé',
        'Analytics avancées avec export',
        'Deep links intelligents',
        'Business cards digitales',
        'Support prioritaire'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 69.99,
      annualTotalPrice: 671.88,
      annualMonthlyEquivalent: 55.99,
      description: 'Toutes les fonctionnalités pour les utilisateurs avancés et les entreprises.',
      features: [
        'Tout de Pro +',
        'Liens illimités',
        'Support prioritaire 24/7',
        'Membres d\'équipe illimités',
        'QR codes white-label',
        'Accès API complet',
        'Domaines personnalisés illimités'
      ]
    }
  ];

  const handleSelectPlan = () => {
    if (selectedPlan === currentTier) {
      toast.info('Vous êtes déjà sur ce plan');
    } else {
      toast.success(`Upgrade vers ${plans.find(p => p.id === selectedPlan)?.name} effectué !`);
    }
  };

  const toggleBenefits = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace('.', ',');
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg text-white font-semibold">Modifier l’abonnement</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Billing Cycle Toggle */}
        <div className="flex gap-0 mb-6 border-b border-gray-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 pb-3 text-center transition-all ${
              billingCycle === 'monthly'
                ? 'text-white border-b-2 border-white font-medium'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 pb-3 text-center transition-all ${
              billingCycle === 'annual'
                ? 'text-white border-b-2 border-white font-medium'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Annuel
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentTier;
            const isSelected = plan.id === selectedPlan;
            const isExpanded = expandedPlan === plan.id;
            
            const displayPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualTotalPrice;
            const period = billingCycle === 'monthly' ? '/ mois' : '/ an';

            return (
              <div
                key={plan.id}
                className={`bg-gray-800 rounded-2xl p-4 transition-all relative overflow-hidden ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg text-white font-bold">{plan.name}</h3>
                      {isCurrentPlan && (
                        <Badge className="bg-gray-700 text-white text-xs px-2 py-0.5 border-none">
                          Abonnement actuel
                        </Badge>
                      )}
                      {plan.freeTrial && (
                        <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 border-none hover:bg-green-600">
                          Essai gratuit
                        </Badge>
                      )}
                    </div>

                    {plan.id !== 'free' ? (
                      <div className="mb-1 flex items-baseline gap-1">
                         <span className="text-2xl text-white font-bold">
                           {formatPrice(displayPrice)} €
                         </span>
                         <span className="text-sm text-gray-400 font-light">
                           {period}
                         </span>
                      </div>
                    ) : (
                      <div className="mb-1 flex items-baseline gap-1">
                         <span className="text-2xl text-white font-bold">
                           0 €
                         </span>
                      </div>
                    )}

                    {billingCycle === 'annual' && plan.id !== 'free' && (
                       <p className="text-sm text-gray-400 mb-2 opacity-80">
                         Soit {formatPrice(plan.annualMonthlyEquivalent)} € / mois – facturé annuellement
                       </p>
                    )}

                    <p className="text-sm text-gray-400 mb-3 leading-snug">
                      {plan.description}
                    </p>

                    <button
                      onClick={() => toggleBenefits(plan.id)}
                      className="flex items-center gap-1 text-sm text-white hover:underline focus:outline-none"
                    >
                      Voir les avantages
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Expanded Benefits */}
                    {isExpanded && (
                      <ul className="mt-3 space-y-2 pl-0 animate-in slide-in-from-top-2 duration-200">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Radio Button */}
                  <button
                    onClick={() => {
                        if (plan.id !== 'free') setSelectedPlan(plan.id);
                    }}
                    disabled={plan.id === 'free'}
                    className={`ml-3 mt-1 outline-none ${plan.id === 'free' ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-white bg-white'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pick Plan Button */}
        <div className="mt-8 mb-8">
          <Button
            onClick={handleSelectPlan}
            disabled={selectedPlan === currentTier}
            className={`w-full h-12 rounded-xl text-lg font-semibold transition-all ${
              selectedPlan === currentTier
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10'
            }`}
          >
            {selectedPlan === currentTier ? 'Abonnement actuel' : 'Choisir ce plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
