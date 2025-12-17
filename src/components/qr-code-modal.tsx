import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Download, Copy, ExternalLink, QrCode } from 'lucide-react';
import { Link } from './links-context';
import { copyToClipboard } from '../utils/clipboard';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: Link | null;
}

export function QRCodeModal({ isOpen, onClose, link }: QRCodeModalProps) {
  if (!link) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link.shortUrl + '?utm_source=qr')}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${link.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-500" />
            QR Code
          </DialogTitle>
          <DialogDescription>
            QR Code pour <span className="font-medium text-foreground">{link.title}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <img 
              src={qrUrl} 
              alt={`QR Code for ${link.title}`}
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {link.shortUrl.replace(/^https?:\/\//, '')}
            </p>
            <p className="text-xs text-gray-500">
              Scannez pour visiter le lien
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(link.shortUrl, 'Lien copié !')}>
              <Copy className="w-4 h-4 mr-2" />
              Copier lien
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
