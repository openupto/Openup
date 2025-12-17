import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import PageTemplateSelector from './page-templates';
import { 
  Palette, 
  Layout, 
  Type, 
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  Crown,
  Monitor,
  Smartphone,
  LayoutTemplate
} from 'lucide-react';

export interface DesignConfig {
  theme: string;
  layout: string;
  template: string;
  colorScheme: {
    background: string;
    text: string;
    accent: string;
    buttonBg: string;
    buttonText: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  spacing: {
    cardSpacing: number;
    borderRadius: number;
  };
  animations: boolean;
  gradient: boolean;
}

interface DesignSystemProps {
  designConfig: DesignConfig;
  onConfigChange: (config: DesignConfig) => void;
  onPreview: () => void;
  userTier: string;
}

const themes = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Design épuré et moderne',
    premium: false,
    preview: {
      background: '#ffffff',
      text: '#000000',
      accent: '#3399ff'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Élégant mode sombre',
    premium: false,
    preview: {
      background: '#1a1a1a',
      text: '#ffffff',
      accent: '#3399ff'
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Arrière-plans dégradés',
    premium: true,
    preview: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff',
      accent: '#ffffff'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Style cyberpunk lumineux',
    premium: true,
    preview: {
      background: '#0a0a0a',
      text: '#00ff88',
      accent: '#ff0080'
    }
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Effet verre moderne',
    premium: true,
    preview: {
      background: 'rgba(255,255,255,0.1)',
      text: '#333333',
      accent: '#3399ff'
    }
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    description: 'Style années 80',
    premium: true,
    preview: {
      background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
      text: '#ffffff',
      accent: '#ffbe0b'
    }
  }
];

const layouts = [
  { id: 'standard', name: 'Standard', description: 'Layout classique', premium: false },
  { id: 'compact', name: 'Compact', description: 'Plus de liens visibles', premium: false },
  { id: 'cards', name: 'Cartes', description: 'Style cartes espacées', premium: true },
  { id: 'masonry', name: 'Masonry', description: 'Grille dynamique', premium: true },
  { id: 'sidebar', name: 'Sidebar', description: 'Navigation latérale', premium: true }
];

const fonts = [
  { id: 'inter', name: 'Inter', description: 'Modern & lisible' },
  { id: 'poppins', name: 'Poppins', description: 'Friendly & accueillant' },
  { id: 'playfair', name: 'Playfair Display', description: 'Élégant & sophistiqué' },
  { id: 'roboto', name: 'Roboto', description: 'Clean & professionnel' },
  { id: 'montserrat', name: 'Montserrat', description: 'Bold & moderne' }
];

export function DesignSystem({ designConfig, onConfigChange, onPreview, userTier }: DesignSystemProps) {
  const [activeTab, setActiveTab] = useState('themes');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const isFeatureAvailable = (premium: boolean) => {
    return !premium || ['pro', 'premium'].includes(userTier);
  };

  const handleThemeSelect = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme || !isFeatureAvailable(theme.premium)) return;

