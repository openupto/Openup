import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
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
  Heart,
  Sparkles,
  QrCode,
  Share2
} from 'lucide-react';

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
  style?: 'default' | 'card' | 'minimal' | 'rounded' | 'shadow';
}

interface ModernPublicPageProps {
  username: string;
}

const iconMap: { [key: string]: any } = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  website: Globe,
  email: Mail,
  phone: Phone,
  location: MapPin,
  link: ExternalLink,
};

const modernThemes = {
  clean: {
    background: '#ffffff',
    text: '#1f2937',
    button: '#3b82f6',
    buttonText: '#ffffff'
  },
  'dark-modern': {
    background: '#0f172a',
    text: '#f8fafc',
    button: '#3b82f6',
    buttonText: '#ffffff'
  },
  warm: {
    background: 'linear-gradient(135deg, #fb923c, #f472b6)',
    text: '#ffffff',
    button: 'rgba(255, 255, 255, 0.9)',
    buttonText: '#1f2937'
  },
  ocean: {
    background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
    text: '#ffffff',
    button: 'rgba(255, 255, 255, 0.9)',
    buttonText: '#1e40af'
  },
  forest: {
    background: 'linear-gradient(135deg, #059669, #34d399)',
    text: '#ffffff',
    button: 'rgba(255, 255, 255, 0.9)',
    buttonText: '#065f46'
  },
  sunset: {
    background: 'linear-gradient(135deg, #9333ea, #ec4899)',
    text: '#ffffff',
    button: 'rgba(255, 255, 255, 0.9)',
    buttonText: '#7c2d12'
  }
};

