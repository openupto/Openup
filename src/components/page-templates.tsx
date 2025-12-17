import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CustomLinkIcon } from './custom-icons';
import { 
  Layout, 
  Grid3X3, 
  List, 
  Columns, 
  Layers,
  LayoutGrid,
  Crown,
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
  Youtube
} from 'lucide-react';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'style';
  premium: boolean;
  preview: string;
  features: string[];
}

export interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  type?: 'video' | 'link' | 'social';
  clicks?: number;
}

export interface UserProfile {
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  verified?: boolean;
}

const templates: PageTemplate[] = [
  // Templates de base
  {
    id: 'standard',
    name: 'Standard',
    description: 'Layout classique vertical avec liens centrés',
    category: 'layout',
    premium: false,
    preview: 'vertical-center',
    features: ['Responsive', 'Simple', 'Universel']
  },
  {
    id: 'grid',
    name: 'Grille',
    description: 'Liens organisés en grille 2x2',
    category: 'layout',
    premium: false,
    preview: 'grid-2x2',
    features: ['Responsive', 'Compact', 'Moderne']
  },
  {
    id: 'cards',
    name: 'Cartes',
    description: 'Chaque lien dans une carte individuelle',
    category: 'layout',
    premium: true,
    preview: 'cards-layout',
    features: ['Élégant', 'Espacé', 'Professionnel']
  },
  
  // Nouveaux templates modernes style MrBeast/Créateurs
  {
    id: 'beast-style',
    name: 'Beast Style',
    description: 'Style MrBeast avec cartes visuelles et compteurs',
    category: 'layout',
    premium: true,
    preview: 'beast-style',
    features: ['Viral', 'Visuel', 'Engagement']
  },
  {
    id: 'creator-pro',
    name: 'Creator Pro',
    description: 'Template pour créateurs avec stats et gradients',
    category: 'layout',
    premium: true,
    preview: 'creator-pro',
    features: ['Créateurs', 'Stats', 'Coloré']
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Design influencer avec métriques et hero',
    category: 'layout',
    premium: true,
    preview: 'influencer',
    features: ['Influencer', 'Hero', 'Métriques']
  },
  {
    id: 'brand-hub',
    name: 'Brand Hub',
    description: 'Hub de marque professionnel et spacieux',
    category: 'layout',
    premium: true,
    preview: 'brand-hub',
    features: ['Marque', 'Professionnel', 'Corporate']
  },
  
  // Templates existants
  {
    id: 'masonry',
    name: 'Masonry',
    description: 'Grille dynamique type Pinterest',
    category: 'layout',
    premium: true,
    preview: 'masonry-grid',
    features: ['Dynamique', 'Unique', 'Créatif']
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Profil à gauche, liens à droite',
    category: 'layout',
    premium: true,
    preview: 'sidebar-layout',
    features: ['Desktop optimisé', 'Professionnel', 'Spacieux']
  },
  
  // Templates de style
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Design ultra-épuré sans distractions',
    category: 'style',
    premium: false,
    preview: 'minimal-style',
    features: ['Épuré', 'Focus', 'Rapide']
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Arrière-plans dégradés colorés',
    category: 'style',
    premium: true,
    preview: 'gradient-style',
    features: ['Coloré', 'Moderne', 'Vibrant']
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Effet de verre moderne',
    category: 'style',
    premium: true,
    preview: 'glass-style',
    features: ['Moderne', 'Élégant', 'Transparent']
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Style cyberpunk avec effets néon',
    category: 'style',
    premium: true,
    preview: 'neon-style',
    features: ['Cyberpunk', 'Unique', 'Lumineux']
  }
];

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

interface PageTemplateProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  userTier: string;
  previewData?: {
    profile: UserProfile;
    links: Link[];
  };
}

