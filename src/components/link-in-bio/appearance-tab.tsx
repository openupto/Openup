import { useState, useEffect, useRef } from 'react';
import { Palette, Layout, Type, Image as ImageIcon, Sparkles, Monitor, Smartphone, Check, Grid, UserCircle, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LinkBioTheme, linkBioAPI, LinkBioPage } from '../../utils/supabase/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../auth-context';

interface AppearanceTabProps {
  page: LinkBioPage;
  theme: LinkBioTheme | null;
  onThemeUpdate: (updates: Partial<LinkBioTheme>) => void;
  onPageUpdate: () => void;
}

const PRESETS: Record<string, Partial<LinkBioTheme>> = {
  minimal: {
    background_type: 'solid',
    background_value: '#ffffff',
    text_color: '#000000',
    button_style: 'outline',
    button_color: '#000000',
    button_text_color: '#000000',
    button_radius: 0,
    font_family: 'inter',
    button_shadow: 0
  },
  dark_pro: {
    background_type: 'solid',
    background_value: '#111111',
    text_color: '#ffffff',
    button_style: 'rounded',
    button_color: '#1a1a1a',
    button_text_color: '#ffffff',
    button_radius: 8,
    button_border_color: '#333333',
    font_family: 'inter',
    button_shadow: 0
  },
  ocean_glass: {
    background_type: 'gradient',
    background_value: 'linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%)',
    text_color: '#ffffff',
    button_style: 'glass',
    button_color: '#ffffff',
    button_text_color: '#ffffff',
    button_radius: 16,
    font_family: 'poppins',
    bg_blur: 10
  },
  pink_pop: {
    background_type: 'solid',
    background_value: '#ffecf2',
    text_color: '#d63384',
    button_style: 'shadow',
    button_color: '#ff6b6b',
    button_text_color: '#ffffff',
    button_radius: 12,
    font_family: 'outfit',
    button_shadow: 4
  },
  cyber_neon: {
    background_type: 'solid',
    background_value: '#050505',
    text_color: '#00ff9d',
    button_style: 'neon',
    button_color: '#00ff9d',
    button_text_color: '#00ff9d',
    button_radius: 0,
    font_family: 'satoshi',
    button_shadow: 0
  },
  luxury: {
    background_type: 'solid',
    background_value: '#000000',
    text_color: '#d4af37',
    button_style: 'outline',
    button_color: '#d4af37',
    button_text_color: '#d4af37',
    button_radius: 2,
    font_family: 'playfair',
    button_shadow: 0
  }
};

