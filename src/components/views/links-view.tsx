import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Copy, Download, QrCode as QrCodeIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useLinks } from '../links-context';
import { useApp } from '../app-context';
import { copyToClipboard } from '../../utils/clipboard';
import { toast } from 'sonner@2.0.3';
import { LinksFilters, LinksFilterState, defaultFilters } from '../links/links-filters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Link {
  id: string;
  title: string;
  shortUrl: string;
  clicks: string;
  date: string;
  isActive: boolean;
}

interface QRCodeUI {
  id: string;
  title: string;
  scans: string;
  date: string;
  qrColor: string; // Couleur du QR code
  imageUrl?: string;
}

interface LinksViewProps {
  onCreateLink?: () => void;
  onCreateQRCode?: () => void;
  isMobile?: boolean;
}

export function LinksView({ onCreateLink, onCreateQRCode, isMobile = false }: LinksViewProps) {
  const { links } = useLinks();
  const { qrCodes: apiQRCodes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('link');
  const [filters, setFilters] = useState<LinksFilterState>(defaultFilters);

  // Map API QR Codes to UI format
  const qrCodes: QRCodeUI[] = apiQRCodes.map(qr => ({
    id: qr.id,
    title: qr.name,
    scans: '0 scans',
    date: new Date(qr.created_at).toLocaleDateString('fr-FR'),
    qrColor: qr.style?.foregroundColor || qr.style?.dotsOptions?.color || '#000000',
    imageUrl: qr.qr_image_url
  }));

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      // 1. Search
      const matchesSearch = 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Status
      if (filters.status === 'active' && !link.isActive) return false;
      if (filters.status === 'disabled' && link.isActive) return false;

      // 3. Clicks
      const clicks = parseInt(link.clicks.replace(/\D/g, '') || '0', 10);
      if (clicks < filters.minClicks) return false;
      if (filters.maxClicks < 10000 && clicks > filters.maxClicks) return false;

      // 4. Period (Simple parsing dd/mm/yyyy)
      if (filters.period !== 'all') {
        const [day, month, year] = link.date.split('/').map(Number);
        const linkDate = new Date(year, month - 1, day);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - linkDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filters.period === 'today' && diffDays > 1) return false;
        if (filters.period === '7d' && diffDays > 7) return false;
        if (filters.period === '30d' && diffDays > 30) return false;
        
        if (filters.period === 'custom' && filters.dateStart && filters.dateEnd) {
             const start = new Date(filters.dateStart);
             const end = new Date(filters.dateEnd);
             if (linkDate < start || linkDate > end) return false;
        }
      }

      // 5. Tags (Mock check in title)
      if (filters.tags.length > 0) {
         // Since we don't have tags on link object, checking title as proxy
         const hasTag = filters.tags.some(tag => link.title.toLowerCase().includes(tag.toLowerCase()));
         if (!hasTag) return false;
      }

      return true;
    }).sort((a, b) => {
       const clicksA = parseInt(a.clicks.replace(/\D/g, '') || '0', 10);
       const clicksB = parseInt(b.clicks.replace(/\D/g, '') || '0', 10);
       
       const [da, ma, ya] = a.date.split('/').map(Number);
       const [db, mb, yb] = b.date.split('/').map(Number);
       const dateA = new Date(ya, ma - 1, da).getTime();
       const dateB = new Date(yb, mb - 1, db).getTime();

       switch (filters.sortBy) {
         case 'newest': return dateB - dateA;
         case 'oldest': return dateA - dateB;
         case 'clicks_desc': return clicksB - clicksA;
         case 'clicks_asc': return clicksA - clicksB;
         case 'alpha': return a.title.localeCompare(b.title);
         default: return 0;
       }
    });
  }, [links, searchQuery, filters]);

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (shortUrl: string) => {
    copyToClipboard(`https://${shortUrl}`, 'Lien copié !');
  };

  const handleEditLink = (linkTitle: string) => {
    toast.info(`Édition de "${linkTitle}"`);
  };

  const handleDeleteLink = (linkTitle: string) => {
    toast.success(`"${linkTitle}" supprimé`);
  };

  const handleDownloadQR = (qrTitle: string) => {
    // Logic to download QR code image if URL exists
    const qr = qrCodes.find(q => q.title === qrTitle);
    if (qr?.imageUrl) {
      const link = document.createElement('a');
      link.href = qr.imageUrl;
      link.download = `qrcode-${qrTitle}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`QR Code "${qrTitle}" téléchargé`);
    } else {
      toast.error('Image non disponible');
    }
  };

  const handleEditQR = (qrTitle: string) => {
    toast.info(`Édition de "${qrTitle}"`);
  };

  const handleDeleteQR = (qrTitle: string) => {
    toast.success(`"${qrTitle}" supprimé`);
  };

  // Fonction pour générer un mini QR code SVG
  const renderMiniQRCode = (color: string) => {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Border */}
        <rect x="2" y="2" width="52" height="52" stroke={color} strokeWidth="1" fill="white"/>
        
        {/* Top-left corner */}
        <rect x="6" y="6" width="12" height="12" stroke={color} strokeWidth="2" fill="white"/>
        <rect x="9" y="9" width="6" height="6" fill={color}/>
        
        {/* Top-right corner */}
        <rect x="38" y="6" width="12" height="12" stroke={color} strokeWidth="2" fill="white"/>
        <rect x="41" y="9" width="6" height="6" fill={color}/>
        
        {/* Bottom-left corner */}
        <rect x="6" y="38" width="12" height="12" stroke={color} strokeWidth="2" fill="white"/>
        <rect x="9" y="41" width="6" height="6" fill={color}/>
        
        {/* Center pattern (random dots) */}
        <rect x="24" y="10" width="4" height="4" fill={color}/>
        <rect x="30" y="10" width="4" height="4" fill={color}/>
        <rect x="24" y="16" width="4" height="4" fill={color}/>
        <rect x="22" y="22" width="4" height="4" fill={color}/>
        <rect x="28" y="22" width="4" height="4" fill={color}/>
        <rect x="34" y="22" width="4" height="4" fill={color}/>
        <rect x="24" y="28" width="4" height="4" fill={color}/>
        <rect x="30" y="28" width="4" height="4" fill={color}/>
        <rect x="22" y="34" width="4" height="4" fill={color}/>
        <rect x="28" y="34" width="4" height="4" fill={color}/>
        <rect x="34" y="34" width="4" height="4" fill={color}/>
        <rect x="40" y="34" width="4" height="4" fill={color}/>
        <rect x="46" y="40" width="4" height="4" fill={color}/>
        
        {/* Additional center details */}
        <rect x="26" y="26" width="4" height="4" fill={color}/>
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-full">
      {/* Tabs Navigation - Full Width on Mobile */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-3">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`
              relative py-4 px-0 transition-all duration-200 flex items-center justify-center
              ${activeTab === 'link' 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <span className="relative z-10">Lien</span>
            
            {/* Bordure inférieure pour l'onglet actif */}
            {activeTab === 'link' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006EF7]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`
              relative py-4 px-0 transition-all duration-200 flex items-center justify-center
              ${activeTab === 'qrcode' 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <span className="relative z-10">QR Code</span>
            
            {/* Bordure inférieure pour l'onglet actif */}
            {activeTab === 'qrcode' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006EF7]"></div>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-4 mt-4">
        {/* Tab Content - Links */}
        {activeTab === 'link' && (
          <>
            {/* Create Button */}
            <Button
              onClick={onCreateLink}
              className="w-full bg-[#006EF7] hover:bg-[#0056c7] text-white rounded-xl h-14 flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Créer un lien</span>
            </Button>

            {/* Search & Filter */}
            <div className="mb-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Chercher un lien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl h-12"
                />
              </div>
              <LinksFilters 
                currentFilters={filters}
                onApply={setFilters}
              />
            </div>

            {/* Stats Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Liens</span>
            </div>

            {/* Links List */}
            <div className="space-y-3">
              {filteredLinks.map((link) => (
                <div 
                  key={link.id} 
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-3 flex gap-3">
                      {/* Status Indicator */}
                      <div className="flex-shrink-0 pt-1.5">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            link.isActive 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white mb-1">
                          {link.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="truncate">{link.shortUrl}</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {link.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-center mr-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Clics</div>
                        <div className="text-gray-900 dark:text-white">{link.clicks}</div>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditLink(link.title)}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(link.shortUrl)}>
                            Copier le lien
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteLink(link.title)}
                            className="text-red-600"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Copy Button */}
                      <button 
                        onClick={() => handleCopyLink(link.shortUrl)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLinks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="mb-2 text-gray-900 dark:text-white">Aucun lien trouvé</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Essayez une autre recherche' : 'Créez votre premier lien pour commencer'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={onCreateLink}
                    className="bg-[#006EF7] hover:bg-[#0056c7] text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un lien
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Tab Content - QR Codes */}
        {activeTab === 'qrcode' && (
          <>
            {/* Create Button */}
            <Button
              onClick={onCreateQRCode}
              className="w-full bg-[#006EF7] hover:bg-[#0056c7] text-white rounded-xl h-14 flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Créer un QR Code</span>
            </Button>

            {/* Search & Filter */}
            <div className="mb-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Chercher un QR Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl h-12"
                />
              </div>
              <button 
                onClick={() => {
                  setShowFilters(!showFilters);
                  toast.info(showFilters ? 'Filtres masqués' : 'Filtres affichés');
                }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  showFilters 
                    ? 'bg-[#006EF7] text-white' 
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SlidersHorizontal className={`w-5 h-5 ${showFilters ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
              </button>
            </div>

            {/* Stats Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">QR Codes</span>
            </div>

            {/* QR Codes List */}
            <div className="space-y-3">
              {filteredQRCodes.map((qr) => (
                <div 
                  key={qr.id} 
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="text-gray-900 dark:text-white mb-1">
                        {qr.title}
                      </h3>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {qr.date}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Scans count */}
                      <div className="text-center mr-1">
                        <div className="text-gray-900 dark:text-white">{qr.scans}</div>
                      </div>
                      
                      {/* QR Code Preview */}
                      <div className="bg-white p-1 rounded-lg h-14 w-14 flex items-center justify-center overflow-hidden">
                        {qr.imageUrl ? (
                          <img src={qr.imageUrl} alt={qr.title} className="max-w-full max-h-full" />
                        ) : (
                          renderMiniQRCode(qr.qrColor)
                        )}
                      </div>
                      
                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditQR(qr.title)}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadQR(qr.title)}>
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteQR(qr.title)}
                            className="text-red-600"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Download Button */}
                      <button 
                        onClick={() => handleDownloadQR(qr.title)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredQRCodes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCodeIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="mb-2 text-gray-900 dark:text-white">Aucun QR Code trouvé</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Essayez une autre recherche' : 'Créez votre premier QR Code pour commencer'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={onCreateQRCode}
                    className="bg-[#006EF7] hover:bg-[#0056c7] text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un QR Code
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