export function PageTemplateSelector({ selectedTemplate, onTemplateChange, userTier, previewData }: PageTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<'layout' | 'style'>('layout');

  const isFeatureAvailable = (premium: boolean) => {
    return !premium || ['pro', 'premium'].includes(userTier);
  };

  const filteredTemplates = templates.filter(template => template.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Templates de Page</h3>
        <p className="text-sm text-slate-600">
          Choisissez comment vos liens sont organisés et affichés
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        <Button
          variant={activeCategory === 'layout' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('layout')}
          className="flex-1"
        >
          <Layout className="w-4 h-4 mr-2" />
          Mise en page
        </Button>
        <Button
          variant={activeCategory === 'style' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('style')}
          className="flex-1"
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Style
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isAvailable = isFeatureAvailable(template.premium);
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-[#3399ff]' : ''
              } ${!isAvailable ? 'opacity-50' : 'hover:shadow-lg hover:scale-105'}`}
              onClick={() => isAvailable && onTemplateChange(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{template.name}</h4>
                    {template.premium && <Crown className="w-3 h-3 text-yellow-500" />}
                  </div>
                  {isSelected && <Badge variant="default">Actif</Badge>}
                </div>
                
                {/* Template Preview */}
                <div className="mb-3">
                  <TemplatePreview 
                    templateId={template.id} 
                    profile={previewData?.profile} 
                    links={previewData?.links?.slice(0, 4) || []}
                  />
                </div>
                
                <p className="text-xs text-slate-600 mb-2">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                {!isAvailable && (
                  <Badge variant="outline" className="text-xs w-full justify-center">
                    Premium requis
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface TemplatePreviewProps {
  templateId: string;
  profile?: UserProfile;
  links: Link[];
}

function TemplatePreview({ templateId, profile, links }: TemplatePreviewProps) {
  const sampleProfile: UserProfile = {
    username: profile?.username || 'demo',
    display_name: profile?.display_name || 'Demo User',
    bio: profile?.bio || 'Créateur digital',
    verified: profile?.verified || false
  };

  const sampleLinks: Link[] = links.length > 0 ? links : [
    { id: '1', title: 'Mon Portfolio', url: '#', icon: 'website' },
    { id: '2', title: 'LinkedIn', url: '#', icon: 'linkedin' },
    { id: '3', title: 'Contact', url: '#', icon: 'email' },
    { id: '4', title: 'Projet GitHub', url: '#', icon: 'github' }
  ];

  return (
    <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border overflow-hidden">
      <div className="p-2 h-full">
        {templateId === 'standard' && <StandardPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'grid' && <GridPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'cards' && <CardsPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'beast-style' && <BeastStylePreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'creator-pro' && <CreatorProPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'influencer' && <InfluencerPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'brand-hub' && <BrandHubPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'masonry' && <MasonryPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'sidebar' && <SidebarPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'minimal' && <MinimalPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'gradient' && <GradientPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'glass' && <GlassPreview profile={sampleProfile} links={sampleLinks} />}
        {templateId === 'neon' && <NeonPreview profile={sampleProfile} links={sampleLinks} />}
      </div>
    </div>
  );
}

function StandardPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-6 h-6 bg-[#3399ff] rounded-full mb-1"></div>
      <div className="text-[6px] font-medium mb-1">{profile.display_name}</div>
      <div className="space-y-0.5 w-full">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-3 bg-white rounded border text-[4px] flex items-center justify-center">
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function GridPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full">
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 bg-[#3399ff] rounded-full mr-1"></div>
        <div className="text-[5px] font-medium">{profile.display_name}</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {links.slice(0, 4).map((link, index) => (
          <div key={index} className="h-8 bg-white rounded border text-[4px] flex items-center justify-center">
            {link.title.substring(0, 8)}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full">
      <div className="text-center mb-2">
        <div className="w-4 h-4 bg-[#3399ff] rounded-full mx-auto mb-1"></div>
        <div className="text-[5px] font-medium">{profile.display_name}</div>
      </div>
      <div className="space-y-1">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-6 bg-white rounded-lg border shadow-sm p-1">
            <div className="text-[4px] font-medium">{link.title}</div>
            <div className="text-[3px] text-slate-500">{link.description || 'Description'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MasonryPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  const heights = [6, 8, 7, 9];
  return (
    <div className="h-full">
      <div className="text-center mb-2">
        <div className="w-4 h-4 bg-[#3399ff] rounded-full mx-auto mb-1"></div>
        <div className="text-[5px] font-medium">{profile.display_name}</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {links.slice(0, 4).map((link, index) => (
          <div 
            key={index} 
            className="bg-white rounded border text-[4px] flex items-center justify-center"
            style={{ height: `${heights[index] * 4}px` }}
          >
            {link.title.substring(0, 6)}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex h-full gap-2">
      <div className="w-1/3 text-center">
        <div className="w-6 h-6 bg-[#3399ff] rounded-full mx-auto mb-1"></div>
        <div className="text-[4px] font-medium">{profile.display_name}</div>
        <div className="text-[3px] text-slate-500">Bio courte</div>
      </div>
      <div className="w-2/3 space-y-1">
        {links.slice(0, 4).map((link, index) => (
          <div key={index} className="h-4 bg-white rounded border text-[4px] flex items-center px-1">
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function MinimalPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex flex-col items-center h-full bg-white">
      <div className="text-[6px] font-medium mb-2 mt-2">{profile.display_name}</div>
      <div className="space-y-1 w-full px-2">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-3 border-b text-[4px] flex items-center">
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function GradientPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex flex-col items-center h-full bg-gradient-to-br from-purple-400 to-pink-400">
      <div className="w-6 h-6 bg-white rounded-full mb-1 mt-2"></div>
      <div className="text-[6px] font-medium text-white mb-1">{profile.display_name}</div>
      <div className="space-y-0.5 w-full px-2">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-3 bg-white/20 backdrop-blur rounded text-[4px] flex items-center justify-center text-white">
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlassPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex flex-col items-center h-full bg-gradient-to-br from-blue-200 to-purple-200">
      <div className="w-6 h-6 bg-white/30 backdrop-blur rounded-full mb-1 mt-2"></div>
      <div className="text-[6px] font-medium mb-1">{profile.display_name}</div>
      <div className="space-y-0.5 w-full px-2">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-3 bg-white/20 backdrop-blur rounded border border-white/30 text-[4px] flex items-center justify-center">
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function NeonPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="flex flex-col items-center h-full bg-black">
      <div className="w-6 h-6 bg-green-400 rounded-full mb-1 mt-2" style={{ boxShadow: '0 0 10px #00ff88' }}></div>
      <div className="text-[6px] font-medium text-green-400 mb-1">{profile.display_name}</div>
      <div className="space-y-0.5 w-full px-2">
        {links.slice(0, 3).map((link, index) => (
          <div 
            key={index} 
            className="h-3 bg-green-400/10 border border-green-400 rounded text-[4px] flex items-center justify-center text-green-400"
            style={{ boxShadow: '0 0 5px rgba(0, 255, 136, 0.3)' }}
          >
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function BeastStylePreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-blue-500 rounded-b-lg p-1 text-center mb-1">
        <div className="w-4 h-4 bg-white rounded-full mx-auto mb-1"></div>
        <div className="text-[5px] font-medium text-white">{profile.display_name}</div>
      </div>
      <div className="px-1 space-y-1">
        <div className="h-12 bg-white rounded-lg p-1">
          <div className="h-8 bg-red-500 rounded mb-1"></div>
          <div className="text-[3px]">Vidéo YouTube</div>
        </div>
        <div className="h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded text-white p-1">
          <div className="text-[3px]">DONATION • 2.5M</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-6 bg-white rounded text-[3px] flex items-center justify-center">Social</div>
          <div className="h-6 bg-white rounded text-[3px] flex items-center justify-center">Link</div>
        </div>
      </div>
    </div>
  );
}

function CreatorProPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="text-center p-1 mb-1">
        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-1"></div>
        <div className="text-[5px] font-medium">{profile.display_name}</div>
        <div className="flex justify-center space-x-2 text-[3px] mt-1">
          <span>2.5M</span>
          <span>156</span>
          <span>89%</span>
        </div>
      </div>
      <div className="space-y-1 px-1">
        {['purple', 'blue', 'green'].map((color, index) => (
          <div key={index} className={`h-6 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded text-[3px] text-white p-1 flex justify-between`}>
            <span>Link {index + 1}</span>
            <span>{Math.floor(Math.random() * 1000)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfluencerPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full bg-white">
      <div className="h-16 bg-gradient-to-r from-pink-400 to-indigo-600 relative mb-1">
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-white rounded-full border border-white"></div>
        </div>
      </div>
      <div className="px-1 text-center mb-1">
        <div className="text-[5px] font-medium">{profile.display_name}</div>
        <div className="text-[3px] text-gray-600">@{profile.username}</div>
      </div>
      <div className="space-y-1 px-1">
        {links.slice(0, 3).map((link, index) => (
          <div key={index} className="h-6 bg-white border-l-2 border-l-pink-500 p-1 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mr-1"></div>
            <div className="text-[3px]">{link.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandHubPreview({ profile, links }: { profile: UserProfile; links: Link[] }) {
  return (
    <div className="h-full bg-slate-50">
      <div className="bg-white border-b p-1 text-center mb-1">
        <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
        <div className="text-[5px] font-medium">{profile.display_name}</div>
      </div>
      <div className="grid grid-cols-2 gap-1 px-1">
        {links.slice(0, 4).map((link, index) => (
          <div key={index} className="h-14 bg-white rounded-lg p-1 shadow-sm">
            <div className="w-3 h-3 bg-blue-500 rounded mb-1"></div>
            <div className="text-[3px] font-medium">{link.title}</div>
            <div className="text-[2px] text-gray-500">{Math.floor(Math.random() * 1000)} clics</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageTemplateSelector;