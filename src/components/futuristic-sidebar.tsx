import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserAvatar } from './user-avatar';
import { cn } from './ui/utils';
import logoOpenUp from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';
import { CustomLinkIcon, CustomLinkInBioIcon, CustomAnalyticsIcon, CustomProfileIcon, CustomTeamIcon, CustomSettingsIcon } from './custom-icons';
import {
  LogOut,
  Crown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Workflow,
  CreditCard
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

interface FuturisticSidebarProps {
  userData: UserData | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  onCreateLink: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onUpgradeClick?: () => void;
}

const menuItems = [
  {
    id: 'design',
    label: 'Liens',
    icon: CustomLinkIcon,
  },
  {
    id: 'link-in-bio',
    label: 'Link in Bio',
    icon: CustomLinkInBioIcon,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: CustomAnalyticsIcon,
  },
  {
    id: 'team',
    label: 'Équipe',
    icon: CustomTeamIcon,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: CustomSettingsIcon,
  }
];

const futureFeatures = [
  {
    id: 'business-card',
    label: 'Business Card',
    icon: CreditCard,
  },
  {
    id: 'automation',
    label: 'Automatisation',
    icon: Workflow,
  }
];

export function FuturisticSidebar({
  userData,
  activeTab,
  onTabChange,
  onSignOut,
  collapsed = false,
  onCollapsedChange,
  onUpgradeClick,
  isMobileOpen = false,
  onMobileToggle,
}: FuturisticSidebarProps) {
  const subscriptionTier = userData?.subscription_tier || 'free';

  const getBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'business':
        return 'bg-purple-500 hover:bg-purple-500';
      case 'pro':
        return 'bg-blue-500 hover:bg-blue-500';
      case 'starter':
        return 'bg-orange-500 hover:bg-orange-500';
      case 'free':
        return 'bg-gray-500 hover:bg-gray-500';
      default:
        return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  // Gestion du mode mobile
  if (isMobileOpen && onMobileToggle) {
    return (
      <>
        {/* Overlay pour fermer au clic */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onMobileToggle}
        />
        
        {/* Sidebar mobile */}
        <aside
          className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300"
        >
          <div className="flex flex-col h-full">
            {/* Header mobile avec profil utilisateur */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between p-4 pb-3">
                <img 
                  src={logoOpenUp} 
                  alt="OpenUp" 
                  className="h-6 dark:invert dark:brightness-0 dark:contrast-200" 
                />
                <button
                  onClick={onMobileToggle}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Section Profil Utilisateur */}
              <div className="px-4 pb-4">
                <button 
                  onClick={() => {
                    onTabChange('settings');
                    onMobileToggle();
                  }}
                  className="w-full flex items-center gap-3 p-2 -mx-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                >
                  <UserAvatar 
                    user={userData} 
                    className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700" 
                    fallbackClassName="bg-[#3399ff]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {userData?.name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userData?.email || 'demo@openup.com'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Menu items mobile */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isCustomIcon = Icon === CustomLinkIcon || Icon === CustomLinkInBioIcon || Icon === CustomAnalyticsIcon || Icon === CustomProfileIcon || Icon === CustomTeamIcon || Icon === CustomSettingsIcon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onMobileToggle();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                      isActive
                        ? 'bg-[#3399ff] text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Future features mobile */}
              {futureFeatures.map((item) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    disabled
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5">
                        Bientôt
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Footer mobile */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <button
                onClick={() => {
                  if (onUpgradeClick) {
                    onUpgradeClick();
                  } else {
                    onTabChange('settings');
                  }
                  onMobileToggle();
                }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Badge className={`${getBadgeColor(subscriptionTier)} text-white px-3 py-1 w-full justify-center cursor-pointer`}>
                  <Crown className="w-3 h-3 mr-1" />
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                </Badge>
              </button>

              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header avec profil utilisateur et bouton collapse */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          {/* Logo et bouton collapse */}
          <div className={cn(
            'flex items-center justify-between p-4 pb-3',
            collapsed && 'justify-center'
          )}>
            {!collapsed && (
              <>
                <img 
                  src={logoOpenUp} 
                  alt="OpenUp" 
                  className="h-6 dark:invert dark:brightness-0 dark:contrast-200" 
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCollapsedChange?.(!collapsed);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
            
            {collapsed && (
              <>
                <img 
                  src={logoOpenUp} 
                  alt="OpenUp" 
                  className="h-6 w-6 object-contain dark:invert dark:brightness-0 dark:contrast-200" 
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCollapsedChange?.(!collapsed);
                  }}
                  className="absolute top-4 -right-3 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shadow-md"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
          </div>

          {/* Section Profil Utilisateur */}
          {!collapsed && (
            <div className="px-4 pb-4">
              <button 
                onClick={() => onTabChange('settings')}
                className="w-full flex items-center gap-3 p-2 -mx-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
              >
                <UserAvatar 
                  user={userData} 
                  className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700" 
                  fallbackClassName="bg-[#3399ff]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userData?.name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData?.email || 'demo@openup.com'}
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Avatar seul quand collapsed */}
          {collapsed && (
            <div className="px-4 pb-4 flex justify-center">
              <button 
                onClick={() => onTabChange('settings')}
                className="hover:opacity-80 transition-opacity"
              >
                <UserAvatar 
                  user={userData} 
                  className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700" 
                  fallbackClassName="bg-[#3399ff]"
                />
              </button>
            </div>
          )}
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-[#3399ff] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className={cn('shrink-0', collapsed ? 'w-6 h-6' : 'w-5 h-5')} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Séparateur */}
          <div className="py-3">
            <div className="border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          {/* Section Fonctionnalités à venir */}
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Fonctionnalités à venir
              </p>
            </div>
          )}

          {futureFeatures.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                disabled
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all opacity-50 cursor-not-allowed',
                  'text-gray-500 dark:text-gray-500',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className={cn('shrink-0', collapsed ? 'w-6 h-6' : 'w-5 h-5')} />
                {!collapsed && (
                  <div className="flex items-center gap-2 flex-1">
                    <span>{item.label}</span>
                    <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5">
                      Bientôt
                    </Badge>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer avec badge + déconnexion */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {!collapsed && (
            <button
              onClick={() => {
                if (onUpgradeClick) {
                  onUpgradeClick();
                } else {
                  onTabChange('settings');
                }
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Badge className={`${getBadgeColor(subscriptionTier)} text-white px-3 py-1 w-full justify-center cursor-pointer`}>
                <Crown className="w-3 h-3 mr-1" />
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Badge>
            </button>
          )}

          <button
            onClick={onSignOut}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut className={cn('shrink-0', collapsed ? 'w-6 h-6' : 'w-5 h-5')} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
