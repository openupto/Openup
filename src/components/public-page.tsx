import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { VideoLinkCard } from './video-link-card';
import { PageLayout } from './page-layouts';
import { ThemeToggleCompact } from './theme-toggle';
import { 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  Link2,
  Settings,
  Layout,
  Grid3X3,
  Layers,
  Columns,
  LayoutGrid,
  Video,
  Users,
  Heart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  theme: string;
  template?: string;
  verified: boolean;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
  clicks: number;
  created_at: string;
  type?: string;
  video_metadata?: {
    thumbnail?: string;
    duration?: string;
    title?: string;
    views?: string;
  };
  featured_metadata?: {
    image?: string;
    counter?: string;
    counter_label?: string;
    subtitle?: string;
    cta?: string;
  };
  donation_metadata?: {
    goal?: string;
    raised?: string;
    image?: string;
    organization?: string;
  };
  product_metadata?: {
    image?: string;
    price?: string;
    badge?: string;
  };
}

interface PublicPageProps {
  username: string;
}

export function PublicPage({ username }: PublicPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('standard');

  useEffect(() => {
    // Récupérer le template depuis l'URL si spécifié
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template') || 'beast-style';
    setCurrentTemplate(templateParam);
    // Use fake data instead of API call
    const fakeProfile: UserProfile = {
      id: 'demo-user-123',
      username: 'demo',
      display_name: 'Utilisateur Demo',
      bio: 'Créateur digital passionné. Découvrez mes projets et connectons-nous !',
      avatar_url: '',
      background_color: '#ffffff',
      text_color: '#1f2937',
      button_color: '#3399ff',
      button_text_color: '#ffffff',
      theme: 'minimal',
      template: currentTemplate,
      verified: true
    };

    const fakeLinks: LinkItem[] = [
      {
        id: '1',
        title: 'Ma dernière vidéo YouTube',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        description: 'Abonnez-vous pour plus de contenu !',
        icon: 'youtube',
        is_active: true,
        order_index: 1,
        clicks: 2547,
        created_at: '2024-01-15T10:00:00.000Z',
        type: 'video',
        video_metadata: {
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '12:34',
          title: 'Ma dernière vidéo YouTube',
          views: '2.5M vues'
        }
      },
      {
        id: '1b',
        title: 'DONATION POUR L\'EAU POTABLE',
        url: 'https://teamwater.org',
        description: '1€ = 1 an d\'eau potable pour une personne dans le besoin !',
        icon: 'water-drop',
        is_active: true,
        order_index: 1.5,
        clicks: 15478,
        created_at: '2024-01-14T10:00:00.000Z',
        type: 'donation',
        donation_metadata: {
          goal: '40M€',
          raised: '2,574,056',
          organization: '#TEAMWATER',
          image: 'https://images.unsplash.com/photo-1543180920-667698c042cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY2hpbGRyZW4lMjBhZnJpY2F8ZW58MXx8fHwxNzU3NzcwOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      },
      {
        id: '2',
        title: 'Mon Portfolio',
        url: 'https://monportfolio.com',
        description: 'Découvrez mes projets créatifs',
        icon: 'website',
        is_active: true,
        order_index: 2,
        clicks: 1834,
        created_at: '2024-01-10T09:00:00.000Z',
        type: 'featured',
        featured_metadata: {
          counter: '156',
          counter_label: 'projets',
          subtitle: 'Créations digitales',
          image: 'https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMGRlc2lnbnxlbnwxfHx8fDE3NTc2OTcwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      },
      {
        id: '3',
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/demo',
        description: 'Réseau professionnel',
        icon: 'linkedin',
        is_active: true,
        order_index: 3,
        clicks: 1245,
        created_at: '2024-01-08T11:00:00.000Z',
        type: 'social'
      },
      {
        id: '4',
        title: 'Code GitHub',
        url: 'https://github.com/demo',
        description: 'Mes projets open source',
        icon: 'github',
        is_active: true,
        order_index: 4,
        clicks: 892,
        created_at: '2024-01-05T14:00:00.000Z'
      },
      {
        id: '5',
        title: 'Contact Email',
        url: 'mailto:demo@openup.com',
        description: 'Écrivez-moi directement',
        icon: 'email',
        is_active: true,
        order_index: 5,
        clicks: 567,
        created_at: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '6',
        title: 'Instagram',
        url: 'https://instagram.com/demo',
        description: 'Photos quotidiennes',
        icon: 'instagram',
        is_active: true,
        order_index: 6,
        clicks: 789,
        created_at: '2023-12-28T12:00:00.000Z',
        type: 'social'
      },
      {
        id: '7',
        title: 'TikTok',
        url: 'https://tiktok.com/@demo',
        description: 'Contenu viral',
        icon: 'video',
        is_active: true,
        order_index: 7,
        clicks: 456,
        created_at: '2023-12-25T10:00:00.000Z',
        type: 'social'
      },
      {
        id: '9',
        title: 'Feastables',
        url: 'https://feastables.com',
        description: 'COMMANDEZ MAINTENANT !!!',
        icon: 'website',
        is_active: true,
        order_index: 9,
        clicks: 1892,
        created_at: '2023-12-15T10:00:00.000Z',
        type: 'featured',
        featured_metadata: {
          counter: '#1',
          counter_label: 'chocolat',
          subtitle: 'Meilleur goût au monde',
          image: 'https://images.unsplash.com/photo-1732304718527-4af155ca1948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBiYXIlMjBwcmVtaXVtfGVufDF8fHx8MTc1Nzc3MDkzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      },
      {
        id: '8',
        title: 'Mon Blog',
        url: 'https://blog.demo.com',
        description: 'Articles et réflexions',
        icon: 'website',
        is_active: true,
        order_index: 8,
        clicks: 321,
        created_at: '2023-12-20T15:30:00.000Z'
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setProfile(fakeProfile);
      setLinks(fakeLinks.filter(link => link.is_active).sort((a, b) => a.order_index - b.order_index));
      setLoading(false);
    }, 500);
  }, [username]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3399ff] mx-auto"></div>
          <p className="text-slate-600 dark:text-gray-400">Chargement de la page...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <ExternalLink className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Page introuvable</h1>
          <p className="text-slate-600 dark:text-gray-400">
            {error || `La page @${username} n'existe pas ou n'est pas disponible.`}
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-[#3399ff] to-blue-600"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Préparer les données pour le nouveau système de layout
  const themeStyles = {
    background: profile.theme === 'gradient' 
      ? `linear-gradient(135deg, ${profile.background_color}, ${profile.button_color})`
      : profile.background_color,
    text: profile.text_color,
    button: profile.button_color,
    buttonText: profile.button_text_color
  };

  const formattedLinks = links.map(link => ({
    id: link.id,
    title: link.title,
    description: link.description,
    url: link.url,
    icon: link.icon,
    type: link.type,
    clicks: link.clicks,
    video_metadata: link.video_metadata
  }));

  const handleTemplateChange = (template: string) => {
    setCurrentTemplate(template);
    setProfile(prev => prev ? { ...prev, template } : null);
    
    // Mettre à jour l'URL
    const url = new URL(window.location.href);
    url.searchParams.set('template', template);
    window.history.replaceState({}, '', url.toString());
  };

  const templates = [
    { id: 'standard', name: 'Standard', icon: Layout, description: 'Layout vertical classique' },
    { id: 'beast-style', name: 'Beast Style', icon: Video, description: 'Style MrBeast viral' },
    { id: 'creator-pro', name: 'Creator Pro', icon: Users, description: 'Pro créateurs avec stats' },
    { id: 'influencer', name: 'Influencer', icon: Heart, description: 'Design influencer moderne' },
    { id: 'brand-hub', name: 'Brand Hub', icon: Globe, description: 'Hub de marque corporate' },
    { id: 'grid', name: 'Grille', icon: Grid3X3, description: 'Grille 2x2 compacte' },
    { id: 'cards', name: 'Cartes', icon: Layers, description: 'Design en cartes élégant' },
    { id: 'masonry', name: 'Masonry', icon: LayoutGrid, description: 'Grille dynamique' },
    { id: 'sidebar', name: 'Sidebar', icon: Columns, description: 'Layout avec sidebar' }
  ];

  return (
    <div className="relative">
      <PageLayout
        template={currentTemplate}
        profile={{
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          verified: profile.verified,
          theme: profile.theme,
          background_color: profile.background_color,
          text_color: profile.text_color,
          button_color: profile.button_color,
          button_text_color: profile.button_text_color
        }}
        links={formattedLinks}
        theme={themeStyles}
      />
      
      {/* Template Selector & Theme Toggle - Mode Demo */}
      <div className="fixed bottom-4 right-4 z-50">
        {showTemplateSelector && (
          <Card className="mb-4 p-3 w-64 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <h4 className="font-semibold mb-3 text-sm">Tester les Templates</h4>
            <div className="space-y-2">
              {templates.map(template => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`w-full p-2 text-left rounded-lg border transition-all ${
                      currentTemplate === template.id 
                        ? 'bg-[#3399ff] text-white border-[#3399ff]' 
                        : 'bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 border-slate-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-xs">{template.name}</div>
                        <div className={`text-xs opacity-75 ${
                          currentTemplate === template.id ? 'text-white' : 'text-slate-600 dark:text-gray-400'
                        }`}>
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}
        
        <div className="flex flex-col gap-2">
          <ThemeToggleCompact className="w-12 h-12 rounded-full shadow-lg" />
          <Button
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="w-12 h-12 rounded-full bg-[#3399ff] hover:bg-blue-600 shadow-lg"
            size="sm"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}