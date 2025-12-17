import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface MobileAppearanceEditorProps {
  onClose: () => void;
  onSave?: (theme: any) => void;
  initialTheme?: any;
}

export function MobileAppearanceEditor({ 
  onClose, 
  onSave,
  initialTheme 
}: MobileAppearanceEditorProps) {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme || 'gradient-blue');

  const themes = [
    {
      id: 'gradient-blue',
      name: 'Océan',
      gradient: 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300',
      isPro: false
    },
    {
      id: 'gradient-pink',
      name: 'Coucher de soleil',
      gradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300',
      isPro: false
    },
    {
      id: 'gradient-purple',
      name: 'Aurore',
      gradient: 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-300',
      isPro: true
    },
    {
      id: 'gradient-green',
      name: 'Forêt',
      gradient: 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-300',
      isPro: true
    },
    {
      id: 'gradient-orange',
      name: 'Feu',
      gradient: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-300',
      isPro: true
    },
    {
      id: 'gradient-dark',
      name: 'Nuit',
      gradient: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
      isPro: true
    },
    {
      id: 'solid-white',
      name: 'Blanc pur',
      gradient: 'bg-white',
      isPro: false
    },
    {
      id: 'solid-black',
      name: 'Noir élégant',
      gradient: 'bg-black',
      isPro: true
    }
  ];

  const handleSave = () => {
    const theme = themes.find(t => t.id === selectedTheme);
    if (theme?.isPro) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs Pro');
      return;
    }
    onSave?.(selectedTheme);
    toast.success('Apparence mise à jour !');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[110] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-white dark:bg-gray-900 safe-area-top">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="font-medium">Modifier l'apparence</h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-[#3399ff] hover:text-[#2277dd] hover:bg-transparent"
        >
          Enregistrer
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-safe-enhanced">
        <div className="mb-6">
          <h3 className="mb-4">Thèmes de fond</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  if (theme.isPro) {
                    toast.error('Thème réservé aux utilisateurs Pro');
                  } else {
                    setSelectedTheme(theme.id);
                  }
                }}
                className={`relative aspect-[9/14] rounded-xl overflow-hidden transition-all ${
                  selectedTheme === theme.id
                    ? 'ring-2 ring-[#3399ff] ring-offset-2 scale-95'
                    : 'hover:scale-95 active:scale-90'
                }`}
              >
                {/* Background */}
                <div className={`absolute inset-0 ${theme.gradient}`} />
                
                {/* Selected indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#3399ff] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Pro badge */}
                {theme.isPro && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
                      Pro
                    </Badge>
                  </div>
                )}

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-sm font-medium">{theme.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Layout options */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Disposition des liens</h3>
            <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
              Pro
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-[#3399ff] transition-colors flex flex-col items-center justify-center gap-1">
              <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded" />
              <p className="text-xs mt-2">Liste</p>
            </button>
            <button className="aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-[#3399ff] transition-colors flex flex-col items-center justify-center gap-1 opacity-50">
              <div className="grid grid-cols-2 gap-1 w-full">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
              <p className="text-xs mt-2">Grille</p>
            </button>
            <button className="aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-[#3399ff] transition-colors flex flex-col items-center justify-center gap-1 opacity-50">
              <div className="flex gap-1 w-full justify-center">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              <p className="text-xs mt-2">Icônes</p>
            </button>
          </div>
        </div>

        {/* Font options */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Police de caractères</h3>
            <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
              Starter
            </Badge>
          </div>
          <div className="space-y-2">
            <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3399ff] transition-colors text-left">
              <p className="font-sans">Inter - Sans Serif</p>
            </button>
            <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3399ff] transition-colors text-left opacity-50">
              <p className="font-serif">Playfair Display - Serif</p>
            </button>
            <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3399ff] transition-colors text-left opacity-50">
              <p className="font-mono">Roboto Mono - Monospace</p>
            </button>
          </div>
        </div>

        {/* Button style */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Style des boutons</h3>
            <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
              Starter
            </Badge>
          </div>
          <div className="space-y-2">
            <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-[#3399ff] transition-colors">
              <div className="w-full h-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                Bordure arrondie
              </div>
            </button>
            <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-[#3399ff] transition-colors opacity-50">
              <div className="w-full h-12 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                Coins arrondis
              </div>
            </button>
            <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-[#3399ff] transition-colors opacity-50">
              <div className="w-full h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                Rectangle
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
