import { useState, ReactNode } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { CustomLinkIcon, CustomLinkInBioIcon, CustomAnalyticsIcon, CustomProfileIcon } from '../custom-icons';
import { ThemeToggle } from '../theme-toggle';
import { Badge } from '../ui/badge';
import { FuturisticSidebar } from '../futuristic-sidebar';
import logoOpenUp from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';

interface AppLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  onCreateClick?: () => void;
  onSignOut?: () => void;
  subscriptionTier?: string;
  isMobile?: boolean;
  userData?: any;
  onUpgradeClick?: () => void;
}

export function AppLayout({ 
  children, 
  activeView, 
  onViewChange, 
  onCreateClick,
  onSignOut,
  subscriptionTier = 'starter',
  isMobile = false,
  userData,
  onUpgradeClick
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'business': return 'bg-purple-500 hover:bg-purple-500';
      case 'pro': return 'bg-blue-500 hover:bg-blue-500';
      case 'starter': return 'bg-orange-500 hover:bg-orange-500';
      case 'free': return 'bg-gray-500 hover:bg-gray-500';
      default: return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  // Menu mobile : Links, Link in Bio, FAB+, Analytics, Profile
  const mobileBottomItems = [
    { id: 'design', icon: CustomLinkIcon },
    { id: 'link-in-bio', icon: CustomLinkInBioIcon },
    { id: 'analytics', icon: CustomAnalyticsIcon },
    { id: 'settings', icon: CustomProfileIcon },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            
            <img 
              src={logoOpenUp} 
              alt="OpenUp" 
              className="h-6 dark:invert dark:brightness-0 dark:contrast-200 absolute left-1/2 -translate-x-1/2" 
            />
            
            <button 
              onClick={() => {
                if (onUpgradeClick) {
                  onUpgradeClick();
                } else {
                  onViewChange('settings');
                }
              }}
              className="hover:opacity-80 transition-opacity"
            >
              <Badge className={`${getBadgeColor(subscriptionTier)} text-white text-xs px-2 py-0.5 cursor-pointer`}>
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Badge>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Menu */}
        {mobileMenuOpen && (
          <FuturisticSidebar
            userData={userData}
            activeTab={activeView}
            onTabChange={(tab) => {
              onViewChange(tab);
              setMobileMenuOpen(false);
            }}
            onSignOut={onSignOut || (() => {})}
            onCreateLink={onCreateClick || (() => {})}
            isMobileOpen={mobileMenuOpen}
            onMobileToggle={() => setMobileMenuOpen(false)}
            onUpgradeClick={onUpgradeClick}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto pt-[57px] pb-[72px] no-scrollbar">
          {children}
        </main>

        {/* Bottom Navigation - 5 icons comme l'image */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {/* Links */}
            <button
              onClick={() => onViewChange('design')}
              className="flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <CustomLinkIcon 
                className="w-6 h-6"
                active={activeView === 'design' || activeView === 'links'}
              />
            </button>
            
            {/* Link in Bio */}
            <button
              onClick={() => onViewChange('link-in-bio')}
              className="flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <CustomLinkInBioIcon 
                className="w-6 h-6"
                active={activeView === 'link-in-bio'}
              />
            </button>
            
            {/* FAB Central + */}
            <button
              onClick={onCreateClick}
              className="flex flex-col items-center justify-center p-2 -mb-3"
            >
              <div className="w-14 h-14 bg-[#3399ff] rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
            </button>
            
            {/* Analytics */}
            <button
              onClick={() => onViewChange('analytics')}
              className="flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <CustomAnalyticsIcon 
                className="w-6 h-6"
                active={activeView === 'analytics'}
              />
            </button>
            
            {/* Profile/Settings */}
            <button
              onClick={() => onViewChange('settings')}
              className="flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <CustomProfileIcon 
                className="w-6 h-6"
                active={activeView === 'settings'}
              />
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout - Utilise FuturisticSidebar
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <FuturisticSidebar
        userData={userData}
        activeTab={activeView}
        onTabChange={onViewChange}
        onSignOut={onSignOut || (() => {})}
        onCreateLink={onCreateClick || (() => {})}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onUpgradeClick={onUpgradeClick}
      />

      {/* Overlay pour rétracter la sidebar au clic en dehors */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setSidebarCollapsed(true)}
          style={{ marginLeft: '256px' }}
        />
      )}

      {/* Desktop Content - Margin pour compenser la sidebar fixe */}
      <main 
        className={`flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-gray-900 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        {children}
      </main>
    </div>
  );
}
