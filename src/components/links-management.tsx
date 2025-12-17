import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useLinks, Link } from './links-context';
import { QRCodeModal } from './qr-code-modal';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';
import { 
  Search, 
  MoreHorizontal, 
  Copy, 
  ExternalLink, 
  QrCode, 
  BarChart3, 
  Trash2,
  Calendar,
  Lock,
  Eye,
  Plus,
  Video,
  MousePointer2,
  Clock
} from 'lucide-react';

interface LinksManagementProps {
  userData: any;
  onUpdateUserData: (data: any) => void;
  onViewAnalytics?: (linkId: string) => void;
}

export function LinksManagement({ userData, onUpdateUserData, onViewAnalytics }: LinksManagementProps) {
  const { links, loading, deleteLink: deleteLinkContext } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteLink, setDeleteLink] = useState<Link | null>(null);
  const [showQRCode, setShowQRCode] = useState<Link | null>(null);

  const handleCopyLink = (shortUrl: string) => {
    copyToClipboard(shortUrl, 'Lien copié dans le presse-papier !');
  };

  const handleDeleteLink = async (link: Link) => {
    try {
      await deleteLinkContext(link.id);
      // User data update is handled by context refresh usually, but if needed we can trigger parent update
      setDeleteLink(null);
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isClickLimitReached = (link: Link) => {
    if (!link.clickLimit) return false;
    const limit = parseInt(link.clickLimit);
    const clicks = parseInt(link.clicks.replace(/[^0-9]/g, '')) || 0; // Rough parsing if clicks is "1.2k"
    return clicks >= limit;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[200px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <ExternalLink className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Aucun lien pour le moment</h3>
          <p className="text-slate-600 dark:text-gray-400 max-w-sm mb-6">
            Créez votre premier lien intelligent pour commencer à suivre vos visiteurs.
          </p>
          {/* Note: The "Create" button is usually in the parent or sidebar, but we can instruct user */}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un lien..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((link) => (
          <Card key={link.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold truncate" title={link.title}>
                      {link.title}
                    </CardTitle>
                    {link.password && <Lock className="w-3 h-3 text-amber-500" />}
                    {isExpired(link.expirationDate) && <Clock className="w-3 h-3 text-red-500" />}
                  </div>
                  <a 
                    href={link.shortUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 truncate"
                  >
                    {link.shortUrl.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyLink(link.shortUrl)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(link.shortUrl, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visiter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowQRCode(link)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteLink(link)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg truncate mb-4" title={link.url}>
                <span className="font-medium mr-1">Destination:</span> {link.url}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MousePointer2 className="w-4 h-4" />
                  <span className="font-semibold">{link.clicks}</span>
                  <span className="text-gray-400 text-xs">clics</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="w-3 h-3" />
                  {link.date}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleCopyLink(link.shortUrl)}
              >
                <Copy className="w-3 h-3 mr-2" />
                Copier
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                // Usually this would navigate to analytics tab with this link selected
                // For now we just show a toast or implement basic toggle if parent supports it
                onClick={() => {
                  if (onViewAnalytics) {
                    onViewAnalytics(link.id);
                  } else {
                    toast.info("Vue détaillée des analytics à venir");
                  }
                }}
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Stats
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLink} onOpenChange={() => setDeleteLink(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce lien ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteLink?.title}" ? Cette action est irréversible et le lien cessera de fonctionner immédiatement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteLink && handleDeleteLink(deleteLink)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeModal
          isOpen={!!showQRCode}
          onClose={() => setShowQRCode(null)}
          link={showQRCode as any} // Cast if types slightly mismatch, usually compatible
        />
      )}
    </div>
  );
}
