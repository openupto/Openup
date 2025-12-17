import { useState } from 'react';
import { 
  ChevronRight, 
  Crown, 
  Globe, 
  Share2, 
  CreditCard, 
  Receipt, 
  User, 
  Settings as SettingsIcon, 
  Moon, 
  HelpCircle, 
  MessageCircle,
  LogOut,
  Lock
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useTheme } from '../theme-context';
import { toast } from 'sonner@2.0.3';
import { UserAvatar } from '../user-avatar';

interface SettingsViewProps {
  userData?: any;
  isMobile?: boolean;
  onNavigateToSubpage?: (subpage: string) => void;
  onSignOut?: () => void;
}

export function SettingsView({ 
  userData, 
  isMobile = false,
  onNavigateToSubpage,
  onSignOut
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const userName = userData?.name || 'Mike Johnson';
  const userEmail = userData?.email || 'demo@openup.com';
  const subscriptionTier = userData?.subscription_tier || 'starter';

  const handleToggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    toast.success(isDarkMode ? 'Mode clair activé' : 'Mode sombre activé');
  };

  const handleUpgrade = () => {
    if (onNavigateToSubpage) {
      onNavigateToSubpage('subscription');
    } else {
      toast.info('Upgrade vers Pro ou Business');
    }
  };

  const handleNavigate = (page: string) => {
    if (onNavigateToSubpage) {
      onNavigateToSubpage(page);
    } else {
      toast.info(`Navigation vers ${page}`);
    }
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      toast.success('Déconnexion réussie');
    }
  };

  const getBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'business':
        return 'bg-purple-500 hover:bg-purple-500';
      case 'pro':
        return 'bg-blue-500 hover:bg-blue-500';
      case 'starter':
        return 'bg-orange-500 hover:bg-orange-500';
      default:
        return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  const menuSections = [
    {
      id: 'tools',
      label: 'Outils',
      items: [
        {
          id: 'custom-domain',
          label: 'Domaine personnalisé',
          icon: Globe,
          onClick: () => handleNavigate('custom-domain'),
          isComingSoon: true
        }
      ]
    },
    {
      id: 'account',
      label: 'Compte',
      items: [
        {
          id: 'subscription',
          label: 'Abonnements',
          icon: Crown,
          onClick: () => handleNavigate('subscription')
        },
        {
          id: 'billing',
          label: 'Facturation',
          icon: Receipt,
          onClick: () => handleNavigate('billing')
        },
        {
          id: 'profile',
          label: 'Profil',
          icon: User,
          onClick: () => handleNavigate('profile')
        },
        {
          id: 'settings',
          label: 'Paramètre',
          icon: SettingsIcon,
          onClick: () => handleNavigate('parameters')
        }
      ]
    },
    {
      id: 'display',
      label: 'Affichage',
      items: [
        {
          id: 'dark-mode',
          label: 'Mode sombre',
          icon: Moon,
          isToggle: true,
          value: isDarkMode,
          onChange: handleToggleDarkMode
        }
      ]
    },
    {
      id: 'contact',
      label: 'Contact',
      items: [
        {
          id: 'help',
          label: "Besoin d'aide ?",
          icon: HelpCircle,
          onClick: () => handleNavigate('help')
        },
        {
          id: 'faq',
          label: 'FAQ',
          icon: MessageCircle,
          onClick: () => handleNavigate('faq')
        }
      ]
    }
  ];

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} bg-white dark:bg-gray-900 min-h-full`}>
      {/* Header avec photo de profil */}
      <div className="flex items-center gap-4 mb-6">
        <UserAvatar 
          user={userData}
          className="w-16 h-16"
        />
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">{userName}</h2>
          <Badge className={`${getBadgeColor(subscriptionTier)} text-white px-3 py-1`}>
            <Crown className="w-3 h-3 mr-1" />
            {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Bouton Upgrade */}
      <Button
        onClick={handleUpgrade}
        className="w-full bg-[#006EF7] hover:bg-[#0056c7] text-white rounded-xl h-14 mb-6 flex items-center justify-center gap-2"
      >
        <Crown className="w-4 h-4" />
        <span className="uppercase">Upgrade</span>
      </Button>

      {/* Menu sections */}
      <div className="space-y-6">
        {menuSections.map((section) => (
          <div key={section.id}>
            {/* Section label */}
            <h3 className="text-sm text-gray-400 dark:text-gray-500 mb-3 px-1">
              {section.label}
            </h3>

            {/* Section items */}
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                
                if (item.isToggle) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                      </div>
                      <Switch
                        checked={item.value || false}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                  );
                }

                const isComingSoon = (item as any).isComingSoon;

                if (isComingSoon) {
                  return (
                    <div
                      key={item.id}
                      className="w-full flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-900 rounded-lg cursor-not-allowed opacity-75"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-xs text-gray-400 font-normal">(À venir)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Bouton Déconnexion */}
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full border-red-200 dark:border-red-900 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl h-12 mb-4"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>

      {/* Footer */}
      <div className="text-center space-y-2">
        <button
          onClick={() => handleNavigate('legal')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Mention légal
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Version 1
        </p>
      </div>
    </div>
  );
}
