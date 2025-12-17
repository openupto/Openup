import { Badge } from './ui/badge';
import { ThemeToggle } from './theme-toggle';
import { Menu, Crown } from 'lucide-react';
import logoOpenUp from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';

interface MobileHeaderProps {
  onMenuOpen: () => void;
  onSubscriptionClick?: () => void;
  subscriptionTier?: string;
}

const getBadgeColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'starter':
      return 'bg-[#FFA500] hover:bg-[#FF8C00]';
    case 'pro':
      return 'bg-[#9333EA] hover:bg-[#7E22CE]';
    case 'business':
      return 'bg-[#3B82F6] hover:bg-[#2563EB]';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export function MobileHeader({ 
  onMenuOpen, 
  onSubscriptionClick,
  subscriptionTier = 'starter'
}: MobileHeaderProps) {
  const badgeText = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={onMenuOpen}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#3399ff] to-blue-600 rounded-lg flex items-center justify-center p-1">
            <img 
              src={logoOpenUp} 
              alt="OpenUp Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[#3399ff]">OpenUp</span>
          <Badge 
            onClick={onSubscriptionClick}
            className={`${getBadgeColor(subscriptionTier)} text-white border-none text-xs px-2.5 py-0.5 ${onSubscriptionClick ? 'cursor-pointer' : ''} transition-colors`}
          >
            {badgeText}
          </Badge>
        </div>
        
        <ThemeToggle />
      </div>
    </div>
  );
}