import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CustomLinkIcon } from './custom-link-icon';
import { 
  ExternalLink,
  Video,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  Share2,
  Play,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  Download
} from 'lucide-react';

export interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  type?: 'video' | 'link' | 'social' | 'featured' | 'donation' | 'product';
  clicks?: number;
  image_url?: string;
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

export interface UserProfile {
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  verified?: boolean;
  theme?: string;
  background_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
}

const iconComponents = {
  video: Video,
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  link: CustomLinkIcon,
};

interface ModernLayoutProps {
  template: string;
  profile: UserProfile;
  links: Link[];
  theme?: {
    background: string;
    text: string;
    button: string;
    buttonText: string;
  };
}

export function ModernPageLayout({ template, profile, links, theme }: ModernLayoutProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLinkClick = (link: Link) => {
    // Track click and redirect
    window.open(link.url, '_blank');
  };

  const themeStyles = theme || {
    background: profile.background_color || '#ffffff',
    text: profile.text_color || '#1f2937',
    button: profile.button_color || '#3399ff',
    buttonText: profile.button_text_color || '#ffffff'
  };

  switch (template) {
    case 'beast-style':
      return <BeastStyleLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'creator-pro':
      return <CreatorProLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'influencer':
      return <InfluencerLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'brand-hub':
      return <BrandHubLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    default:
      return <BeastStyleLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
  }
}

interface LayoutProps {
  profile: UserProfile;
  links: Link[];
  theme: any;
  onLinkClick: (link: Link) => void;
  getInitials: (name: string) => string;
}

