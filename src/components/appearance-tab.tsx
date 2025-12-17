import { useState, useEffect } from 'react';
import { useLinkBio } from './link-bio-context';
import { LinkBioTheme } from '../utils/supabase/api';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Check, Palette, Sparkles, Layout, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// Preset Themes
const PRESET_THEMES: Partial<LinkBioTheme>[] = [
  {
    background_type: 'solid',
    background_value: '#FFFFFF',
    button_style: 'rounded',
    button_color: '#000000',
    button_text_color: '#FFFFFF',
    font_family: 'inter',
    // Minimal (Light)
  },
  {
    background_type: 'solid',
    background_value: '#000000',
    button_style: 'rounded',
    button_color: '#FFFFFF',
    button_text_color: '#000000',
    font_family: 'inter',
    // Dark
  },
  {
    background_type: 'gradient',
    background_value: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    button_style: 'pill',
    button_color: 'rgba(255, 255, 255, 0.2)',
    button_text_color: '#FFFFFF',
    font_family: 'poppins',
    // Neon / Gradient
  },
  {
    background_type: 'image',
    background_value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    button_style: 'shadow',
    button_color: '#FFD700',
    button_text_color: '#000000',
    font_family: 'playfair',
    // Retro / Shadow
  },
  {
    background_type: 'gradient',
    background_value: 'linear-gradient(to bottom right, #2d3436, #000000)',
    button_style: 'pill',
    button_color: 'rgba(255, 255, 255, 0.1)',
    button_text_color: '#FFFFFF',
    font_family: 'dm_sans',
    // Glass (needs manual backdrop-filter in CSS handling if we want real glass, simplified here)
  }
];

export function AppearanceTab() {
  const { page, theme, saveTheme, updatePage } = useLinkBio();
  const [activeTab, setActiveTab] = useState<'profile' | 'presets' | 'custom'>('profile');
  
  // Local state for immediate feedback
  const [localTheme, setLocalTheme] = useState<Partial<LinkBioTheme>>({});
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (theme) setLocalTheme(theme);
    if (page) {
      setFullName(page.title || '');
      setBio(page.bio || '');
      setAvatarUrl(page.avatar_url || '');
    }
  }, [theme, page]);

  const handleApplyPreset = (preset: Partial<LinkBioTheme>) => {
    setLocalTheme({ ...localTheme, ...preset });
    saveTheme(preset);
  };

  const handleUpdateField = (field: keyof LinkBioTheme, value: any) => {
    const updated = { ...localTheme, [field]: value };
    setLocalTheme(updated);
    saveTheme({ [field]: value });
  };

  const handleSaveProfile = async () => {
    await updatePage({ title: fullName, bio, avatar_url: avatarUrl });
    toast.success('Profil mis à jour !');
  };

  if (!theme) return <div>Chargement du thème...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Apparence</h2>
          <p className="text-sm text-gray-500">Personnalisez le design de votre page publique</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="presets">Thèmes</TabsTrigger>
          <TabsTrigger value="custom">Design</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <UserCircle className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Informations du Profil</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL Avatar</Label>
                  <Input 
                    id="avatar"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500">
                    Laissez vide pour utiliser votre photo de profil principale.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom d'affichage (Titre)</Label>
                  <Input 
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre Nom ou Marque"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Une courte description de qui vous êtes..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {bio.length}/150
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRESETS TAB */}
        <TabsContent value="presets" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRESET_THEMES.map((preset, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApplyPreset(preset)}
                className={`
                  cursor-pointer rounded-xl overflow-hidden border-2 transition-all
                  ${localTheme.background_value === preset.background_value 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}
                `}
              >
                {/* Preview Mini */}
                <div 
                  className="h-32 w-full flex items-center justify-center p-4"
                  style={{ 
                    background: preset.background_value 
                  }}
                >
                  <div 
                    className="w-3/4 h-8 flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: preset.button_color,
                      color: preset.button_text_color,
                      borderRadius: preset.button_style === 'pill' ? '999px' : preset.button_style === 'rounded' ? '8px' : '0px',
                      fontFamily: preset.font_family === 'inter' ? 'sans-serif' : 'serif'
                    }}
                  >
                    Thème {idx + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* CUSTOM TAB */}
        <TabsContent value="custom" className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              
              {/* Background */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">Arrière-plan</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={localTheme.background_type} 
                      onValueChange={(v) => handleUpdateField('background_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Couleur unie</SelectItem>
                        <SelectItem value="gradient">Dégradé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Valeur (Hex / CSS)</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-gray-200"
                        style={{ background: localTheme.background_value }}
                      />
                      <Input 
                        value={localTheme.background_value} 
                        onChange={(e) => handleUpdateField('background_value', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              {/* Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">Boutons</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Select 
                      value={localTheme.button_style} 
                      onValueChange={(v) => handleUpdateField('button_style', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">Arrondi</SelectItem>
                        <SelectItem value="pill">Pilule</SelectItem>
                        <SelectItem value="square">Carré</SelectItem>
                        <SelectItem value="shadow">Ombre portée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Police</Label>
                    <Select 
                      value={localTheme.font_family} 
                      onValueChange={(v) => handleUpdateField('font_family', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter (Moderne)</SelectItem>
                        <SelectItem value="poppins">Poppins (Géométrique)</SelectItem>
                        <SelectItem value="dm_sans">DM Sans (Clean)</SelectItem>
                        <SelectItem value="playfair">Playfair (Élégant)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Couleur Bouton</Label>
                    <div className="flex gap-2">
                       <input 
                         type="color" 
                         value={localTheme.button_color?.startsWith('#') ? localTheme.button_color : '#ffffff'}
                         onChange={(e) => handleUpdateField('button_color', e.target.value)}
                         className="h-10 w-10 rounded cursor-pointer"
                       />
                       <Input 
                         value={localTheme.button_color} 
                         onChange={(e) => handleUpdateField('button_color', e.target.value)}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Couleur Texte</Label>
                    <div className="flex gap-2">
                       <input 
                         type="color" 
                         value={localTheme.button_text_color?.startsWith('#') ? localTheme.button_text_color : '#000000'}
                         onChange={(e) => handleUpdateField('button_text_color', e.target.value)}
                         className="h-10 w-10 rounded cursor-pointer"
                       />
                       <Input 
                         value={localTheme.button_text_color} 
                         onChange={(e) => handleUpdateField('button_text_color', e.target.value)}
                       />
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
