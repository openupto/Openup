import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Label } from './ui/label';

const THEMES = [
  { id: 'gradient-blue', name: 'Océan', preview: 'from-blue-400 via-cyan-300 to-blue-200' },
  { id: 'gradient-pink', name: 'Sunset', preview: 'from-pink-400 via-rose-300 to-orange-200' },
  { id: 'gradient-purple', name: 'Galaxy', preview: 'from-purple-400 via-pink-300 to-purple-200' },
  { id: 'gradient-orange', name: 'Sunrise', preview: 'from-orange-400 via-yellow-300 to-orange-200' },
] as const;

const BUTTON_STYLES = [
  { id: 'rounded', name: 'Arrondi', class: 'rounded-xl' },
  { id: 'square', name: 'Carré', class: 'rounded-none' },
  { id: 'pill', name: 'Pilule', class: 'rounded-full' },
] as const;

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  currentButtonStyle: string;
  onSave: (theme: string, buttonStyle: string) => void;
  isMobile?: boolean;
}

export function AppearanceModal({
  isOpen,
  onClose,
  currentTheme,
  currentButtonStyle,
  onSave,
  isMobile = false,
}: AppearanceModalProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(currentButtonStyle);

  const handleSave = () => {
    onSave(selectedTheme, selectedButtonStyle);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.3 }}
            className={`
              fixed z-[71] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden
              ${
                isMobile
                  ? 'inset-x-4 top-20 bottom-20'
                  : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg'
              }
            `}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900 dark:text-white">Modifier l'apparence</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {/* Thèmes */}
              <div className="space-y-3">
                <Label>Thème</Label>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`
                        relative p-3 border-2 rounded-xl transition-all
                        ${
                          selectedTheme === theme.id
                            ? 'border-[#3399ff] shadow-lg shadow-[#3399ff]/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`w-full h-20 rounded-lg mb-2 bg-gradient-to-b ${theme.preview}`} />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{theme.name}</p>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#3399ff] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style des boutons */}
              <div className="space-y-3">
                <Label>Style des boutons</Label>
                <div className="grid grid-cols-3 gap-3">
                  {BUTTON_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedButtonStyle(style.id)}
                      className={`
                        relative p-4 border-2 rounded-xl transition-all
                        ${
                          selectedButtonStyle === style.id
                            ? 'border-[#3399ff] bg-[#3399ff]/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`w-full h-10 bg-gray-300 dark:bg-gray-600 mb-2 ${style.class}`} />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{style.name}</p>
                      {selectedButtonStyle === style.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#3399ff] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave} className="bg-[#3399ff] hover:bg-[#2680e6]">
                Enregistrer
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
