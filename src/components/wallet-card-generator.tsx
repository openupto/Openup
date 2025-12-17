import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { copyToClipboard } from '../utils/clipboard';
import { 
  Wallet,
  Smartphone,
  Download,
  Apple,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Briefcase,
  Crown,
  QrCode,
  Share2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WalletCardGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  userTier: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  profileUrl: string;
  avatar: string;
  backgroundColor: string;
  textColor: string;
}

export function WalletCardGenerator({ isOpen, onClose, userData, userTier }: WalletCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: userData?.name?.split(' ')[0] || 'John',
    lastName: userData?.name?.split(' ')[1] || 'Doe',
    title: 'Créateur Digital',
    company: 'OpenUp',
    email: userData?.email || 'contact@openup.com',
    phone: '+33 6 12 34 56 78',
    website: `openup.to/${userData?.name?.toLowerCase().replace(/\s+/g, '') || 'demo'}`,
    address: 'Paris, France',
    profileUrl: `https://openup.to/u/${userData?.name?.toLowerCase().replace(/\s+/g, '') || 'demo'}`,
    avatar: '',
    backgroundColor: '#3399ff',
    textColor: '#ffffff'
  });

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.firstName} ${contactInfo.lastName}
N:${contactInfo.lastName};${contactInfo.firstName};;;
ORG:${contactInfo.company}
TITLE:${contactInfo.title}
EMAIL:${contactInfo.email}
TEL:${contactInfo.phone}
URL:${contactInfo.website}
ADR:;;${contactInfo.address};;;;
NOTE:Profile: ${contactInfo.profileUrl}
END:VCARD`;

    return vcard;
  };

  const generateAppleWalletPass = async () => {
    if (userTier === 'free') {
      toast.error('Business Cards disponibles avec les plans payants');
      return;
    }

    setGenerating(true);
    try {
      // Simuler la génération du pass Apple Wallet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer un fichier de démonstration
      const passData = {
        formatVersion: 1,
        passTypeIdentifier: "pass.com.openup.businesscard",
        serialNumber: `openup-${Date.now()}`,
        teamIdentifier: "OPENUP123",
        organizationName: "OpenUp",
        description: "Business Card",
        logoText: contactInfo.company,
        foregroundColor: contactInfo.textColor,
        backgroundColor: contactInfo.backgroundColor,
        generic: {
          primaryFields: [
            {
              key: "name",
              label: "Name",
              value: `${contactInfo.firstName} ${contactInfo.lastName}`
            }
          ],
          secondaryFields: [
            {
              key: "title",
              label: "Title",
              value: contactInfo.title
            },
            {
              key: "company", 
              label: "Company",
              value: contactInfo.company
            }
          ],
          auxiliaryFields: [
            {
              key: "email",
              label: "Email",
              value: contactInfo.email
            },
            {
              key: "phone",
              label: "Phone", 
              value: contactInfo.phone
            }
          ]
        }
      };

      // Créer un blob avec les données du pass
      const blob = new Blob([JSON.stringify(passData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Télécharger le fichier
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contactInfo.firstName}_${contactInfo.lastName}_BusinessCard.pkpass`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Business Card générée ! (Version de démonstration)');
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  const generateGoogleWalletPass = async () => {
    if (userTier === 'free') {
      toast.error('Business Cards disponibles avec les plans payants');
      return;
    }

    setGenerating(true);
    try {
      // Simuler la génération pour Google Wallet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const googlePassData = {
        iss: "openup@example.com",
        aud: "google",
        typ: "savetowallet",
        iat: Date.now(),
        origins: [],
        payload: {
          genericObjects: [
            {
              id: `openup-business-card-${Date.now()}`,
              classId: "openup.businesscard.class",
              state: "ACTIVE",
              hexBackgroundColor: contactInfo.backgroundColor.replace('#', ''),
              cardTitle: {
                defaultValue: {
                  language: "fr",
                  value: `${contactInfo.firstName} ${contactInfo.lastName}`
                }
              },
              subheader: {
                defaultValue: {
                  language: "fr", 
                  value: contactInfo.title
                }
              },
              header: {
                defaultValue: {
                  language: "fr",
                  value: contactInfo.company
                }
              },
              textModulesData: [
                {
                  id: "email",
                  header: "Email",
                  body: contactInfo.email
                },
                {
                  id: "phone", 
                  header: "Téléphone",
                  body: contactInfo.phone
                },
                {
                  id: "website",
                  header: "Site Web",
                  body: contactInfo.website
                }
              ]
            }
          ]
        }
      };

      // Créer un lien de démonstration
      const demoUrl = `https://pay.google.com/gp/v/save/${btoa(JSON.stringify(googlePassData))}`;
      
      toast.success('Lien Google Wallet généré ! (Version de démonstration)');
      copyToClipboard(demoUrl, 'Lien copié dans le presse-papiers');
      
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  const downloadVCard = () => {
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contactInfo.firstName}_${contactInfo.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('vCard téléchargée !');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Business Card Virtuelle
            {userTier === 'free' && (
              <Badge variant="secondary" className="ml-2">
                <Crown className="w-3 h-3 mr-1" />
                Fonctionnalité Premium
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panneau de Configuration */}
          <div className="space-y-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations Personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Prénom *</Label>
                        <Input
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Nom *</Label>
                        <Input
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Poste</Label>
                      <Input
                        value={contactInfo.title}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Entreprise</Label>
                      <Input
                        value={contactInfo.company}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Site Web</Label>
                      <Input
                        value={contactInfo.website}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Adresse</Label>
                      <Textarea
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personnalisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Couleur d'arrière-plan</Label>
                      <Input
                        type="color"
                        value={contactInfo.backgroundColor}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-full h-10"
                      />
                    </div>
                    
                    <div>
                      <Label>Couleur du texte</Label>
                      <Input
                        type="color"
                        value={contactInfo.textColor}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-full h-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Téléchargements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={downloadVCard}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger vCard (.vcf)
                    </Button>
                    
                    <Button 
                      onClick={generateAppleWalletPass}
                      disabled={generating || userTier === 'free'}
                      className="w-full justify-start bg-black hover:bg-gray-800"
                    >
                      <Apple className="w-4 h-4 mr-2" />
                      {generating ? 'Génération...' : 'Ajouter à Apple Wallet'}
                    </Button>
                    
                    <Button 
                      onClick={generateGoogleWalletPass}
                      disabled={generating || userTier === 'free'}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      {generating ? 'Génération...' : 'Ajouter à Google Wallet'}
                    </Button>

                    {userTier === 'free' && (
                      <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <Crown className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                        <p className="text-sm text-amber-700 mb-2">
                          Business Cards digitales disponibles avec les plans payants
                        </p>
                        <Button size="sm" variant="outline">
                          <Crown className="w-4 h-4 mr-2" />
                          Voir les Plans
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panneau de Prévisualisation */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu Business Card</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Aperçu style Apple Wallet */}
                <div className="space-y-4">
                  <div 
                    className="relative rounded-2xl p-6 text-white shadow-2xl min-h-[200px]"
                    style={{ 
                      background: `linear-gradient(135deg, ${contactInfo.backgroundColor}, ${contactInfo.backgroundColor}CC)`,
                      color: contactInfo.textColor
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 border-2 border-white/20">
                          <AvatarFallback 
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: contactInfo.textColor 
                            }}
                          >
                            {getInitials(contactInfo.firstName, contactInfo.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-lg">
                            {contactInfo.firstName} {contactInfo.lastName}
                          </div>
                          <div className="text-sm opacity-90">
                            {contactInfo.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm opacity-90">
                          {contactInfo.company}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 opacity-75" />
                        <span className="opacity-90">{contactInfo.email}</span>
                      </div>
                      {contactInfo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 opacity-75" />
                          <span className="opacity-90">{contactInfo.phone}</span>
                        </div>
                      )}
                      {contactInfo.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 opacity-75" />
                          <span className="opacity-90">{contactInfo.website}</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <QrCode className="w-6 h-6 opacity-60" />
                    </div>
                  </div>

                  {/* Aperçu mobile */}
                  <div className="text-center text-sm text-gray-500">
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    Aperçu sur mobile - Wallet iOS/Android
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fonctionnalités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center text-xs">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Apple className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div>Apple Wallet</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Smartphone className="w-6 h-6 mx-auto mb-1 text-green-600" />
                    <div>Google Wallet</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <QrCode className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div>QR Code</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Share2 className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                    <div>Partage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}