import { useState, useEffect, useCallback } from 'react';
import { LinkBioTheme } from '../../utils/supabase/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Palette, Type, Layout, Share2, Smartphone, Save, Undo, Wand2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AppearanceEditorProps {
  theme: LinkBioTheme;
  updateTheme: (updates: Partial<LinkBioTheme>) => Promise<void>;
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const PRESETS: Partial<LinkBioTheme>[] = [
  {
    background_type: 'solid',
    background_value: '#ffffff',
    text_color: '#000000',
    button_style: 'outline',
    button_color: '#000000',
    button_text_color: '#000000',
    font_family: 'inter',
    display_name: 'Minimal White'
  },
  {
    background_type: 'solid',
    background_value: '#000000',
    text_color: '#ffffff',
    button_style: 'solid',
    button_color: '#ffffff',
    button_text_color: '#000000',
    button_radius: 8,
    font_family: 'inter',
    display_name: 'Dark Pro'
  },
  {
    background_type: 'gradient',
    background_value: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    text_color: '#ffffff',
    button_style: 'glass',
    button_color: '#ffffff',
    button_text_color: '#ffffff',
    button_radius: 12,
    font_family: 'dm_sans',
    display_name: 'Ocean Glass'
  },
  {
    background_type: 'gradient',
    background_value: 'linear-gradient(to right, #ec4899, #f43f5e)',
    text_color: '#ffffff',
    button_style: 'pill',
    button_color: '#ffffff',
    button_text_color: '#ec4899',
    font_family: 'poppins',
    display_name: 'Pink Pop'
  },
  {
    background_type: 'solid',
    background_value: '#0f172a',
    text_color: '#00ff9d',
    button_style: 'neon',
    button_color: '#00ff9d',
    button_text_color: '#00ff9d',
    font_family: 'outfit',
    display_name: 'Cyber Neon'
  },
  {
    background_type: 'image',
    background_value: '#000000', // fallback
    bg_image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    bg_overlay_opacity: 40,
    text_color: '#ffffff',
    button_style: 'glass',
    button_color: '#ffffff',
    button_text_color: '#ffffff',
    display_name: 'Luxury'
  },
];

const ColorInput = ({ value, onChange, label }: { value?: string, onChange: (val: string) => void, label: string }) => (
  <div className="flex items-center gap-3">
    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
      <input 
        type="color" 
        value={value || '#000000'} 
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 cursor-pointer"
      />
    </div>
    <div className="flex-1">
      <Label className="text-xs text-gray-500 mb-1">{label}</Label>
      <Input 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="h-8 font-mono text-xs" 
        placeholder="#000000"
      />
    </div>
  </div>
);

