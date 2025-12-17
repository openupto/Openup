import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MobileHeader } from './mobile-header';
import { 
  Plus,
  Search,
  MoreVertical,
  Copy,
  BarChart3,
  Grid3x3,
  Settings,
  SlidersHorizontal,
  Home,
  Download
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  shortUrl: string;
  clicks: string;
  date: string;
}

const demoLinks: LinkItem[] = [
  {
    id: '1',
    title: 'Mon Portfolio',
    shortUrl: 'openup.to/fJV7dE',
    clicks: '1,2K',
    date: '29/09/25'
  },
  {
    id: '2',
    title: 'Lien tiktok',
    shortUrl: 'openup.to/NK5T9Z',
    clicks: '946',
    date: '29/09/25'
  },
  {
    id: '3',
    title: 'Collection été',
    shortUrl: 'openup.to/myshop',
    clicks: '49',
    date: '08/09/25'
  },
  {
    id: '4',
    title: 'Linkedin',
    shortUrl: 'openup.to/Rihanna',
    clicks: '27,3K',
    date: '04/09/25'
  },
  {
    id: '5',
    title: 'Youtube',
    shortUrl: 'openup.to/Squeezie',
    clicks: '604K',
    date: '31/08/25'
  }
];

interface QRCodeItem {
  id: string;
  title: string;
  scans: string;
  date: string;
  qrColor: string;
}

const demoQRCodes: QRCodeItem[] = [
  {
    id: '1',
    title: 'Mon Portfolio',
    scans: '40 scans',
    date: '29/09/25',
    qrColor: '#22c55e'
  },
  {
    id: '2',
    title: 'Lien tiktok',
    scans: '189 scans',
    date: '29/09/25',
    qrColor: '#000000'
  },
  {
    id: '3',
    title: 'Collection été',
    scans: '1,3K scans',
    date: '08/09/25',
    qrColor: '#000000'
  },
  {
    id: '4',
    title: 'Linkedin',
    scans: '23K scans',
    date: '04/09/25',
    qrColor: '#000000'
  },
  {
    id: '5',
    title: 'Youtube',
    scans: '8 scans',
    date: '31/08/25',
    qrColor: '#ef4444'
  }
];

// Fonction pour obtenir la couleur du badge selon le plan
const getBadgeColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'starter':
      return 'bg-orange-500 hover:bg-orange-500';
    case 'pro':
      return 'bg-blue-500 hover:bg-blue-500';
    case 'business':
      return 'bg-purple-500 hover:bg-purple-500';
    default:
      return 'bg-gray-500 hover:bg-gray-500';
  }
};

interface SimpleMobileInterfaceProps {
  userData: any;
  onMenuOpen?: () => void;
  onCreateLink: () => void;
  activeBottomTab?: string;
  onBottomTabChange?: (tab: string) => void;
}

