import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { useLinks } from './links-context';
import { 
  Link2,
  Globe,
  Smartphone,
  QrCode,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Crown,
  Sparkles,
  Plus,
  X,
  Search,
  Image as ImageIcon,
  Calendar,
  Lock,
  BarChart3,
  Target,
  Eye
} from 'lucide-react';

interface ModernCreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkCreated: () => void;
  userTier: string;
}

interface LinkData {
  title: string;
  url: string;
  description: string;
  icon: string;
  image_url?: string;
  is_active: boolean;
  style: 'default' | 'card' | 'minimal' | 'rounded' | 'shadow';
  password?: string;
  expires_at?: string;
  ios_url?: string;
  android_url?: string;
  slug?: string;
}

const platformIcons = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
  { id: 'website', name: 'Site Web', icon: Globe, color: 'text-green-500' },
  { id: 'email', name: 'Email', icon: Mail, color: 'text-orange-500' },
  { id: 'phone', name: 'Téléphone', icon: Phone, color: 'text-purple-500' },
  { id: 'link', name: 'Lien', icon: ExternalLink, color: 'text-gray-600' },
];

const linkStyles = [
  { 
    id: 'default', 
    name: 'Standard', 
    description: 'Bouton classique et épuré',
    preview: 'border-2 border-blue-500 bg-blue-50'
  },
  { 
    id: 'card', 
    name: 'Carte', 
    description: 'Style carte avec ombre douce',
    preview: 'shadow-lg bg-white border border-gray-200'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'Design ultra-épuré',
    preview: 'border border-gray-300 bg-gray-50'
  },
  { 
    id: 'rounded', 
    name: 'Arrondi', 
    description: 'Coins très arrondis, moderne',
    preview: 'bg-purple-100 border-2 border-purple-300 rounded-full'
  },
  { 
    id: 'shadow', 
    name: 'Ombre', 
    description: 'Effet d\'ombre prononcé',
    preview: 'shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white'
  }
];

