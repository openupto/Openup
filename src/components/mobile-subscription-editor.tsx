import { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface MobileSubscriptionEditorProps {
  onClose: () => void;
  currentPlan: 'free' | 'starter' | 'pro';
}

interface Plan {
  id: 'free' | 'starter' | 'pro';
  name: string;
  price?: string;
  priceMonthly?: string;
  priceAnnually?: string;
  priceAnnuallyOriginal?: string;
  priceYearly?: string;
  description: string;
  badge?: {
    text: string;
    variant: 'current' | 'trial';
  };
  benefits: string[];
}

export function MobileSubscriptionEditor({ 
  onClose,
  currentPlan = 'free'
}: MobileSubscriptionEditorProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'pro'>(currentPlan);
  const [expandedBenefits, setExpandedBenefits] = useState<string[]>([]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Unlimited links and a customisable Linktree.',
      badge: currentPlan === 'free' ? {
        text: 'Current Plan',
        variant: 'current'
      } : undefined,
      benefits: [
        'Unlimited links',
        'Customizable profile',
        'Basic analytics',
        'OpenUp branding'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: '12 €',
      priceAnnually: '119 €',
      priceAnnuallyOriginal: '144 € EUR',
      description: 'More customisation and control.',
      benefits: [
        'Everything in Free',
        'Remove OpenUp branding',
        'Custom themes',
        'Priority support',
        'Advanced analytics',
        'SEO optimization'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Free for 1 week',
      priceYearly: '229 € per year after.',
      priceMonthly: '23 €',
      priceAnnually: '229 €',
      priceAnnuallyOriginal: '276 € EUR',
      description: 'Grow, learn about and own your following forever with a branded Linktree.',
      badge: {
        text: 'Free Trial',
        variant: 'trial'
      },
      benefits: [
        'Everything in Starter',
        'Custom domain',
        'Link scheduling',
        'Advanced integrations',
        'Priority link placement',
        'Custom CSS',
        'Team collaboration',
        'API access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      priceMonthly: '40 €',
      priceAnnually: '399 €',
      priceAnnuallyOriginal: '480 € EUR',
      description: 'All features for power users and businesses.',
      benefits: [
        'Everything in Pro',
        'Unlimited links',
        'Priority support 24/7',
        'Unlimited team members',
        'White-label QR codes',
        'Full API access',
        'Unlimited custom domains',
        'Dedicated account manager'
      ]
    }
  ];

  const toggleBenefits = (planId: string) => {
    if (expandedBenefits.includes(planId)) {
      setExpandedBenefits(expandedBenefits.filter(id => id !== planId));
    } else {
      setExpandedBenefits([...expandedBenefits, planId]);
    }
  };

  const handlePickPlan = () => {
    if (selectedPlan === currentPlan) {
      toast.info('Vous êtes déjà sur ce plan');
      return;
    }
    
    toast.success(`Passage au plan ${selectedPlan.toUpperCase()} !`);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const getPlanPrice = (plan: Plan) => {
    if (plan.id === 'free') return null;
    
    if (plan.id === 'pro') {
      return (
        <div>
          <div className="mb-1">{plan.price}</div>
          <div className="text-sm text-gray-500">{plan.priceYearly}</div>
        </div>
      );
    }
    
    if (billingPeriod === 'monthly') {
      return (
        <div>
          <span>{plan.priceMonthly}</span>
          <span className="text-sm text-gray-500"> per month</span>
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span>{plan.priceAnnually}</span>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none text-xs px-2 py-0.5 hover:bg-green-100">
              Économisez 25%
            </Badge>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">billed annually </span>
            <span className="text-gray-400 line-through">{plan.priceAnnuallyOriginal}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b border-border bg-white dark:bg-gray-900 safe-area-top">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-foreground">Edit Subscription</h2>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Billing Period Tabs */}
      <div className="px-4 sm:px-6 md:px-8 py-4 border-b border-border bg-white dark:bg-gray-900">
        <div className="flex gap-6 sm:gap-8 md:gap-10">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className="relative pb-2 transition-colors"
          >
            <span className={billingPeriod === 'monthly' ? 'text-foreground' : 'text-gray-500'}>
              Monthly
            </span>
            {billingPeriod === 'monthly' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          
          <button
            onClick={() => setBillingPeriod('annual')}
            className="relative pb-2 transition-colors"
          >
            <span className={billingPeriod === 'annual' ? 'text-foreground' : 'text-gray-500'}>
              Annual
            </span>
            {billingPeriod === 'annual' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 md:p-7"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{plan.name}</h3>
                    {plan.badge && (
                      <Badge 
                        variant={plan.badge.variant === 'trial' ? 'default' : 'secondary'}
                        className={
                          plan.badge.variant === 'trial' 
                            ? 'bg-[#00D26B] text-white border-none text-xs px-2 py-0.5 hover:bg-[#00D26B]' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 text-xs px-2 py-0.5'
                        }
                      >
                        {plan.badge.text}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="text-foreground mb-3">
                    {getPlanPrice(plan)}
                  </div>
                </div>
                
                {/* Checkbox */}
                {plan.id !== 'free' && (
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 mt-1"
                  >
                    {selectedPlan === plan.id && (
                      <div className="w-3 h-3 bg-[#3399ff] rounded-sm" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {plan.description}
              </p>
              
              {/* See Benefits */}
              <button
                onClick={() => toggleBenefits(plan.id)}
                className="flex items-center gap-2 text-sm text-foreground hover:text-[#3399ff] transition-colors"
              >
                <span>See benefits</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${
                    expandedBenefits.includes(plan.id) ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {/* Benefits List */}
              {expandedBenefits.includes(plan.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-[#3399ff] mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="border-t border-border bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-8 pb-safe-enhanced">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handlePickPlan}
            disabled={selectedPlan === 'free'}
            className={`w-full rounded-xl h-12 sm:h-13 md:h-14 transition-all ${
              selectedPlan === 'free' 
                ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' 
                : 'bg-[#3399ff] hover:bg-[#2277dd] text-white'
            }`}
          >
            Pick a Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
