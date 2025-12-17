import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Palette, 
  Eye, 
  GripVertical, 
  Plus, 
  Trash2, 
  Link2, 
  Sparkles,
  Gradient,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Save,
  Undo2,
  Redo2,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { FuturisticBackground } from './futuristic-background';
import { DragDropProvider, useDragDrop } from './drag-drop-context';
import { DraggableLinkItem } from './draggable-link-item';
import { SimpleVisualEditor } from './simple-visual-editor';

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
}

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

interface PageDesignerProps {
  userData: any;
  onUpdateUserData: (data: any) => void;
}

const themes = [
  { id: 'minimal', name: 'Minimal', preview: 'bg-white' },
  { id: 'dark', name: 'Dark Mode', preview: 'bg-gray-900' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'neon', name: 'Neon', preview: 'bg-black' },
  { id: 'glass', name: 'Glassmorphism', preview: 'bg-gradient-to-br from-blue-400 to-purple-600' },
  { id: 'cyber', name: 'Cyberpunk', preview: 'bg-gradient-to-r from-purple-900 to-blue-900' }
];

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

function PageDesignerContent({ userData, onUpdateUserData }: PageDesignerProps) {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'demo-user-123',
    username: userData?.name?.toLowerCase().replace(/\s+/g, '') || 'demo',
    display_name: userData?.name || 'Demo User',
    bio: 'Créateur digital passionné. Découvrez mes projets et connectons-nous !',
    avatar_url: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    button_color: '#3399ff',
    button_text_color: '#ffffff',
    theme: 'minimal',
    verified: true
  });

  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: '1',
      title: 'Mon Portfolio',
      url: 'https://monportfolio.com',
      description: 'Découvrez mes projets créatifs',
      icon: 'website',
      image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlfGVufDF8fHx8MTc1Nzc3MTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      is_active: true,
      order_index: 1,
      clicks: 125,
      created_at: '2024-01-15T10:00:00.000Z'
    },
    {
      id: '2',
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/demo',
      description: 'Mon profil professionnel',
      icon: 'linkedin',
      is_active: true,
      order_index: 2,
      clicks: 89,
      created_at: '2024-01-10T09:00:00.000Z'
    },
    {
      id: '3',
      title: 'Ma Chaîne YouTube',
      url: 'https://youtube.com/demo',
      description: 'Mes dernières vidéos',
      icon: 'youtube',
      image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0dWJlJTIwdGh1bWJuYWlsfGVufDF8fHx8MTc1Nzc3MTUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      is_active: true,
      order_index: 3,
      clicks: 67,
      created_at: '2024-01-08T11:00:00.000Z'
    },
    {
      id: '4',
      title: 'Instagram',
      url: 'https://instagram.com/demo',
      description: 'Mes créations visuelles',
      icon: 'instagram',
      is_active: true,
      order_index: 4,
      clicks: 234,
      created_at: '2024-01-05T08:00:00.000Z'
    }
  ]);

  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { draggedItem, setDraggedItem, dragOverItem, setDragOverItem } = useDragDrop();

  const handleDragStart = (linkId: string) => (e: React.DragEvent) => {
    setDraggedItem(linkId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (linkId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(linkId);
  };

  const handleDrop = (targetId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = links.findIndex(link => link.id === draggedItem);
    const targetIndex = links.findIndex(link => link.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...links];
    const [draggedLinkItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLinkItem);

    // Update order indices
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      order_index: index + 1
    }));

    setLinks(updatedLinks);
    setDraggedItem(null);
    setDragOverItem(null);
    setHasUnsavedChanges(true);
    toast.success('Ordre des liens mis à jour!');
  };

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleLinkUpdate = (linkId: string, field: keyof LinkItem, value: any) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, [field]: value } : link
    ));
    setHasUnsavedChanges(true);
  };

  const addNewLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'Nouveau Lien',
      url: 'https://example.com',
      description: 'Description du lien',
      icon: 'link',
      image_url: '',
      is_active: true,
      order_index: links.length + 1,
      clicks: 0,
      created_at: new Date().toISOString()
    };
    setLinks([...links, newLink]);
    setSelectedLink(newLink.id);
    setHasUnsavedChanges(true);
    toast.success('Nouveau lien ajouté!');
  };

  const deleteLink = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId));
    if (selectedLink === linkId) setSelectedLink(null);
    toast.success('Lien supprimé!');
  };

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

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'dark':
        return {
          background: '#0f0f23',
          text: '#ffffff',
          button: '#3399ff',
          buttonText: '#ffffff'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          text: '#ffffff',
          button: 'rgba(255, 255, 255, 0.2)',
          buttonText: '#ffffff'
        };
      case 'neon':
        return {
          background: '#000000',
          text: '#00ff88',
          button: '#ff0080',
          buttonText: '#ffffff'
        };
      case 'glass':
        return {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
          text: '#ffffff',
          button: 'rgba(255, 255, 255, 0.25)',
          buttonText: '#ffffff'
        };
      case 'cyber':
        return {
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a0033 50%, #000066 100%)',
          text: '#00ffff',
          button: '#ff00ff',
          buttonText: '#ffffff'
        };
      default:
        return {
          background: profile.background_color,
          text: profile.text_color,
          button: profile.button_color,
          buttonText: profile.button_text_color
        };
    }
  };

  const themeStyles = getThemeStyles(profile.theme);

  return (
    <div className="h-auto min-h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left Panel - Editor */}
      <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6 overflow-y-auto lg:pr-4">
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Éditeur Futuriste
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs md:text-sm">
            <TabsTrigger value="design" className="text-xs md:text-sm">Design</TabsTrigger>
            <TabsTrigger value="content" className="text-xs md:text-sm">Contenu</TabsTrigger>
            <TabsTrigger value="links" className="text-xs md:text-sm">Liens</TabsTrigger>
            <TabsTrigger value="visual" className="text-xs md:text-sm">Visuel</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Thème & Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Thème</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          profile.theme === theme.id 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleProfileUpdate('theme', theme.id)}
                      >
                        <div className={`w-full h-8 rounded ${theme.preview} mb-1`}></div>
                        <div className="text-xs">{theme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {profile.theme === 'minimal' && (
                  <div className="space-y-3">
                    <div>
                      <Label>Couleur d'arrière-plan</Label>
                      <Input
                        type="color"
                        value={profile.background_color}
                        onChange={(e) => handleProfileUpdate('background_color', e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                    <div>
                      <Label>Couleur du texte</Label>
                      <Input
                        type="color"
                        value={profile.text_color}
                        onChange={(e) => handleProfileUpdate('text_color', e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                    <div>
                      <Label>Couleur des boutons</Label>
                      <Input
                        type="color"
                        value={profile.button_color}
                        onChange={(e) => handleProfileUpdate('button_color', e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nom d'affichage</Label>
                  <Input
                    value={profile.display_name}
                    onChange={(e) => handleProfileUpdate('display_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Nom d'utilisateur</Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => handleProfileUpdate('username', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestion des Liens</CardTitle>
                  <Button onClick={addNewLink} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {links.map((link) => (
                  <DraggableLinkItem
                    key={link.id}
                    link={link}
                    isSelected={selectedLink === link.id}
                    isDragging={draggedItem === link.id}
                    isDragOver={dragOverItem === link.id}
                    onSelect={() => setSelectedLink(selectedLink === link.id ? null : link.id)}
                    onUpdate={(field, value) => handleLinkUpdate(link.id, field, value)}
                    onDelete={() => deleteLink(link.id)}
                    onDragStart={handleDragStart(link.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver(link.id)}
                    onDrop={handleDrop(link.id)}
                  />
                ))}
                
                {links.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Link2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun lien</h3>
                    <p className="text-gray-500 mb-4">Ajoutez votre premier lien pour commencer</p>
                    <Button onClick={addNewLink} className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un lien
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Éditeur Visuel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <SimpleVisualEditor
                    profile={profile}
                    links={links}
                    onLinksUpdate={setLinks}
                    onAddLink={addNewLink}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-full lg:w-1/2 space-y-4 mt-6 lg:mt-0">
        <Card className="border-2 border-dashed border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                Aperçu en Temps Réel
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="text-xs md:text-sm"
                >
                  <Monitor className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="ml-1 hidden sm:inline">Desktop</span>
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="text-xs md:text-sm"
                >
                  <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="ml-1 hidden sm:inline">Mobile</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full max-w-md lg:max-w-none'} relative`}>
          <div 
            className={`min-h-[600px] rounded-2xl border-8 ${
              previewMode === 'mobile' ? 'border-gray-800' : 'border-gray-300'
            } overflow-hidden shadow-2xl relative`}
            style={{
              background: profile.theme === 'gradient' 
                ? themeStyles.background
                : profile.theme === 'glass'
                ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%), ${themeStyles.background}`
                : profile.theme === 'cyber'
                ? themeStyles.background
                : themeStyles.background
            }}
          >
            <FuturisticBackground theme={profile.theme} className="opacity-50" />
            <div className="p-4 md:p-6 text-center relative z-10">
              {/* Profile Header */}
              <div className="mb-6">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-white shadow-lg">
                    <AvatarFallback 
                      className="text-lg"
                      style={{ 
                        background: themeStyles.button,
                        color: themeStyles.buttonText 
                      }}
                    >
                      {getInitials(profile.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  {profile.verified && (
                    <Badge className="absolute -bottom-1 -right-1 bg-blue-500 text-white border-2 border-white">
                      ✓
                    </Badge>
                  )}
                </div>
                
                <h1 
                  className="text-lg md:text-xl mb-2" 
                  style={{ color: themeStyles.text }}
                >
                  {profile.display_name}
                </h1>
                
                <p 
                  className="text-sm mb-3 opacity-90" 
                  style={{ color: themeStyles.text }}
                >
                  @{profile.username}
                </p>
                
                {profile.bio && (
                  <p 
                    className="text-sm leading-relaxed opacity-80 max-w-xs mx-auto" 
                    style={{ color: themeStyles.text }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="space-y-3">
                {links
                  .filter(link => link.is_active)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((link) => {
                    const IconComponent = getIconComponent(link.icon);
                    
                    return (
                      <div
                        key={link.id}
                        className={`
                          p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl border-0 hover-lift
                          ${profile.theme === 'glass' ? 'glass-effect backdrop-blur-md' : ''}
                          ${profile.theme === 'neon' ? 'border border-current animate-neon-glow' : ''}
                          ${profile.theme === 'cyber' ? 'animate-cyber-glow' : ''}
                          ${profile.theme === 'gradient' ? 'animate-glow' : ''}
                        `}
                        style={{
                          background: profile.theme === 'gradient' 
                            ? `linear-gradient(135deg, ${themeStyles.button}, ${profile.text_color})`
                            : profile.theme === 'glass' 
                            ? 'rgba(255, 255, 255, 0.25)'
                            : profile.theme === 'neon'
                            ? 'rgba(0, 255, 136, 0.1)'
                            : profile.theme === 'cyber'
                            ? 'rgba(0, 255, 255, 0.1)'
                            : themeStyles.button,
                          color: themeStyles.buttonText
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <IconComponent className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{link.title}</div>
                              {link.description && (
                                <div className="text-sm opacity-80">{link.description}</div>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-60" />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Footer */}
              <div className="mt-8">
                <div 
                  className="text-xs opacity-50 mb-2" 
                  style={{ color: themeStyles.text }}
                >
                  Created with
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                  style={{ color: themeStyles.text }}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  OpenUp
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-xs md:text-sm">
            <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={() => window.open(`/u/${profile.username}`, '_blank')} className="text-xs md:text-sm">
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Voir la page
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PageDesigner({ userData, onUpdateUserData }: PageDesignerProps) {
  return (
    <DragDropProvider>
      <PageDesignerContent userData={userData} onUpdateUserData={onUpdateUserData} />
    </DragDropProvider>
  );
}