export function AppearanceTab({ page, theme, onThemeUpdate, onPageUpdate }: AppearanceTabProps) {
  const { user } = useAuth();
  const [localTheme, setLocalTheme] = useState<Partial<LinkBioTheme>>({});
  const [debouncedTimeout, setDebouncedTimeout] = useState<NodeJS.Timeout | null>(null);

  // Profile Image State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(page.profile_image_url || null);

  useEffect(() => {
    if (theme) {
      setLocalTheme(theme);
    }
  }, [theme]);

  // Sync avatarUrl when page changes
  useEffect(() => {
    setAvatarUrl(page.profile_image_url || null);
  }, [page.profile_image_url]);

  const handleChange = (key: keyof LinkBioTheme, value: any) => {
    // Immediate local update
    const newTheme = { ...localTheme, [key]: value };
    setLocalTheme(newTheme);

    // Debounced API call
    if (debouncedTimeout) clearTimeout(debouncedTimeout);
    
    const timeout = setTimeout(async () => {
      onThemeUpdate({ [key]: value });
      await linkBioAPI.updateTheme(page.id, { [key]: value });
    }, 300);

    setDebouncedTimeout(timeout);
  };

  const applyPreset = async (presetName: string) => {
    const preset = PRESETS[presetName];
    if (!preset) return;

    setLocalTheme({ ...localTheme, ...preset });
    onThemeUpdate(preset);
    await linkBioAPI.updateTheme(page.id, preset);
    toast.success(`Thème ${presetName.replace('_', ' ')} appliqué`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return;
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Format non supporté (PNG, JPG, WEBP uniquement)");
      return;
    }

    try {
      setIsUploading(true);
      // Optimistic UI
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);

      // Upload
      const { data, error } = await linkBioAPI.uploadPageAvatar(user.id, page.id, file);
      
      if (error || !data) {
        throw error || new Error("Upload failed");
      }

      // Update Page in DB
      const { error: updateError } = await linkBioAPI.updatePage(page.id, {
        profile_image_url: data.publicUrl
      });

      if (updateError) throw updateError;

      toast.success("Image de profil mise à jour");
      onPageUpdate(); // Refresh parent

    } catch (err) {
      console.error(err);
      toast.error("Upload impossible, réessaie.");
      setAvatarUrl(page.profile_image_url || null); // Rollback
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    try {
      setAvatarUrl(null);
      await linkBioAPI.updatePage(page.id, {
        // @ts-ignore
        profile_image_url: null 
      });
      toast.success("Image supprimée");
      onPageUpdate();
    } catch (e) {
      toast.error("Erreur lors de la suppression");
      setAvatarUrl(page.profile_image_url || null);
    }
  };

  return (
    <div className="space-y-8 p-6 pb-20">
      
       {/* Profile Image Section */}
       <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-500" />
            Image de profil
          </h3>
          <div className="flex items-center gap-6">
             {/* Preview */}
             <div className="shrink-0 relative">
               <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-2xl font-bold text-gray-400">
                     {page.username?.[0]?.toUpperCase()}
                   </span>
                 )}
               </div>
               {isUploading && (
                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 </div>
               )}
             </div>

             {/* Actions */}
             <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                   <Button 
                     onClick={() => fileInputRef.current?.click()}
                     disabled={isUploading}
                     variant="outline"
                   >
                     <Upload className="w-4 h-4 mr-2" />
                     Importer une image
                   </Button>
                   <input 
                     type="file"
                     ref={fileInputRef}
                     className="hidden"
                     accept="image/png, image/jpeg, image/webp"
                     onChange={handleFileSelect}
                   />
                   
                   {avatarUrl && (
                     <Button 
                       variant="destructive" 
                       onClick={handleDeleteAvatar}
                       disabled={isUploading}
                       size="icon"
                       title="Supprimer"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   )}
                </div>
                <p className="text-xs text-gray-500">
                   PNG, JPG, WEBP — max 2MB
                </p>
             </div>
          </div>
       </section>

      {/* Presets Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Thèmes Prédéfinis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([name, style]) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="group relative h-24 rounded-lg border-2 border-transparent hover:border-blue-500 overflow-hidden text-left transition-all"
              style={{
                background: style.background_value,
              }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2 left-2 text-xs font-bold px-2 py-1 rounded bg-white/90 text-black capitalize">
                {name.replace('_', ' ')}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      {/* Background Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Arrière-plan
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={localTheme.background_type || 'solid'} 
              onValueChange={(v) => handleChange('background_type', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Couleur unie</SelectItem>
                <SelectItem value="gradient">Dégradé</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(localTheme.background_type === 'solid' || localTheme.background_type === 'gradient') && (
             <div className="space-y-2">
               <Label>Couleur / Valeur</Label>
               <div className="flex gap-2">
                 <div className="w-10 h-10 rounded border overflow-hidden shrink-0">
                   <input 
                     type="color" 
                     className="w-full h-full p-0 border-0 cursor-pointer"
                     value={localTheme.background_value?.startsWith('#') ? localTheme.background_value : '#000000'}
                     onChange={(e) => handleChange('background_value', e.target.value)}
                   />
                 </div>
                 <Input 
                   value={localTheme.background_value || ''} 
                   onChange={(e) => handleChange('background_value', e.target.value)}
                   placeholder="#000000 ou linear-gradient(...)"
                 />
               </div>
             </div>
          )}
        </div>

        {localTheme.background_type === 'image' && (
          <div className="space-y-3">
             <Label>Image URL</Label>
             <Input 
               value={localTheme.bg_image_url || ''} 
               onChange={(e) => handleChange('bg_image_url', e.target.value)}
               placeholder="https://images.unsplash.com/..."
             />
             <div className="space-y-4 pt-2">
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <Label>Flou (Blur)</Label>
                   <span className="text-xs text-gray-500">{localTheme.bg_blur || 0}px</span>
                 </div>
                 <Slider 
                   value={[localTheme.bg_blur || 0]} 
                   max={20} 
                   step={1}
                   onValueChange={([v]) => handleChange('bg_blur', v)} 
                 />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between">
                    <Label>Opacité du calque noir</Label>
                    <span className="text-xs text-gray-500">{localTheme.bg_overlay_opacity || 0}%</span>
                 </div>
                 <Slider 
                   value={[localTheme.bg_overlay_opacity || 0]} 
                   max={90} 
                   step={5}
                   onValueChange={([v]) => handleChange('bg_overlay_opacity', v)} 
                 />
               </div>
             </div>
          </div>
        )}
      </section>

      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      {/* Buttons Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Layout className="w-5 h-5 text-green-500" />
          Boutons
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <Label>Style</Label>
             <Select 
               value={localTheme.button_style || 'rounded'} 
               onValueChange={(v) => handleChange('button_style', v)}
             >
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="rounded">Arrondi</SelectItem>
                 <SelectItem value="pill">Pilule</SelectItem>
                 <SelectItem value="square">Carré</SelectItem>
                 <SelectItem value="outline">Contour</SelectItem>
                 <SelectItem value="shadow">Rétro Shadow</SelectItem>
                 <SelectItem value="glass">Glassmorphism</SelectItem>
                 <SelectItem value="neon">Néon</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <div className="space-y-2">
             <Label>Arrondi (Radius)</Label>
             <Slider 
               value={[localTheme.button_radius || 0]} 
               max={50} 
               step={1}
               onValueChange={([v]) => handleChange('button_radius', v)} 
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Couleur fond</Label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                className="w-8 h-8 rounded border cursor-pointer"
                value={localTheme.button_color || '#ffffff'}
                onChange={(e) => handleChange('button_color', e.target.value)}
              />
              <span className="text-xs font-mono">{localTheme.button_color}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Couleur texte</Label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                className="w-8 h-8 rounded border cursor-pointer"
                value={localTheme.button_text_color || '#000000'}
                onChange={(e) => handleChange('button_text_color', e.target.value)}
              />
              <span className="text-xs font-mono">{localTheme.button_text_color}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
           <Label>Effet au survol</Label>
           <Select 
             value={localTheme.button_hover_effect || 'none'} 
             onValueChange={(v) => handleChange('button_hover_effect', v)}
           >
             <SelectTrigger><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="none">Aucun</SelectItem>
               <SelectItem value="lift">Soulever</SelectItem>
               <SelectItem value="glow">Lueur</SelectItem>
               <SelectItem value="invert">Inverser</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </section>

      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      {/* Typography & Layout Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Type className="w-5 h-5 text-orange-500" />
          Typographie & Mise en page
        </h3>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label>Police</Label>
             <Select 
               value={localTheme.font_family || 'inter'} 
               onValueChange={(v) => handleChange('font_family', v)}
             >
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="inter">Inter</SelectItem>
                 <SelectItem value="poppins">Poppins</SelectItem>
                 <SelectItem value="dm_sans">DM Sans</SelectItem>
                 <SelectItem value="playfair">Playfair Display</SelectItem>
                 <SelectItem value="satoshi">Satoshi</SelectItem>
                 <SelectItem value="outfit">Outfit</SelectItem>
               </SelectContent>
             </Select>
           </div>
           
           <div className="space-y-2">
             <Label>Couleur Texte Principal</Label>
             <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  className="w-8 h-8 rounded border cursor-pointer"
                  value={localTheme.text_color || '#000000'}
                  onChange={(e) => handleChange('text_color', e.target.value)}
                />
             </div>
           </div>
        </div>
        
        <div className="space-y-2">
           <div className="flex justify-between">
              <Label>Espacement des boutons</Label>
              <span className="text-xs text-gray-500">{localTheme.spacing || 16}px</span>
           </div>
           <Slider 
             value={[localTheme.spacing || 16]} 
             max={40} 
             step={4}
             onValueChange={([v]) => handleChange('spacing', v)} 
           />
        </div>
      </section>

    </div>
  );
}