    const newConfig = {
      ...designConfig,
      theme: themeId,
      colorScheme: {
        ...designConfig.colorScheme,
        background: theme.preview.background,
        text: theme.preview.text,
        accent: theme.preview.accent
      }
    };
    onConfigChange(newConfig);
  };

  const handleLayoutSelect = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (!layout || !isFeatureAvailable(layout.premium)) return;

    onConfigChange({
      ...designConfig,
      layout: layoutId
    });
  };

  const handleColorChange = (field: keyof DesignConfig['colorScheme'], value: string) => {
    onConfigChange({
      ...designConfig,
      colorScheme: {
        ...designConfig.colorScheme,
        [field]: value
      }
    });
  };

  const handleTypographyChange = (field: keyof DesignConfig['typography'], value: string | number) => {
    onConfigChange({
      ...designConfig,
      typography: {
        ...designConfig.typography,
        [field]: value
      }
    });
  };

  const handleSpacingChange = (field: keyof DesignConfig['spacing'], value: number) => {
    onConfigChange({
      ...designConfig,
      spacing: {
        ...designConfig.spacing,
        [field]: value
      }
    });
  };

  const resetToDefault = () => {
    const defaultConfig: DesignConfig = {
      theme: 'minimal',
      layout: 'standard',
      template: 'beast-style',
      colorScheme: {
        background: '#ffffff',
        text: '#000000',
        accent: '#3399ff',
        buttonBg: '#3399ff',
        buttonText: '#ffffff'
      },
      typography: {
        fontFamily: 'inter',
        fontSize: 16,
        lineHeight: 1.5
      },
      spacing: {
        cardSpacing: 16,
        borderRadius: 12
      },
      animations: true,
      gradient: false
    };
    onConfigChange(defaultConfig);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Personnalisation du Design</h3>
          <p className="text-sm text-slate-600">
            Créez un design unique pour votre page OpenUp
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
          >
            {previewMode === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="themes">Thèmes</TabsTrigger>
          <TabsTrigger value="layout">Mise en page</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="typography">Typographie</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <PageTemplateSelector
            selectedTemplate={designConfig.template}
            onTemplateChange={(templateId) => onConfigChange({ ...designConfig, template: templateId })}
            userTier={userTier}
            previewData={{
              profile: {
                username: 'demo',
                display_name: 'Demo User',
                bio: 'Créateur digital passionné',
                verified: true
              },
              links: [
                { id: '1', title: 'Mon Portfolio', url: '#', icon: 'website' },
                { id: '2', title: 'LinkedIn', url: '#', icon: 'linkedin' },
                { id: '3', title: 'Contact', url: '#', icon: 'email' },
                { id: '4', title: 'Projet GitHub', url: '#', icon: 'github' }
              ]
            }}
          />
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const isAvailable = isFeatureAvailable(theme.premium);
              const isSelected = designConfig.theme === theme.id;
              
              return (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[#3399ff]' : ''
                  } ${!isAvailable ? 'opacity-50' : 'hover:shadow-lg'}`}
                  onClick={() => isAvailable && handleThemeSelect(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{theme.name}</h4>
                        {theme.premium && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      {isSelected && <Badge variant="default">Actif</Badge>}
                    </div>
                    
                    {/* Theme Preview */}
                    <div 
                      className="h-16 rounded-lg mb-3"
                      style={{ 
                        background: theme.preview.background,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div className="p-3 h-full flex flex-col justify-between">
                        <div 
                          className="text-xs font-medium"
                          style={{ color: theme.preview.text }}
                        >
                          Nom d'utilisateur
                        </div>
                        <div 
                          className="text-xs px-2 py-1 rounded text-center"
                          style={{ 
                            background: theme.preview.accent, 
                            color: theme.id === 'minimal' ? '#ffffff' : theme.preview.text 
                          }}
                        >
                          Mon lien
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600">{theme.description}</p>
                    
                    {!isAvailable && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Premium requis
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layouts.map((layout) => {
              const isAvailable = isFeatureAvailable(layout.premium);
              const isSelected = designConfig.layout === layout.id;
              
              return (
                <Card 
                  key={layout.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[#3399ff]' : ''
                  } ${!isAvailable ? 'opacity-50' : 'hover:shadow-lg'}`}
                  onClick={() => isAvailable && handleLayoutSelect(layout.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{layout.name}</h4>
                        {layout.premium && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      {isSelected && <Badge variant="default">Actif</Badge>}
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3">{layout.description}</p>
                    
                    {!isAvailable && (
                      <Badge variant="secondary" className="text-xs">
                        Premium requis
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Couleurs principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bg-color">Arrière-plan</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={designConfig.colorScheme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={designConfig.colorScheme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="text-color">Texte</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <Input
                      id="text-color"
                      type="color"
                      value={designConfig.colorScheme.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={designConfig.colorScheme.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent-color">Couleur d'accent</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <Input
                      id="accent-color"
                      type="color"
                      value={designConfig.colorScheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={designConfig.colorScheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      placeholder="#3399ff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Boutons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="btn-bg-color">Arrière-plan des boutons</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <Input
                      id="btn-bg-color"
                      type="color"
                      value={designConfig.colorScheme.buttonBg}
                      onChange={(e) => handleColorChange('buttonBg', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={designConfig.colorScheme.buttonBg}
                      onChange={(e) => handleColorChange('buttonBg', e.target.value)}
                      placeholder="#3399ff"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="btn-text-color">Texte des boutons</Label>
                  <div className="flex items-center space-x-3 mt-1">
                    <Input
                      id="btn-text-color"
                      type="color"
                      value={designConfig.colorScheme.buttonText}
                      onChange={(e) => handleColorChange('buttonText', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={designConfig.colorScheme.buttonText}
                      onChange={(e) => handleColorChange('buttonText', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Police de caractères</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={designConfig.typography.fontFamily} 
                  onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font.id} value={font.id}>
                        <div>
                          <div className="font-medium">{font.name}</div>
                          <div className="text-xs text-slate-500">{font.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taille et espacement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Taille de police: {designConfig.typography.fontSize}px</Label>
                  <Slider
                    value={[designConfig.typography.fontSize]}
                    onValueChange={([value]) => handleTypographyChange('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Hauteur de ligne: {designConfig.typography.lineHeight}</Label>
                  <Slider
                    value={[designConfig.typography.lineHeight]}
                    onValueChange={([value]) => handleTypographyChange('lineHeight', value)}
                    min={1}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Espacement des cartes: {designConfig.spacing.cardSpacing}px</Label>
                  <Slider
                    value={[designConfig.spacing.cardSpacing]}
                    onValueChange={([value]) => handleSpacingChange('cardSpacing', value)}
                    min={8}
                    max={32}
                    step={2}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Rayon des bordures: {designConfig.spacing.borderRadius}px</Label>
                  <Slider
                    value={[designConfig.spacing.borderRadius]}
                    onValueChange={([value]) => handleSpacingChange('borderRadius', value)}
                    min={0}
                    max={24}
                    step={2}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Animations</Label>
                  <p className="text-sm text-slate-600">Activer les animations fluides</p>
                </div>
                <Switch
                  checked={designConfig.animations}
                  onCheckedChange={(checked) => onConfigChange({ ...designConfig, animations: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dégradés</Label>
                  <p className="text-sm text-slate-600">Utiliser des dégradés</p>
                </div>
                <Switch
                  checked={designConfig.gradient}
                  onCheckedChange={(checked) => onConfigChange({ ...designConfig, gradient: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}