// Beast-style layout (inspired by MrBeast's design)
function BeastStyleLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  const featuredLinks = links.filter(link => link.type === 'featured' || link.type === 'video' || link.type === 'donation');
  const socialLinks = links.filter(link => link.type === 'social' || (!link.type && link.icon && ['twitter', 'instagram', 'youtube', 'linkedin', 'github'].includes(link.icon)));
  const otherLinks = links.filter(link => !featuredLinks.includes(link) && !socialLinks.includes(link));

  return (
    <div className="min-h-screen" style={{ background: theme.background }}>
      {/* Header coloré */}
      <div 
        className="relative pt-8 pb-6 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${theme.button}, ${theme.button}dd)`,
          borderRadius: '0 0 24px 24px'
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-xl">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-xl bg-white"
              style={{ color: theme.button }}
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold text-white">
              {profile.display_name}
            </h1>
            {profile.verified && (
              <Badge className="bg-white text-blue-600">✓</Badge>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-white/90 text-sm max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Featured Content */}
        {featuredLinks.map((link) => {
          if (link.type === 'video' && link.video_metadata) {
            return (
              <Card 
                key={link.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102"
                onClick={() => onLinkClick(link)}
              >
                <div className="relative">
                  <img
                    src={link.video_metadata.thumbnail}
                    alt={link.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  {link.video_metadata.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {link.video_metadata.duration}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Youtube className="w-3 h-3 mr-1" />
                    {link.video_metadata.views || 'Nouveau'}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm leading-tight mb-2" style={{ color: theme.text }}>
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-xs opacity-75" style={{ color: theme.text }}>
                      {link.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          }

          if (link.type === 'donation' && link.donation_metadata) {
            return (
              <Card 
                key={link.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-0">
                  <div 
                    className="p-4 text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, #0ea5e9, #3b82f6)` }}
                  >
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2">{link.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{link.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{link.donation_metadata.raised || '2,574,056'}</div>
                          <div className="text-xs opacity-80">personnes aidées</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-90">Objectif: {link.donation_metadata.goal || '40M$'}</div>
                          <div className="w-24 h-2 bg-white/20 rounded-full mt-1">
                            <div className="w-1/3 h-full bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {link.donation_metadata.image && (
                      <div 
                        className="absolute -right-8 -top-8 w-32 h-32 opacity-20"
                        style={{
                          backgroundImage: `url(${link.donation_metadata.image})`,
                          backgroundSize: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center">
                    <div className="font-bold">#TEAMWATER</div>
                  </div>
                </CardContent>
              </Card>
            );
          }

          if (link.type === 'featured' && link.featured_metadata) {
            return (
              <Card 
                key={link.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold mb-2" style={{ color: theme.text }}>
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="text-sm opacity-75 mb-3" style={{ color: theme.text }}>
                          {link.description}
                        </p>
                      )}
                      {link.featured_metadata.counter && (
                        <div className="text-lg font-bold" style={{ color: theme.button }}>
                          {link.featured_metadata.counter}
                          {link.featured_metadata.counter_label && (
                            <span className="text-xs ml-1 opacity-75">
                              {link.featured_metadata.counter_label}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {link.featured_metadata.image && (
                      <div className="w-20 h-20 m-4 rounded-lg overflow-hidden">
                        <img
                          src={link.featured_metadata.image}
                          alt={link.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          }

          return null;
        })}

        {/* Social Links Grid */}
        {socialLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((link) => {
              const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
              
              return (
                <Card
                  key={link.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => onLinkClick(link)}
                >
                  <CardContent className="p-4 text-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{ background: theme.button }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: theme.buttonText }} />
                    </div>
                    <div className="font-medium text-sm" style={{ color: theme.text }}>
                      {link.title}
                    </div>
                    {link.description && (
                      <div className="text-xs opacity-75 mt-1" style={{ color: theme.text }}>
                        {link.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Other Links */}
        {otherLinks.map((link) => {
          const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
          
          return (
            <Button
              key={link.id}
              className="w-full h-auto p-4 rounded-xl hover:scale-105 transition-all duration-200"
              style={{ 
                background: theme.button, 
                color: theme.buttonText 
              }}
              onClick={() => onLinkClick(link)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    {link.description && (
                      <div className="text-sm opacity-80">{link.description}</div>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </div>
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-xs opacity-50 mb-3" style={{ color: theme.text }}>
          Créé avec
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black text-white border-black hover:bg-gray-800 rounded-full px-6"
        >
          OpenUp
        </Button>
      </div>
    </div>
  );
}

// Creator Pro Layout
function CreatorProLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Profile Header with Stats */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-xl">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {profile.display_name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-4 max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 dark:text-white">2.5M</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 dark:text-white">156</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 dark:text-white">89%</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Engagement</div>
            </div>
          </div>
        </div>

        {/* Links avec style créateur */}
        <div className="space-y-4">
          {links.map((link, index) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            const gradients = [
              'from-purple-500 to-pink-500',
              'from-blue-500 to-cyan-500',
              'from-green-500 to-teal-500',
              'from-orange-500 to-red-500',
              'from-indigo-500 to-purple-500'
            ];
            
            return (
              <Card
                key={link.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${gradients[index % gradients.length]} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-6 h-6" />
                        <div>
                          <div className="font-semibold">{link.title}</div>
                          {link.description && (
                            <div className="text-sm opacity-90">{link.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{link.clicks || Math.floor(Math.random() * 1000)}</div>
                        <div className="text-xs opacity-80">clics</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Influencer Layout
function InfluencerLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <Avatar className="w-20 h-20 mb-4 border-4 border-white shadow-xl">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-xl font-bold mb-1">{profile.display_name}</h1>
            <p className="text-sm opacity-90">@{profile.username}</p>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          {profile.bio && (
            <Card>
              <CardContent className="p-4 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Links avec design influencer */}
          {links.map((link) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            
            return (
              <Card
                key={link.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102 border-l-4 border-l-pink-500"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{link.title}</h3>
                        {link.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">{link.description}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Eye className="w-3 h-3 mr-1" />
                            {link.clicks || Math.floor(Math.random() * 10000)} vues
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{Math.floor(Math.random() * 50)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Brand Hub Layout
function BrandHubLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Brand Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-8 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-slate-200">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback 
                className="text-xl"
                style={{ background: theme.button, color: theme.buttonText }}
              >
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
              {profile.display_name}
            </h1>
            
            {profile.bio && (
              <p className="text-slate-600 max-w-md mx-auto">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Brand Links Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link) => {
              const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
              
              return (
                <Card
                  key={link.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => onLinkClick(link)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: theme.button }}
                      >
                        <IconComponent className="w-7 h-7" style={{ color: theme.buttonText }} />
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2" style={{ color: theme.text }}>
                      {link.title}
                    </h3>
                    
                    {link.description && (
                      <p className="text-slate-600 text-sm mb-4">
                        {link.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{link.clicks || Math.floor(Math.random() * 5000)} clics</span>
                      <span className="text-green-600">+{Math.floor(Math.random() * 30)}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernPageLayout;