import React from 'react';
import { MobileHeader } from './mobile-header';
import { 
  Home,
  Grid3x3,
  Plus,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  subscriptionTier?: string;
  onMenuOpen?: () => void;
  onCreateLink?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  hideUpgradeButton?: boolean;
}

export function MobileLayout({ 
  children, 
  subscriptionTier = 'starter',
  onMenuOpen,
  onCreateLink,
  activeTab = 'dashboard',
  onTabChange,
  hideUpgradeButton = false
}: MobileLayoutProps) {

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header unifié */}
      <MobileHeader 
        onMenuOpen={onMenuOpen || (() => {})}
        subscriptionTier={subscriptionTier}
      />

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-[57px] pb-[72px] bg-white">
        {children}
      </div>

      {/* Bottom Navigation - Fixed en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shrink-0 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => onTabChange?.('dashboard')}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px]"
          >
            <Home className={`w-6 h-6 ${activeTab === 'dashboard' || activeTab === 'design' ? 'text-[#0066ff]' : 'text-gray-900'}`} />
          </button>
          
          <button
            onClick={() => onTabChange?.('link-in-bio')}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px]"
          >
            <Grid3x3 className={`w-6 h-6 ${activeTab === 'link-in-bio' ? 'text-[#0066ff]' : 'text-gray-900'}`} />
          </button>
          
          <button
            onClick={onCreateLink}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px] -mt-2"
          >
            <div className="w-14 h-14 bg-[#0066ff] rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </button>
          
          <button
            onClick={() => onTabChange?.('analytics')}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px]"
          >
            <BarChart3 className={`w-6 h-6 ${activeTab === 'analytics' ? 'text-[#0066ff]' : 'text-gray-900'}`} />
          </button>
          
          <button
            onClick={() => onTabChange?.('settings')}
            className="flex flex-col items-center justify-center gap-1 p-2 min-w-[60px]"
          >
            <Settings className={`w-6 h-6 ${activeTab === 'settings' ? 'text-[#0066ff]' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
