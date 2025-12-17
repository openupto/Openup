import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './auth-context';
import { QRCodeGenerator } from './qr-code-generator';
import { toast } from 'sonner@2.0.3';
import { 
  Smartphone, 
  Globe, 
  Lock, 
  Calendar,
  BarChart3,
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
  Video,
  Play,
  Image,
  Search,
  Upload,
  X,
  Crown,
  Zap,
  Link2,
  Target,
  Eye
} from 'lucide-react';
import { unsplash_tool } from '../utils/unsplash';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkCreated: () => void;
  userTier: string;
}

interface LinkData {
  title: string;
  description: string;
  target_urls: {
    web: string;
    ios?: string;
    android?: string;
  };
  custom_slug?: string;
  icon: string;
  image_url?: string;
  password: string;
  expires_at: string;
  click_limit: string;
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  type?: string;
  video_metadata?: {
    thumbnail?: string;
    duration?: string;
    title?: string;
  };
}

export function CreateLinkModal({ isOpen, onClose, onLinkCreated, userTier }: CreateLinkModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [enablePassword, setEnablePassword] = useState(false);
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [enableClickLimit, setEnableClickLimit] = useState(false);
  const [enableUTM, setEnableUTM] = useState(false);
  const [fetchingVideoData, setFetchingVideoData] = useState(false);
  const [searchingImages, setSearchingImages] = useState(false);
  const [imageSearchResults, setImageSearchResults] = useState<string[]>([]);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  
  const [linkData, setLinkData] = useState<LinkData>({
    title: '',
    description: '',
    target_urls: {
      web: '',
      ios: '',
      android: ''
    },
    custom_slug: '',
    icon: 'link',
    image_url: '',
    password: '',
    expires_at: '',
    click_limit: '',
    utm_params: {
      source: '',
      medium: '',
      campaign: ''
    },
    type: 'link',
    video_metadata: {}
  });

  const iconOptions = [
    { value: 'link', label: 'Link', icon: ExternalLink },
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'video', label: 'Video', icon: Video },
  ];

  const linkTypes = [
    { value: 'link', label: 'Standard Link', icon: ExternalLink, description: 'Regular clickable link' },
    { value: 'video', label: 'Video Link', icon: Video, description: 'Featured video with thumbnail preview' }
  ];

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^([^"&?\/\s]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const fetchYouTubeMetadata = async (url: string) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return null;

    setFetchingVideoData(true);
    try {
      // Simulate fetching YouTube metadata (in real app, you'd use YouTube API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fakeMetadata = {
        title: 'My Latest YouTube Video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '12:34'
      };
      
      return fakeMetadata;
    } catch (error) {
      console.error('Failed to fetch video metadata:', error);
      return null;
    } finally {
      setFetchingVideoData(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    setLinkData({ 
      ...linkData, 
      target_urls: { ...linkData.target_urls, web: url }
    });

    // Auto-detect video URLs
    if (extractYouTubeVideoId(url) && linkData.type === 'link') {
      setLinkData(prev => ({ 
        ...prev, 
        type: 'video',
        icon: 'youtube',
        target_urls: { ...prev.target_urls, web: url }
      }));
      
      const metadata = await fetchYouTubeMetadata(url);
      if (metadata) {
        setLinkData(prev => ({ 
          ...prev, 
          title: prev.title || metadata.title,
          video_metadata: metadata
        }));
      }
    }
  };

  const [showQRGenerator, setShowQRGenerator] = useState(false);

  const searchImages = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchingImages(true);
    try {
      // Pour la démo, utilisons des images prédéfinies basées sur la recherche
      const imageCategories: { [key: string]: string[] } = {
        'app': [
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
          'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400',
          'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400'
        ],
        'website': [
          'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
        ],
        'social': [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
          'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=400'
        ],
        'business': [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
        ],
        'portfolio': [
          'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400',
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
          'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400'
        ]
      };
      
      // Recherche simple par mots-clés
      let foundImages: string[] = [];
      const searchLower = query.toLowerCase();
      
      for (const [category, images] of Object.entries(imageCategories)) {
        if (searchLower.includes(category) || category.includes(searchLower)) {
          foundImages = images;
          break;
        }
      }
      
      // Si aucune catégorie trouvée, utiliser des images génériques
      if (foundImages.length === 0) {
        foundImages = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
        ];
      }
      
      setImageSearchResults(foundImages);
    } catch (error) {
      console.error('Error searching images:', error);
      toast.error('Erreur lors de la recherche d\'images');
    } finally {
      setSearchingImages(false);
    }
  };

  const resetForm = () => {
    setLinkData({
      title: '',
      description: '',
      target_urls: {
        web: '',
        ios: '',
        android: ''
      },
      custom_slug: '',
      icon: 'link',
      image_url: '',
      password: '',
      expires_at: '',
      click_limit: '',
      utm_params: {
        source: '',
        medium: '',
        campaign: ''
      },
      type: 'link',
      video_metadata: {}
    });
    setEnablePassword(false);
    setEnableExpiry(false);
    setEnableClickLimit(false);
    setEnableUTM(false);
    setActiveTab('basic');
    setImageSearchResults([]);
    setImageSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!linkData.title.trim() || !linkData.target_urls.web.trim()) {
        toast.error('Title and web URL are required');
        return;
      }

      // Simulate link creation with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Smart link created successfully!');
      resetForm();
      onLinkCreated();
      onClose();
    } catch (error) {
      console.error('Create link error:', error);
      toast.error('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const isFeatureAvailable = (feature: string) => {
    const features = {
      custom_slug: ['starter', 'pro', 'premium'].includes(userTier),
      password: ['starter', 'pro', 'premium'].includes(userTier),
      expiry: ['pro', 'premium'].includes(userTier),
      utm: ['pro', 'premium'].includes(userTier),
      click_limit: ['pro', 'premium'].includes(userTier),
    };
    return features[feature as keyof typeof features] || false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3399ff] to-blue-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
            <span>Créer un Lien Intelligent</span>
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau lien pour votre page. Ajoutez des options de ciblage et des fonctionnalités avancées pour maximiser l'engagement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                {/* Link Type Selector */}
                <div>
                  <Label>Link Type</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {linkTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Card 
                          key={type.value}
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            linkData.type === type.value 
                              ? 'ring-2 ring-[#3399ff] bg-blue-50' 
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setLinkData({ ...linkData, type: type.value, icon: type.value === 'video' ? 'youtube' : 'link' })}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              linkData.type === type.value ? 'bg-[#3399ff] text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{type.label}</div>
                              <div className="text-xs text-slate-500">{type.description}</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Link Title *</Label>
                  <Input
                    id="title"
                    placeholder={linkData.type === 'video' ? 'My latest YouTube video' : 'My awesome app'}
                    value={linkData.title}
                    onChange={(e) => setLinkData({ ...linkData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your link"
                    value={linkData.description}
                    onChange={(e) => setLinkData({ ...linkData, description: e.target.value })}
                  />
                </div>

                {/* Section Image */}
                <div>
                  <Label>Image du lien</Label>
                  <div className="space-y-3">
                    {/* Image preview */}
                    {linkData.image_url && (
                      <div className="relative">
                        <img
                          src={linkData.image_url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setLinkData({ ...linkData, image_url: '' })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Image URL input */}
                    <div>
                      <Input
                        placeholder="URL de l'image (optionnel)"
                        value={linkData.image_url || ''}
                        onChange={(e) => setLinkData({ ...linkData, image_url: e.target.value })}
                      />
                    </div>
                    
                    {/* Image search */}
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center space-x-2 mb-3">
                        <Search className="h-4 w-4 text-slate-500" />
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
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Image results */}
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
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <Image className="h-4 w-4 text-slate-600" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {searchingImages && (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="text-sm text-slate-500 mt-2">Recherche d'images...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="web-url">
                    {linkData.type === 'video' ? 'Video URL *' : 'Web URL *'}
                  </Label>
                  <div className="relative">
                    {linkData.type === 'video' ? (
                      <Youtube className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    ) : (
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    )}
                    <Input
                      id="web-url"
                      placeholder={linkData.type === 'video' ? 'https://youtu.be/... or https://youtube.com/watch?v=...' : 'https://example.com'}
                      className="pl-10"
                      value={linkData.target_urls.web}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      required
                    />
                    {fetchingVideoData && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3399ff]"></div>
                      </div>
                    )}
                  </div>
                  {linkData.type === 'video' && (
                    <p className="text-xs text-slate-500 mt-1">
                      YouTube videos will be displayed with a special preview
                    </p>
                  )}
                </div>

                {/* Video Preview */}
                {linkData.type === 'video' && linkData.video_metadata?.thumbnail && (
                  <Card className="p-4 bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <img 
                          src={linkData.video_metadata.thumbnail} 
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center">
                          <Youtube className="w-4 h-4 text-red-600 mr-1" />
                          Video Preview
                        </div>
                        <div className="text-xs text-slate-500">
                          {linkData.video_metadata.duration && `${linkData.video_metadata.duration} • `}
                          Will appear as featured video link
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {isFeatureAvailable('custom_slug') && (
                  <div>
                    <Label htmlFor="custom-slug">Custom Slug</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        openup.to/
                      </span>
                      <Input
                        id="custom-slug"
                        placeholder="my-link"
                        className="rounded-l-none"
                        value={linkData.custom_slug || ''}
                        onChange={(e) => setLinkData({ ...linkData, custom_slug: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Leave empty to auto-generate
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Targeting Tab */}
            <TabsContent value="targeting" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ios-url">iOS App Store URL</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="ios-url"
                      placeholder="https://apps.apple.com/app/..."
                      className="pl-10"
                      value={linkData.target_urls.ios || ''}
                      onChange={(e) => setLinkData({ 
                        ...linkData, 
                        target_urls: { ...linkData.target_urls, ios: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="android-url">Google Play Store URL</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="android-url"
                      placeholder="https://play.google.com/store/apps/..."
                      className="pl-10"
                      value={linkData.target_urls.android || ''}
                      onChange={(e) => setLinkData({ 
                        ...linkData, 
                        target_urls: { ...linkData.target_urls, android: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Smart Device Detection</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Users will be automatically redirected to the appropriate app store based on their device, 
                          with the web URL as a fallback.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                {/* Password Protection */}
                <Card className={!isFeatureAvailable('password') ? 'relative overflow-hidden border-orange-200 bg-orange-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <CardTitle className="text-base">Protection par Mot de Passe</CardTitle>
                        {!isFeatureAvailable('password') && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            <Crown className="w-3 h-3 mr-1" />
                            {userTier === 'free' ? 'Starter+' : 'Pro+'}
                          </Badge>
                        )}
                      </div>
                      <Switch
                        checked={enablePassword && isFeatureAvailable('password')}
                        onCheckedChange={setEnablePassword}
                        disabled={!isFeatureAvailable('password')}
                      />
                    </div>
                    <CardDescription>
                      {isFeatureAvailable('password') 
                        ? 'Protégez votre lien avec un mot de passe'
                        : 'Disponible avec les plans Starter et supérieurs'
                      }
                    </CardDescription>
                  </CardHeader>
                  {enablePassword && isFeatureAvailable('password') && (
                    <CardContent>
                      <Input
                        placeholder="Entrer le mot de passe"
                        value={linkData.password}
                        onChange={(e) => setLinkData({ ...linkData, password: e.target.value })}
                      />
                    </CardContent>
                  )}
                  {!isFeatureAvailable('password') && userTier === 'free' && (
                    <CardContent>
                      <div className="text-center p-4 text-orange-700">
                        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Protection par mot de passe disponible avec Starter</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Crown className="w-4 h-4 mr-2" />
                          Passer à Starter
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Expiration */}
                <Card className={!isFeatureAvailable('expiry') ? 'relative overflow-hidden border-purple-200 bg-purple-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <CardTitle className="text-base">Expiration du Lien</CardTitle>
                        {!isFeatureAvailable('expiry') && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro+
                          </Badge>
                        )}
                      </div>
                      <Switch
                        checked={enableExpiry && isFeatureAvailable('expiry')}
                        onCheckedChange={setEnableExpiry}
                        disabled={!isFeatureAvailable('expiry')}
                      />
                    </div>
                    <CardDescription>
                      {isFeatureAvailable('expiry') 
                        ? 'Définir une date d\'expiration pour ce lien'
                        : 'Fonctionnalité Pro - Liens temporaires avec expiration automatique'
                      }
                    </CardDescription>
                  </CardHeader>
                  {enableExpiry && isFeatureAvailable('expiry') && (
                    <CardContent>
                      <Input
                        type="datetime-local"
                        value={linkData.expires_at}
                        onChange={(e) => setLinkData({ ...linkData, expires_at: e.target.value })}
                      />
                    </CardContent>
                  )}
                  {!isFeatureAvailable('expiry') && (
                    <CardContent>
                      <div className="text-center p-4 text-purple-700">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Liens temporaires avec expiration automatique</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Crown className="w-4 h-4 mr-2" />
                          Passer à Pro
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Click Limit */}
                {isFeatureAvailable('click_limit') && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <CardTitle className="text-base">Click Limit</CardTitle>
                        </div>
                        <Switch
                          checked={enableClickLimit}
                          onCheckedChange={setEnableClickLimit}
                        />
                      </div>
                      <CardDescription>
                        Limit the number of clicks for this link
                      </CardDescription>
                    </CardHeader>
                    {enableClickLimit && (
                      <CardContent>
                        <Input
                          type="number"
                          placeholder="100"
                          value={linkData.click_limit}
                          onChange={(e) => setLinkData({ ...linkData, click_limit: e.target.value })}
                        />
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* UTM Parameters */}
                <Card className={!isFeatureAvailable('utm') ? 'relative overflow-hidden border-green-200 bg-green-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <CardTitle className="text-base">Paramètres UTM</CardTitle>
                        {!isFeatureAvailable('utm') && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro+
                          </Badge>
                        )}
                      </div>
                      <Switch
                        checked={enableUTM && isFeatureAvailable('utm')}
                        onCheckedChange={setEnableUTM}
                        disabled={!isFeatureAvailable('utm')}
                      />
                    </div>
                    <CardDescription>
                      {isFeatureAvailable('utm') 
                        ? 'Ajoutez des paramètres UTM pour le suivi de campagne'
                        : 'Suivi avancé de campagne avec UTM automatiques'
                      }
                    </CardDescription>
                  </CardHeader>
                  {enableUTM && isFeatureAvailable('utm') && (
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          placeholder="Source UTM"
                          value={linkData.utm_params?.source || ''}
                          onChange={(e) => setLinkData({ 
                            ...linkData, 
                            utm_params: { ...linkData.utm_params, source: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Medium UTM"
                          value={linkData.utm_params?.medium || ''}
                          onChange={(e) => setLinkData({ 
                            ...linkData, 
                            utm_params: { ...linkData.utm_params, medium: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Campagne UTM"
                          value={linkData.utm_params?.campaign || ''}
                          onChange={(e) => setLinkData({ 
                            ...linkData, 
                            utm_params: { ...linkData.utm_params, campaign: e.target.value }
                          })}
                        />
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <strong>Exemple d'URL générée :</strong><br />
                        {linkData.target_urls.web}
                        {(linkData.utm_params?.source || linkData.utm_params?.medium || linkData.utm_params?.campaign) && '?'}
                        {linkData.utm_params?.source && `utm_source=${linkData.utm_params.source}`}
                        {linkData.utm_params?.medium && (linkData.utm_params?.source ? '&' : '') + `utm_medium=${linkData.utm_params.medium}`}
                        {linkData.utm_params?.campaign && (linkData.utm_params?.source || linkData.utm_params?.medium ? '&' : '') + `utm_campaign=${linkData.utm_params.campaign}`}
                      </div>
                    </CardContent>
                  )}
                  {!isFeatureAvailable('utm') && (
                    <CardContent>
                      <div className="text-center p-4 text-green-700">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm mb-2">Suivi de campagne professionnel</p>
                        <div className="text-xs text-green-600 space-y-1">
                          <div>✓ UTM automatiques</div>
                          <div>✓ Pixels de tracking</div>
                          <div>✓ Analytics avancées</div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Crown className="w-4 h-4 mr-2" />
                          Passer à Pro
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t">
            <div className="flex gap-2">
              {linkData.target_urls.web && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowQRGenerator(true)}
                  className="text-xs"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Générer QR Code
                </Button>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-[#3399ff] to-blue-600 hover:from-blue-600 hover:to-[#3399ff]"
              >
                {loading ? 'Création...' : 'Créer le Lien'}
              </Button>
            </div>
          </div>

          {/* QR Code Generator Modal */}
          <QRCodeGenerator
            isOpen={showQRGenerator}
            onClose={() => setShowQRGenerator(false)}
            linkUrl={linkData.target_urls.web}
            linkTitle={linkData.title || 'Mon Lien'}
            userTier={userTier}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}