export function ModernCreateLinkModal({ isOpen, onClose, onLinkCreated, userTier }: ModernCreateLinkModalProps) {
  const { addLink } = useLinks();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkData, setLinkData] = useState<LinkData>({
    title: '',
    url: '',
    description: '',
    icon: 'link',
    image_url: '',
    is_active: true,
    style: 'default',
    password: '',
    expires_at: '',
    ios_url: '',
    android_url: '',
    slug: ''
  });

  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [imageSearchResults, setImageSearchResults] = useState<string[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);

  const resetForm = () => {
    setLinkData({
      title: '',
      url: '',
      description: '',
      icon: 'link',
      image_url: '',
      is_active: true,
      style: 'default',
      password: '',
      expires_at: '',
      ios_url: '',
      android_url: '',
      slug: ''
    });
    setStep(1);
    setImageSearchQuery('');
    setImageSearchResults([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const searchImages = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchingImages(true);
    try {
      // Simuler une recherche d'images avec des URLs Unsplash
      const mockResults = [
        `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80`,
        `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80`,
        `https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&q=80`,
        `https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80`,
        `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80`,
        `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80`
      ];
      
      setImageSearchResults(mockResults);
    } catch (error) {
      toast.error('Erreur lors de la recherche d\'images');
    } finally {
      setSearchingImages(false);
    }
  };

  const handleSubmit = async () => {
    if (!linkData.title.trim() || !linkData.url.trim()) {
      toast.error('Veuillez remplir au moins le titre et l\'URL');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addLink({
        title: linkData.title,
        url: linkData.url,
        shortUrl: '', // Generated
        slug: linkData.slug,
        domain: 'openup.to',
        previewImage: linkData.image_url,
        previewTitle: linkData.title,
        previewDescription: linkData.description,
        password: linkData.password,
        expirationDate: linkData.expires_at,
        clickLimit: '', // Not in this modal's UI yet
        geoFilter: '', // Not in this modal's UI yet
        utmTracker: '', // Not in this modal's UI yet
        generateQR: false // Could add a switch for this
      });
      
      onLinkCreated();
      handleClose();
    } catch (error) {
      console.error('Failed to create link:', error);
      // toast.error is handled in addLink
    } finally {
      setIsSubmitting(false);
    }
  };

  const canUseAdvancedFeatures = userTier !== 'free';

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= stepNumber 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div 
              className={`w-12 h-0.5 mx-2 transition-all ${
                step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
              }`} 
            />
          )}
        </div>
      ))}
    </div>
  );

  const StepTitles = ['Informations de base', 'Style et apparence', 'Options avancées'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <span>Créer un nouveau lien</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <StepIndicator />
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{StepTitles[step - 1]}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && "Remplissez les informations principales de votre lien"}
              {step === 2 && "Personnalisez l'apparence de votre lien"}
              {step === 3 && "Configurez les options avancées (optionnel)"}
            </p>
          </div>

          {/* Étape 1: Informations de base */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 font-medium mb-2">
                    <Link2 className="w-4 h-4 text-blue-500" />
                    Titre du lien *
                  </Label>
                  <Input
                    value={linkData.title}
                    onChange={(e) => setLinkData({...linkData, title: e.target.value})}
                    placeholder="Mon super projet"
                    className="h-11"
                  />
                </div>
                
                <div>
                  <Label className="flex items-center gap-2 font-medium mb-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    Icône
                  </Label>
                  <Select value={linkData.icon} onValueChange={(value) => setLinkData({...linkData, icon: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choisir une icône" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformIcons.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${platform.color}`} />
                              {platform.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium mb-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  URL de destination *
                </Label>
                <Input
                  type="url"
                  value={linkData.url}
                  onChange={(e) => setLinkData({...linkData, url: e.target.value})}
                  placeholder="https://monsite.com"
                  className="h-11"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'adresse vers laquelle vos visiteurs seront redirigés
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium mb-2">
                  <Eye className="w-4 h-4 text-orange-500" />
                  Description (optionnel)
                </Label>
                <Textarea
                  value={linkData.description}
                  onChange={(e) => setLinkData({...linkData, description: e.target.value})}
                  placeholder="Une courte description de votre lien..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Étape 2: Style et apparence */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 font-medium mb-3">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Style du bouton
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {linkStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        linkData.style === style.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setLinkData({...linkData, style: style.id as any})}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-8 rounded ${style.preview}`}></div>
                        <div>
                          <div className="font-medium">{style.name}</div>
                          <div className="text-sm text-gray-500">{style.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium mb-3">
                  <ImageIcon className="w-4 h-4 text-purple-500" />
                  Image (optionnel)
                </Label>
                
                {linkData.image_url && (
                  <div className="relative mb-3">
                    <img
                      src={linkData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => setLinkData({ ...linkData, image_url: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <Input
                    placeholder="URL de l'image"
                    value={linkData.image_url || ''}
                    onChange={(e) => setLinkData({ ...linkData, image_url: e.target.value })}
                  />
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Search className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Rechercher une image</span>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <Input
                        placeholder="Rechercher sur Unsplash..."
                        value={imageSearchQuery}
                        onChange={(e) => setImageSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchImages(imageSearchQuery)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => searchImages(imageSearchQuery)}
                        disabled={searchingImages || !imageSearchQuery.trim()}
                      >
                        {searchingImages ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {imageSearchResults.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {imageSearchResults.map((imageUrl, index) => (
                          <button
                            key={index}
                            type="button"
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                            onClick={() => setLinkData({ ...linkData, image_url: imageUrl })}
                          >
                            <img
                              src={imageUrl}
                              alt={`Option ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Options avancées */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-purple-900">Fonctionnalités Premium</h4>
                </div>
                <p className="text-sm text-purple-700">
                  {canUseAdvancedFeatures 
                    ? "Configurez des options avancées pour votre lien"
                    : "Passez au plan Pro pour accéder à ces fonctionnalités"
                  }
                </p>
              </div>

              <div className={`space-y-4 ${!canUseAdvancedFeatures ? 'opacity-50' : ''}`}>
                <div>
                  <Label className="flex items-center gap-2 font-medium mb-2">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    Liens Smart (Deep Links)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="URL iOS (optionnel)"
                      value={linkData.ios_url || ''}
                      onChange={(e) => setLinkData({ ...linkData, ios_url: e.target.value })}
                      disabled={!canUseAdvancedFeatures}
                    />
                    <Input
                      placeholder="URL Android (optionnel)"
                      value={linkData.android_url || ''}
                      onChange={(e) => setLinkData({ ...linkData, android_url: e.target.value })}
                      disabled={!canUseAdvancedFeatures}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium mb-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    Protection par mot de passe
                  </Label>
                  <Input
                    type="password"
                    placeholder="Mot de passe (optionnel)"
                    value={linkData.password || ''}
                    onChange={(e) => setLinkData({ ...linkData, password: e.target.value })}
                    disabled={!canUseAdvancedFeatures}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Date d'expiration
                  </Label>
                  <Input
                    type="datetime-local"
                    value={linkData.expires_at || ''}
                    onChange={(e) => setLinkData({ ...linkData, expires_at: e.target.value })}
                    disabled={!canUseAdvancedFeatures}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                  Précédent
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Annuler
              </Button>
              
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!linkData.title.trim() || !linkData.url.trim())}
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer le lien
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
