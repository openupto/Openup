import { Link2, QrCode } from 'lucide-react';

interface LinkTabNavigationProps {
  activeSubTab: 'links' | 'qr-codes';
  onSubTabChange: (subTab: 'links' | 'qr-codes') => void;
}

export function LinkTabNavigation({ 
  activeSubTab, 
  onSubTabChange 
}: LinkTabNavigationProps) {
  const subTabs = [
    {
      id: 'links' as const,
      label: 'Lien',
      isActive: activeSubTab === 'links'
    },
    {
      id: 'qr-codes' as const,
      label: 'QR Code',
      isActive: activeSubTab === 'qr-codes'
    }
  ];

  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
      {subTabs.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => onSubTabChange(tab.id)}
            className={`
              relative px-6 py-3 transition-all duration-200
              ${tab.isActive 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="relative z-10">{tab.label}</span>
            
            {/* Bordure inférieure pour l'onglet actif */}
            {tab.isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006EF7]"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}