export function AppearanceEditor({ theme, updateTheme }: AppearanceEditorProps) {
  const [localTheme, setLocalTheme] = useState<LinkBioTheme>(theme);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync prop changes to local state (unless we are editing)
  useEffect(() => {
    // Only update if IDs match to avoid overwriting work in progress, 
    // but in this simple case we just sync.
    // In a real app we might need more complex sync logic.
    // For now, we trust localTheme is the source of truth for the editor.
  }, [theme]);

  // Debounced Save
  const debouncedTheme = useDebounce(localTheme, 1000);

  useEffect(() => {
    // Check if changed from prop
    const hasChanges = JSON.stringify(debouncedTheme) !== JSON.stringify(theme);
    if (hasChanges) {
      saveChanges();
    }
  }, [debouncedTheme]);

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await updateTheme(localTheme);
      setLastSaved(new Date());
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: keyof LinkBioTheme, value: any) => {
    setLocalTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Éditeur de style</h2>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          {isSaving ? (
            <span className="animate-pulse">Sauvegarde...</span>
          ) : lastSaved ? (
            <span>Sauvegardé {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Presets */}
        <section>
          <h3 className="text-sm font-medium mb-3 text-gray-500 uppercase tracking-wider">Thèmes rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLocalTheme(prev => ({ ...prev, ...preset }));
                  toast.success(`Thème ${preset.display_name} appliqué`);
                }}
                className="relative h-20 rounded-lg border-2 border-transparent hover:border-blue-500 overflow-hidden text-left transition-all shadow-sm group"
                style={{ 
                  background: preset.background_type === 'gradient' ? preset.background_value : 
                              preset.background_type === 'image' ? `url(${preset.bg_image_url}) center/cover` : 
                              preset.background_value 
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-2 left-2 text-xs font-bold text-white shadow-black drop-shadow-md">
                  {preset.display_name}
                </div>
              </button>
            ))}
          </div>
        </section>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="branding">
          
          {/* Branding */}
          <AccordionItem value="branding" className="bg-white dark:bg-gray-900 border rounded-xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Identité</div>
                  <div className="text-xs text-gray-500 font-normal">Photo, nom et bio</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              <div className="space-y-2">
                <Label>Nom d'affichage</Label>
                <Input 
                  value={localTheme.display_name || ''} 
                  onChange={(e) => updateField('display_name', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input 
                  value={localTheme.bio || ''} 
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Une courte description..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Afficher l'avatar</Label>
                <Switch 
                  checked={localTheme.show_avatar !== false}
                  onCheckedChange={(c) => updateField('show_avatar', c)}
                />
              </div>
              <div className="space-y-2">
                <Label>URL de l'avatar (Optionnel)</Label>
                <Input 
                  value={localTheme.avatar_url || ''} 
                  onChange={(e) => updateField('avatar_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Background */}
          <AccordionItem value="background" className="bg-white dark:bg-gray-900 border rounded-xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Arrière-plan</div>
                  <div className="text-xs text-gray-500 font-normal">Couleurs, dégradés, images</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              <div className="grid grid-cols-3 gap-2">
                {['solid', 'gradient', 'image'].map(type => (
                  <Button
                    key={type}
                    variant={localTheme.background_type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateField('background_type', type)}
                    className="capitalize"
                  >
                    {type === 'solid' ? 'Uni' : type === 'gradient' ? 'Dégradé' : 'Image'}
                  </Button>
                ))}
              </div>

              {localTheme.background_type === 'image' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>URL de l'image</Label>
                    <Input 
                      value={localTheme.bg_image_url || ''} 
                      onChange={(e) => updateField('bg_image_url', e.target.value)} 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <Label>Flou ({localTheme.bg_blur || 0}px)</Label>
                    </div>
                    <Slider 
                      value={[localTheme.bg_blur || 0]} 
                      max={20} 
                      step={1} 
                      onValueChange={([v]) => updateField('bg_blur', v)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <Label>Opacité du calque ({localTheme.bg_overlay_opacity || 0}%)</Label>
                    </div>
                    <Slider 
                      value={[localTheme.bg_overlay_opacity || 0]} 
                      max={100} 
                      step={1} 
                      onValueChange={([v]) => updateField('bg_overlay_opacity', v)} 
                    />
                  </div>
                  <ColorInput 
                    label="Couleur du calque" 
                    value={localTheme.bg_overlay_color} 
                    onChange={(v) => updateField('bg_overlay_color', v)} 
                  />
                </div>
              )}

              {(localTheme.background_type === 'solid' || localTheme.background_type === 'gradient') && (
                <div className="space-y-2">
                  <Label>Valeur (Couleur ou CSS Gradient)</Label>
                  <Input 
                    value={localTheme.background_value} 
                    onChange={(e) => updateField('background_value', e.target.value)} 
                  />
                  {localTheme.background_type === 'solid' && (
                    <div className="mt-2">
                      <ColorInput 
                        label="Sélecteur" 
                        value={localTheme.background_value} 
                        onChange={(v) => updateField('background_value', v)} 
                      />
                    </div>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Buttons */}
          <AccordionItem value="buttons" className="bg-white dark:bg-gray-900 border rounded-xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Layout className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Boutons</div>
                  <div className="text-xs text-gray-500 font-normal">Forme, style et couleurs</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2 pb-4">
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={localTheme.button_style} onValueChange={(v) => updateField('button_style', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Plein (Solid)</SelectItem>
                    <SelectItem value="outline">Contour (Outline)</SelectItem>
                    <SelectItem value="glass">Verre (Glass)</SelectItem>
                    <SelectItem value="neon">Néon</SelectItem>
                    <SelectItem value="shadow">Rétro (Shadow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorInput label="Fond" value={localTheme.button_color} onChange={(v) => updateField('button_color', v)} />
                <ColorInput label="Texte" value={localTheme.button_text_color} onChange={(v) => updateField('button_text_color', v)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label>Arrondi ({localTheme.button_radius ?? 8}px)</Label>
                </div>
                <Slider 
                  value={[localTheme.button_radius ?? 8]} 
                  max={30} 
                  step={1} 
                  onValueChange={([v]) => updateField('button_radius', v)} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label>Ombre ({localTheme.button_shadow ?? 0}px)</Label>
                </div>
                <Slider 
                  value={[localTheme.button_shadow ?? 0]} 
                  max={20} 
                  step={1} 
                  onValueChange={([v]) => updateField('button_shadow', v)} 
                />
              </div>

              <div className="space-y-2">
                <Label>Animation au survol</Label>
                <Select value={localTheme.button_hover_effect || 'none'} onValueChange={(v) => updateField('button_hover_effect', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="lift">Levée (Lift)</SelectItem>
                    <SelectItem value="glow">Lueur (Glow)</SelectItem>
                    <SelectItem value="invert">Inversion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Typography */}
          <AccordionItem value="typography" className="bg-white dark:bg-gray-900 border rounded-xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Type className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Typographie</div>
                  <div className="text-xs text-gray-500 font-normal">Police et couleurs</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              <div className="space-y-2">
                <Label>Police</Label>
                <Select value={localTheme.font_family} onValueChange={(v) => updateField('font_family', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter (Moderne)</SelectItem>
                    <SelectItem value="poppins">Poppins (Géométrique)</SelectItem>
                    <SelectItem value="dm_sans">DM Sans (Minimal)</SelectItem>
                    <SelectItem value="playfair">Playfair Display (Serif)</SelectItem>
                    <SelectItem value="outfit">Outfit (Bold)</SelectItem>
                    <SelectItem value="satoshi">Satoshi (Clean)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ColorInput label="Couleur principale" value={localTheme.text_color} onChange={(v) => updateField('text_color', v)} />

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label>Taille ({localTheme.font_size || 16}px)</Label>
                </div>
                <Slider 
                  value={[localTheme.font_size || 16]} 
                  min={12}
                  max={24} 
                  step={1} 
                  onValueChange={([v]) => updateField('font_size', v)} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Social Links */}
          <AccordionItem value="social" className="bg-white dark:bg-gray-900 border rounded-xl px-4">
             <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Réseaux Sociaux</div>
                  <div className="text-xs text-gray-500 font-normal">Icônes et liens</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
               <div className="flex items-center justify-between">
                <Label>Afficher les icônes</Label>
                <Switch 
                  checked={localTheme.show_social_icons !== false}
                  onCheckedChange={(c) => updateField('show_social_icons', c)}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-xs text-gray-500">Ajouter vos liens</Label>
                {(localTheme.social_links || []).map((link, idx) => (
                  <div key={idx} className="flex gap-2">
                     <Select 
                       value={link.platform} 
                       onValueChange={(val) => {
                         const newLinks = [...(localTheme.social_links || [])];
                         newLinks[idx].platform = val;
                         updateField('social_links', newLinks);
                       }}
                     >
                        <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter / X</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="website">Site Web</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                     </Select>
                     <Input 
                       value={link.url}
                       placeholder="URL..."
                       onChange={(e) => {
                         const newLinks = [...(localTheme.social_links || [])];
                         newLinks[idx].url = e.target.value;
                         updateField('social_links', newLinks);
                       }}
                     />
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => {
                         const newLinks = (localTheme.social_links || []).filter((_, i) => i !== idx);
                         updateField('social_links', newLinks);
                       }}
                     >
                       <span className="text-red-500">×</span>
                     </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed"
                  onClick={() => {
                    updateField('social_links', [...(localTheme.social_links || []), { platform: 'instagram', url: '' }]);
                  }}
                >
                  + Ajouter un réseau
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
