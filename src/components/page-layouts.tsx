import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ModernPageLayout } from './modern-page-layouts';
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
  Share2
} from 'lucide-react';

export interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  type?: 'video' | 'link' | 'social';
  clicks?: number;
  image_url?: string;
  video_metadata?: {
    thumbnail?: string;
    duration?: string;
    title?: string;
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

interface PageLayoutProps {
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

export function PageLayout({ template, profile, links, theme }: PageLayoutProps) {
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

  // Nouveaux templates modernes
  if (['beast-style', 'creator-pro', 'influencer', 'brand-hub'].includes(template)) {
    return <ModernPageLayout template={template} profile={profile} links={links} theme={themeStyles} />;
  }

  switch (template) {
    case 'standard':
      return <StandardLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'grid':
      return <GridLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'cards':
      return <CardsLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'masonry':
      return <MasonryLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    case 'sidebar':
      return <SidebarLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
    default:
      return <StandardLayout profile={profile} links={links} theme={themeStyles} onLinkClick={handleLinkClick} getInitials={getInitials} />;
  }
}

interface LayoutProps {
  profile: UserProfile;
  links: Link[];
  theme: any;
  onLinkClick: (link: Link) => void;
  getInitials: (name: string) => string;
}

function StandardLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors" style={{ background: theme.background }}>
      <div className="w-full max-w-md mx-auto text-center">
        {/* Profile Header */}
        <div className="mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-xl"
              style={{ background: theme.button, color: theme.buttonText }}
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
              {profile.display_name}
            </h1>
            {profile.verified && (
              <Badge className="bg-blue-500 text-white">✓</Badge>
            )}
          </div>
          
          <p className="text-sm opacity-75 mb-3" style={{ color: theme.text }}>
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-sm leading-relaxed opacity-80" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4 mb-8">
          {links.map((link) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            
            if (link.type === 'video' && link.video_metadata) {
              return (
                <div
                  key={link.id}
                  className="group cursor-pointer"
                  onClick={() => onLinkClick(link)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img
                      src={link.video_metadata.thumbnail}
                      alt={link.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    {link.video_metadata.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {link.video_metadata.duration}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-left">
                    <h3 className="font-semibold text-sm leading-tight" style={{ color: theme.text }}>
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-xs opacity-75 mt-1" style={{ color: theme.text }}>
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            // Lien avec image
            if (link.image_url) {
              return (
                <Card
                  key={link.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300 hover:scale-102 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  onClick={() => onLinkClick(link)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="flex items-start space-x-3">
                          <IconComponent 
                            className="w-5 h-5 flex-shrink-0 mt-1" 
                            style={{ color: theme.button }} 
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 text-gray-900 dark:text-white" style={{ color: theme.text }}>
                              {link.title}
                            </h3>
                            {link.description && (
                              <p className="text-sm opacity-75 text-gray-600 dark:text-gray-300" style={{ color: theme.text }}>
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-20 h-20 m-4 rounded-lg overflow-hidden">
                        <img
                          src={link.image_url}
                          alt={link.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Lien standard sans image
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
        <div className="text-center">
          <p className="text-xs opacity-50 mb-2" style={{ color: theme.text }}>
            Créé avec
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 border-white/20 hover:bg-white/20"
            style={{ color: theme.text }}
          >
            OpenUp
          </Button>
        </div>
      </div>
    </div>
  );
}

function GridLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors" style={{ background: theme.background }}>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-lg"
              style={{ background: theme.button, color: theme.buttonText }}
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-xl font-bold" style={{ color: theme.text }}>
              {profile.display_name}
            </h1>
            {profile.verified && (
              <Badge className="bg-blue-500 text-white">✓</Badge>
            )}
          </div>
          
          <p className="text-sm opacity-75" style={{ color: theme.text }}>
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-sm leading-relaxed opacity-80 mt-2" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {links.map((link) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            
            // Card avec image ou icône
            return (
              <Card
                key={link.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-4 text-center">
                  {link.image_url ? (
                    <img
                      src={link.image_url}
                      alt={link.title}
                      className="w-full h-20 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: theme.button }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: theme.buttonText }} />
                    </div>
                  )}
                  <div className="font-medium text-sm mb-1" style={{ color: theme.text }}>
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-xs opacity-75" style={{ color: theme.text }}>
                      {link.description}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs opacity-50 mb-2" style={{ color: theme.text }}>
            Créé avec OpenUp
          </p>
        </div>
      </div>
    </div>
  );
}

function CardsLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen p-4" style={{ background: theme.background }}>
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 text-center p-6">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-xl"
              style={{ background: theme.button, color: theme.buttonText }}
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
              {profile.display_name}
            </h1>
            {profile.verified && (
              <Badge className="bg-blue-500 text-white">✓</Badge>
            )}
          </div>
          
          <p className="text-sm opacity-75 mb-3" style={{ color: theme.text }}>
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-sm leading-relaxed opacity-80" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}
        </Card>

        {/* Links Cards */}
        <div className="space-y-4 mb-8">
          {links.map((link) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            
            return (
              <Card
                key={link.id}
                className="cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200"
                onClick={() => onLinkClick(link)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {link.image_url ? (
                        <img
                          src={link.image_url}
                          alt={link.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ background: theme.button }}
                        >
                          <IconComponent className="w-6 h-6" style={{ color: theme.buttonText }} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold" style={{ color: theme.text }}>
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-sm opacity-75" style={{ color: theme.text }}>
                            {link.description}
                          </p>
                        )}
                        {link.clicks && (
                          <p className="text-xs opacity-50" style={{ color: theme.text }}>
                            {link.clicks} clics
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 opacity-60" style={{ color: theme.text }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs opacity-50 mb-2" style={{ color: theme.text }}>
            Créé avec OpenUp
          </p>
        </div>
      </div>
    </div>
  );
}

function MasonryLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  const heights = ['h-32', 'h-40', 'h-36', 'h-44', 'h-38', 'h-42'];
  
  return (
    <div className="min-h-screen p-4" style={{ background: theme.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback 
              className="text-lg"
              style={{ background: theme.button, color: theme.buttonText }}
            >
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-xl font-bold" style={{ color: theme.text }}>
              {profile.display_name}
            </h1>
            {profile.verified && (
              <Badge className="bg-blue-500 text-white">✓</Badge>
            )}
          </div>
          
          <p className="text-sm opacity-75" style={{ color: theme.text }}>
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-sm leading-relaxed opacity-80 mt-2" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mb-8">
          {links.map((link, index) => {
            const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
            const height = heights[index % heights.length];
            
            return (
              <Card
                key={link.id}
                className={`cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200 mb-4 break-inside-avoid ${height}`}
                onClick={() => onLinkClick(link)}
                style={{ backgroundColor: theme.button }}
              >
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <IconComponent className="w-8 h-8 mb-3" style={{ color: theme.buttonText }} />
                    <h3 className="font-semibold mb-2" style={{ color: theme.buttonText }}>
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm opacity-80" style={{ color: theme.buttonText }}>
                        {link.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-2">
                    <ExternalLink className="w-4 h-4 opacity-60" style={{ color: theme.buttonText }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs opacity-50 mb-2" style={{ color: theme.text }}>
            Créé avec OpenUp
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarLayout({ profile, links, theme, onLinkClick, getInitials }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: theme.background }}>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar Profile */}
        <div className="lg:w-1/3 p-8 lg:sticky lg:top-0 lg:h-screen">
          <div className="text-center lg:text-left">
            <Avatar className="w-32 h-32 mx-auto lg:mx-0 mb-6 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback 
                className="text-2xl"
                style={{ background: theme.button, color: theme.buttonText }}
              >
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
              <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
                {profile.display_name}
              </h1>
              {profile.verified && (
                <Badge className="bg-blue-500 text-white">✓</Badge>
              )}
            </div>
            
            <p className="text-lg opacity-75 mb-4" style={{ color: theme.text }}>
              @{profile.username}
            </p>
            
            {profile.bio && (
              <p className="text-base leading-relaxed opacity-80 mb-6" style={{ color: theme.text }}>
                {profile.bio}
              </p>
            )}

            <div className="flex justify-center lg:justify-start space-x-4">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Suivre
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link) => {
              const IconComponent = iconComponents[link.icon as keyof typeof iconComponents] || CustomLinkIcon;
              
              return (
                <Card
                  key={link.id}
                  className="cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200"
                  onClick={() => onLinkClick(link)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: theme.button }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: theme.buttonText }} />
                      </div>
                      <ExternalLink className="w-5 h-5 opacity-60" style={{ color: theme.text }} />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2" style={{ color: theme.text }}>
                      {link.title}
                    </h3>
                    
                    {link.description && (
                      <p className="text-sm opacity-75 mb-3" style={{ color: theme.text }}>
                        {link.description}
                      </p>
                    )}
                    
                    {link.clicks && (
                      <p className="text-xs opacity-50" style={{ color: theme.text }}>
                        {link.clicks} clics
                      </p>
                    )}
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

export default PageLayout;