export function SimpleMobileInterface({ 
  userData, 
  onMenuOpen,
  onCreateLink,
  activeBottomTab = 'links',
  onBottomTabChange
}: SimpleMobileInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'lien' | 'qr-code'>('lien');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = demoLinks.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQRCodes = demoQRCodes.filter(qr =>
    qr.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subscriptionTier = userData?.subscription_tier || 'starter';
  const badgeText = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden no-scrollbar">
      {/* Header */}
      <MobileHeader 
        onMenuOpen={onMenuOpen || (() => {})}
        subscriptionTier={subscriptionTier}
      />

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('lien')}
            className={`py-3 px-1 text-sm relative transition-colors ${
              activeTab === 'lien' 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Lien
            {activeTab === 'lien' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3399ff]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('qr-code')}
            className={`py-3 px-1 text-sm relative transition-colors ${
              activeTab === 'qr-code' 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            QR Code
            {activeTab === 'qr-code' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3399ff]" />
            )}
          </button>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto pb-[72px] px-4 bg-white dark:bg-gray-900 no-scrollbar">
        {activeTab === 'lien' ? (
          <>
            {/* Bouton Créer un lien */}
            <div className="pt-4 pb-4">
              <Button
                onClick={onCreateLink}
                className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white rounded-2xl h-14 flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                <span className="font-medium text-base">Créer un lien</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <Input
                  type="text"
                  placeholder="Chercher un lien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#f5f5f5] dark:bg-gray-800 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 dark:text-gray-100"
                />
              </div>
              <button className="w-11 h-11 bg-[#f5f5f5] dark:bg-gray-800 border-0 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0">
                <SlidersHorizontal className="w-[18px] h-[18px] text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Header de liste */}
            <div className="flex items-center justify-between mb-3 px-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Liens</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Clics</span>
            </div>

            {/* Liste des liens */}
            <div className="space-y-2">
              {filteredLinks.map((link) => (
                <div key={link.id} className="bg-[#f5f5f5] dark:bg-gray-800 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-base leading-tight">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 leading-tight">
                        {link.shortUrl}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5 leading-tight">
                        <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                        {link.date}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100 min-w-[55px] text-right">
                        {link.clicks}
                      </span>
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Copy className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Bouton Créer un QR Code */}
            <div className="pt-4 pb-4">
              <Button
                onClick={onCreateLink}
                className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white rounded-2xl h-14 flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                <span className="font-medium text-base">Créer un QR Code</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <Input
                  type="text"
                  placeholder="Chercher un QR Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#f5f5f5] dark:bg-gray-800 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 dark:text-gray-100"
                />
              </div>
              <button className="w-11 h-11 bg-[#f5f5f5] dark:bg-gray-800 border-0 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0">
                <SlidersHorizontal className="w-[18px] h-[18px] text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Header QR Codes */}
            <div className="mb-3 px-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">QR Codes</span>
            </div>

            {/* Liste des QR Codes */}
            <div className="space-y-2">
              {filteredQRCodes.map((qr) => (
                <div key={qr.id} className="bg-[#f5f5f5] dark:bg-gray-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-base leading-tight">
                        {qr.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 leading-tight">
                        {qr.scans}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5 leading-tight">
                        <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                        {qr.date}
                      </p>
                    </div>
                    
                    {/* QR Code Preview */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                        <svg viewBox="0 0 29 29" className="w-full h-full">
                          <rect width="29" height="29" fill="white"/>
                          <path d="M0,0 L3,0 L3,3 L0,3 Z M4,0 L5,0 L5,1 L4,1 Z M6,0 L7,0 L7,1 L6,1 Z M8,0 L9,0 L9,1 L8,1 Z M10,0 L11,0 L11,1 L10,1 Z M15,0 L16,0 L16,1 L15,1 Z M18,0 L19,0 L19,1 L18,1 Z M20,0 L21,0 L21,1 L20,1 Z M25,0 L29,0 L29,3 L25,3 Z" fill={qr.qrColor}/>
                          <path d="M1,1 L2,1 L2,2 L1,2 Z M26,1 L28,1 L28,2 L26,2 Z" fill="white"/>
                          <path d="M0,4 L1,4 L1,5 L0,5 Z M2,4 L3,4 L3,5 L2,5 Z M6,4 L7,4 L7,5 L6,5 Z M12,4 L14,4 L14,5 L12,5 Z M16,4 L17,4 L17,5 L16,5 Z M25,4 L29,4 L29,5 L25,5 Z" fill={qr.qrColor}/>
                          <path d="M0,25 L3,25 L3,29 L0,29 Z M25,25 L29,25 L29,29 L25,29 Z" fill={qr.qrColor}/>
                          <path d="M1,26 L2,26 L2,28 L1,28 Z M26,26 L28,26 L28,28 L26,28 Z" fill="white"/>
                        </svg>
                      </div>
                      
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                      </button>
                      
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Download className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation - Fixed en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe-enhanced">
        <div className="flex items-end justify-around px-4 pt-2">
          <button
            onClick={() => onBottomTabChange?.('dashboard')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Home className={`w-6 h-6 ${activeBottomTab === 'dashboard' || activeBottomTab === 'design' ? 'text-[#0066ff]' : 'text-gray-900 dark:text-gray-400'}`} strokeWidth={2} />
          </button>
          
          <button
            onClick={() => onBottomTabChange?.('link-in-bio')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Grid3x3 className={`w-6 h-6 ${activeBottomTab === 'link-in-bio' ? 'text-[#0066ff]' : 'text-gray-900 dark:text-gray-400'}`} strokeWidth={2} />
          </button>
          
          <button
            onClick={onCreateLink}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] -mb-3 touch-target"
          >
            <div className="w-14 h-14 bg-[#0066ff] rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </button>
          
          <button
            onClick={() => onBottomTabChange?.('analytics')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <BarChart3 className={`w-6 h-6 ${activeBottomTab === 'analytics' ? 'text-[#0066ff]' : 'text-gray-900 dark:text-gray-400'}`} strokeWidth={2} />
          </button>
          
          <button
            onClick={() => onBottomTabChange?.('settings')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Settings className={`w-6 h-6 ${activeBottomTab === 'settings' ? 'text-[#0066ff]' : 'text-gray-900 dark:text-gray-400'}`} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
