import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  QrCode, 
  Plus, 
  Download, 
  Eye, 
  BarChart3, 
  Search,
  Crown,
  Filter,
  MoreVertical,
  Share,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { qrCodesAPI, QRCode } from '../utils/supabase/api';
import { useAuth } from './auth-context';
import { CreateQRWizard } from './create-qr-wizard';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

interface QRCodesPageProps {
  userData: UserData | null;
}

export function QRCodesPage({ userData }: QRCodesPageProps) {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchQRCodes() {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await qrCodesAPI.getUserQRCodes(user.id);
        if (error) {
          toast.error('Erreur lors du chargement des QR codes');
          console.error(error);
        } else {
          setQrCodes(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch QR codes', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQRCodes();
  }, [user, refreshTrigger]);

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce QR code ?')) return;

    try {
      await qrCodesAPI.deleteQRCode(id);
      toast.success('QR Code supprimé');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDownload = (qrCode: QRCode) => {
    if (!qrCode.qr_image_url) {
      toast.error('Image QR non disponible');
      return;
    }
    
    // Create a temporary link to download
    const link = document.createElement('a');
    link.href = qrCode.qr_image_url;
    link.download = `qr-code-${qrCode.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const quickCreateOptions = [
    { title: 'Ma page OpenUp', url: `https://openup.bio/u/${userData?.name || 'me'}` }, // Simplified, ideally use username
    { title: 'Instagram', url: 'https://instagram.com/' },
    { title: 'LinkedIn', url: 'https://linkedin.com/in/' },
    { title: 'Site web', url: 'https://' }
  ];

  if (loading && qrCodes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">QR Codes</h2>
            <p className="text-muted-foreground">Générez et gérez vos QR codes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-6 h-6 text-[#3399ff]" />
            <h2 className="text-2xl font-bold">QR Codes</h2>
          </div>
          <p className="text-muted-foreground">Générez et gérez vos QR codes personnalisés</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateWizard(true)}
          className="bg-gradient-to-r from-[#3399ff] to-blue-600 hover:from-blue-600 hover:to-[#3399ff]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer un QR Code
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher vos QR codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrer
        </Button>
      </div>

      {/* Liste des QR codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQRCodes.map((qrCode) => (
          <Card key={qrCode.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 overflow-hidden">
                  <CardTitle className="text-base truncate" title={qrCode.name}>{qrCode.name}</CardTitle>
                  <CardDescription className="text-sm truncate" title={qrCode.target_url}>{qrCode.target_url}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(qrCode.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Mini QR code preview */}
              <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100 p-4">
                {qrCode.qr_image_url ? (
                  <img 
                    src={qrCode.qr_image_url} 
                    alt={qrCode.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrCode className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <span className="text-xs">Génération en cours...</span>
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="text-xs text-muted-foreground mb-4 flex justify-between">
                <div>Créé le {formatDate(qrCode.created_at)}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => qrCode.qr_image_url && window.open(qrCode.qr_image_url, '_blank')}
                  disabled={!qrCode.qr_image_url}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleDownload(qrCode)}
                  disabled={!qrCode.qr_image_url}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredQRCodes.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun QR code trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Aucun QR code ne correspond à votre recherche' : 'Créez votre premier QR code pour commencer'}
            </p>
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un QR Code
            </Button>
          </div>
        )}
      </div>

      <CreateQRWizard
        isOpen={showCreateWizard}
        onClose={() => {
          setShowCreateWizard(false);
          // If we just created one, we might want to refresh. 
          // Ideally onClose takes a "refresh" param or we pass a separate onSuccess callback.
          // But I updated CreateQRWizard to call onRefresh if passed? No, I didn't.
          // Let's modify CreateQRWizard to accept an onSuccess callback or just rely on refetch next mount if not needed immediately.
          // Actually, I'll pass a refetch to the wizard.
          handleCreateSuccess(); 
        }}
        subscriptionTier={userData?.subscription_tier || 'free'}
      />
    </div>
  );
}