export function ModernPublicPage({ username }: ModernPublicPageProps) {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'demo-user-123',
    username: username,
    display_name: 'Demo User',
    bio: '🎬 Créateur de contenu • 2M d\'abonnés sur YouTube • Entrepreneur',
    avatar_url: 'https://images.unsplash.com/photo-1615843423179-bea071facf96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjcmVhdG9yJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTkyNDI4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    background_color: '#ffffff',
    text_color: '#1f2937',
    button_color: '#3b82f6',
    button_text_color: '#ffffff',
    theme: 'clean',
    verified: true
  });

  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: '1',
      title: 'Ma Chaîne YouTube Principale',
      url: 'https://youtube.com/@demo',
      description: '🎬 Nouvelles vidéos chaque semaine !',
      icon: 'youtube',
      is_active: true,
      order_index: 1,
      clicks: 2847,
      created_at: '2024-01-15T10:00:00.000Z',
      style: 'card'
    },
    {
      id: '2',
      title: 'Rejoins ma communauté Discord',
      url: 'https://discord.gg/demo',
      description: '💬 Chat en direct avec moi et mes fans',
      icon: 'link',
      is_active: true,
      order_index: 2,
      clicks: 1592,
      created_at: '2024-01-10T09:00:00.000Z',
      style: 'shadow'
    },
    {
      id: '3',
      title: 'Instagram',
      url: 'https://instagram.com/demo',
      description: '📸 Behind the scenes de mes projets',
      icon: 'instagram',
      is_active: true,
      order_index: 3,
      clicks: 1205,
      created_at: '2024-01-08T11:00:00.000Z',
      style: 'default'
    },
    {
      id: '4',
      title: 'Boutique Officielle',
      url: 'https://shop.demo.com',
      description: '🛍️ Merchandising exclusif et limité',
      icon: 'website',
      is_active: true,
      order_index: 4,
      clicks: 845,
      created_at: '2024-01-05T11:00:00.000Z',
      style: 'rounded'
    },
    {
      id: '5',
      title: 'Mon Podcast sur Spotify',
      url: 'https://spotify.com/demo-podcast',
      description: '🎧 Épisodes exclusifs chaque mardi',
      icon: 'link',
      is_active: true,
      order_index: 5,
      clicks: 672,
      created_at: '2024-01-03T11:00:00.000Z',
      style: 'minimal'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState(1247);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Incrémenter les vues de page
    setPageViews(prev => prev + 1);
  }, [username]);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return ExternalLink;
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent || ExternalLink;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedTheme = modernThemes[profile.theme as keyof typeof modernThemes] || modernThemes.clean;

  const handleLinkClick = (link: LinkItem) => {
    // Enregistrer le clic (pour analytics)
    console.log(`Clic sur le lien: ${link.title}`);
    
    // Ouvrir le lien
    window.open(link.url, '_blank');
  };

  const renderLink = (link: LinkItem) => {
    const IconComponent = getIconComponent(link.icon);
    const baseClasses = "w-full p-4 cursor-pointer transition-all duration-300 flex items-center space-x-3 group hover:scale-105 active:scale-95";
    
    let styleClasses = "";
    let hoverEffect = "";
    
    switch (link.style) {
      case 'card':
        styleClasses = "rounded-xl shadow-lg hover:shadow-2xl border border-opacity-20 backdrop-blur-sm";
        hoverEffect = "hover:translate-y-[-2px]";
        break;
      case 'minimal':
        styleClasses = "rounded-lg border-2 border-opacity-30 hover:border-opacity-60 backdrop-blur-sm";
        hoverEffect = "hover:bg-opacity-80";
        break;
      case 'rounded':
        styleClasses = "rounded-full shadow-md hover:shadow-xl px-6";
        hoverEffect = "hover:shadow-2xl";
        break;
      case 'shadow':
        styleClasses = "rounded-xl shadow-2xl hover:shadow-3xl border-0";
        hoverEffect = "hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]";
        break;
      default:
        styleClasses = "rounded-lg shadow-md hover:shadow-xl border border-opacity-10";
        hoverEffect = "hover:translate-y-[-1px]";
    }

    return (
      <button
        key={link.id}
        className={`${baseClasses} ${styleClasses} ${hoverEffect}`}
        style={{
          background: link.style === 'shadow' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : selectedTheme.button,
          color: selectedTheme.buttonText,
          borderColor: selectedTheme.buttonText + '20'
        }}
        onClick={() => handleLinkClick(link)}
      >
        <div className="flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-base">{link.title}</div>
          {link.description && (
            <div className="text-sm opacity-80 mt-1">{link.description}</div>
          )}
        </div>
        <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4" />
        </div>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: selectedTheme.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current" style={{ color: selectedTheme.button }}></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: selectedTheme.background }}
    >
      {/* Background effects pour les thèmes gradients */}
      {profile.theme !== 'clean' && profile.theme !== 'dark-modern' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-2xl">
              <AvatarImage 
                src={profile.avatar_url}
                alt={profile.display_name}
              />
              <AvatarFallback 
                className="text-xl font-semibold"
                style={{ 
                  background: selectedTheme.button,
                  color: selectedTheme.buttonText 
                }}
              >
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            {profile.verified && (
              <Badge className="absolute -bottom-1 -right-1 bg-blue-500 text-white border-4 border-white shadow-lg p-1">
                ✓
              </Badge>
            )}
          </div>
          
          <h1 
            className="text-2xl font-bold mb-2 tracking-tight" 
            style={{ color: selectedTheme.text }}
          >
            {profile.display_name}
          </h1>
          
          <p 
            className="text-lg mb-4 opacity-90 font-medium" 
            style={{ color: selectedTheme.text }}
          >
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p 
              className="text-base leading-relaxed opacity-80 max-w-sm mx-auto" 
              style={{ color: selectedTheme.text }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4 mb-8">
          {links
            .filter(link => link.is_active)
            .sort((a, b) => a.order_index - b.order_index)
            .map(renderLink)}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mb-8">
          <button
            className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: selectedTheme.button + '20',
              color: selectedTheme.text 
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          <button
            className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: selectedTheme.button + '20',
              color: selectedTheme.text 
            }}
          >
            <QrCode className="w-5 h-5" />
          </button>
          
          <button
            className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: selectedTheme.button + '20',
              color: selectedTheme.text 
            }}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div 
            className="text-sm opacity-50 mb-3" 
            style={{ color: selectedTheme.text }}
          >
            {pageViews.toLocaleString()} vues • Créé avec
          </div>
          <button 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ 
              background: selectedTheme.button + '20',
              color: selectedTheme.text,
              border: `1px solid ${selectedTheme.text}20`
            }}
            onClick={() => window.open('/', '_blank')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            OpenUp
          </button>
        </div>
      </div>
    </div>
  );
}