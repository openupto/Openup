import { useState } from 'react';
import { X, QrCode, ChevronRight, Check, Sparkles, Crown, Download, Link2, Palette, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { qrCodesAPI } from '../utils/supabase/api';
import { useAuth } from './auth-context';

interface CreateQRWizardProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionTier?: string;
  isMobile?: boolean;
}

interface QRFormData {
  // Step 1
  url: string;
  title: string;
  
  // Step 2
  foregroundColor: string;
  backgroundColor: string;
  logoUrl: string;
  style: 'square' | 'rounded' | 'dots';
  
  // Step 3
  size: string;
  format: 'png' | 'svg' | 'pdf';
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

export function CreateQRWizard({ isOpen, onClose, subscriptionTier = 'free', isMobile = false }: CreateQRWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<QRFormData>({
    url: '',
    title: '',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logoUrl: '',
    style: 'square',
    size: '1024',
    format: 'png',
    errorCorrection: 'M',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPro = subscriptionTier === 'pro' || subscriptionTier === 'business';

  const updateFormData = (field: keyof QRFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'L\'URL est obligatoire';
    } else if (!formData.url.match(/^https?:\/\/.+/)) {
      newErrors.url = 'L\'URL doit commencer par http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un QR code');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Prepare style JSONB
      const styleData = {
        foregroundColor: formData.foregroundColor,
        backgroundColor: formData.backgroundColor,
        logoUrl: formData.logoUrl,
        style: formData.style,
        size: formData.size,
        format: formData.format,
        errorCorrection: formData.errorCorrection
      };

      await qrCodesAPI.createQRCode({
        user_id: user.id,
        name: formData.title || formData.url,
        target_url: formData.url,
        style: styleData
      });

      toast.success('QR Code généré avec succès !', {
        description: formData.title || formData.url,
      });
      onClose();
    } catch (error: any) {
      console.error('Failed to create QR code:', error);
      toast.error('Erreur lors de la génération du QR Code', {
        description: error.message || 'Veuillez réessayer plus tard'
      });
    } finally {
      setIsGenerating(false);
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={isGenerating ? undefined : onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            className={`
              fixed z-[61] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden
              ${isMobile 
                ? 'inset-x-4 top-4 bottom-4' 
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh]'
              }
            `}
          >
            {/* Header avec stepper */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-gray-900 dark:text-white">Créer un QR Code</h2>
                </div>
                {!isGenerating && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-3 px-6 pb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: step === currentStep 
                          ? '#3399ff' 
                          : step < currentStep 
                            ? '#3399ff' 
                            : '#e5e7eb',
                        scale: step === currentStep ? 1.1 : 1,
                      }}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${step === currentStep ? 'shadow-lg shadow-[#3399ff]/30' : ''}
                      `}
                    >
                      {step < currentStep ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`${step <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                          {step}
                        </span>
                      )}
                    </motion.div>
                    {step < 3 && (
                      <div 
                        className={`w-12 h-0.5 mx-2 ${
                          step < currentStep ? 'bg-[#3399ff]' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: isMobile ? 'calc(100vh - 220px)' : '60vh' }}>
              <AnimatePresence mode="wait">
                {/* Étape 1 - URL et titre */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Link2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-gray-900 dark:text-white mb-2">Contenu du QR Code</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Entrez l'URL que vous souhaitez encoder
                      </p>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                      <Label htmlFor="url" className="flex items-center gap-2">
                        URL de destination
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://openup.to/monlien"
                        value={formData.url}
                        onChange={(e) => updateFormData('url', e.target.value)}
                        className={errors.url ? 'border-red-500' : ''}
                      />
                      {errors.url && (
                        <p className="text-sm text-red-500">{errors.url}</p>
                      )}
                    </div>

                    {/* Titre */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du QR Code</Label>
                      <Input
                        id="title"
                        placeholder="Mon QR Code personnalisé"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pour vous aider à identifier ce QR Code
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 - Design */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3399ff] to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-gray-900 dark:text-white mb-2">Personnalisation</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Customisez l'apparence de votre QR Code
                      </p>
                    </div>

                    {/* Couleur principale */}
                    <div className="space-y-2">
                      <Label htmlFor="foregroundColor">Couleur principale</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="foregroundColor"
                          type="color"
                          value={formData.foregroundColor}
                          onChange={(e) => updateFormData('foregroundColor', e.target.value)}
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.foregroundColor}
                          onChange={(e) => updateFormData('foregroundColor', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    {/* Couleur de fond */}
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Couleur de fond</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => updateFormData('backgroundColor', e.target.value)}
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.backgroundColor}
                          onChange={(e) => updateFormData('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    {/* Style */}
                    <div className="space-y-2">
                      <Label>Style du QR Code</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['square', 'rounded', 'dots'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateFormData('style', style)}
                            className={`
                              p-4 border-2 rounded-xl transition-all
                              ${formData.style === style 
                                ? 'border-[#3399ff] bg-[#3399ff]/5' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }
                            `}
                          >
                            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 mb-2" />
                            <p className="text-sm capitalize text-gray-700 dark:text-gray-300">{style}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logo */}
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl" className="flex items-center gap-2">
                        Logo au centre (optionnel)
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </Label>
                      <Input
                        id="logoUrl"
                        type="url"
                        placeholder="URL de votre logo"
                        value={formData.logoUrl}
                        onChange={(e) => updateFormData('logoUrl', e.target.value)}
                        disabled={!isPro}
                      />
                    </div>

                    {/* Preview */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aperçu</p>
                      <div className="flex justify-center">
                        <div 
                          className="w-48 h-48 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: formData.backgroundColor }}
                        >
                          <QrCode className="w-32 h-32" style={{ color: formData.foregroundColor }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 - Export */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Download className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-gray-900 dark:text-white mb-2">Options d'export</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configurez les paramètres de téléchargement
                      </p>
                    </div>

                    {/* Taille */}
                    <div className="space-y-2">
                      <Label htmlFor="size">Taille du QR Code</Label>
                      <Select
                        value={formData.size}
                        onValueChange={(value) => updateFormData('size', value)}
                      >
                        <SelectTrigger id="size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512">512x512 px (Petit)</SelectItem>
                          <SelectItem value="1024">1024x1024 px (Moyen)</SelectItem>
                          <SelectItem value="2048">2048x2048 px (Grand)</SelectItem>
                          <SelectItem value="4096">4096x4096 px (Très grand)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Format */}
                    <div className="space-y-2">
                      <Label htmlFor="format">Format de fichier</Label>
                      <Select
                        value={formData.format}
                        onValueChange={(value: any) => updateFormData('format', value)}
                      >
                        <SelectTrigger id="format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG (Recommandé)</SelectItem>
                          <SelectItem value="svg">SVG (Vectoriel)</SelectItem>
                          <SelectItem value="pdf">PDF (Impression)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Correction d'erreur */}
                    <div className="space-y-2">
                      <Label htmlFor="errorCorrection">Niveau de correction d'erreur</Label>
                      <Select
                        value={formData.errorCorrection}
                        onValueChange={(value: any) => updateFormData('errorCorrection', value)}
                      >
                        <SelectTrigger id="errorCorrection">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Faible (7%)</SelectItem>
                          <SelectItem value="M">Moyen (15%) - Recommandé</SelectItem>
                          <SelectItem value="Q">Élevé (25%)</SelectItem>
                          <SelectItem value="H">Très élevé (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Plus le niveau est élevé, plus le QR Code résiste aux dommages
                      </p>
                    </div>

                    {/* Résumé */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="text-sm mb-3 text-blue-900 dark:text-blue-100">Résumé</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">URL:</span>
                          <span className="text-gray-900 dark:text-white truncate ml-2 max-w-[200px]">
                            {formData.url || 'Non défini'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Titre:</span>
                          <span className="text-gray-900 dark:text-white">
                            {formData.title || 'Sans titre'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Format:</span>
                          <span className="text-gray-900 dark:text-white uppercase">
                            {formData.format}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Taille:</span>
                          <span className="text-gray-900 dark:text-white">
                            {formData.size}x{formData.size} px
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? onClose : handlePrevious}
                disabled={isGenerating}
              >
                {currentStep === 1 ? 'Annuler' : 'Précédent'}
              </Button>

              <div className="flex items-center gap-2">
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#3399ff] hover:bg-[#2680e6]"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#3399ff] hover:bg-[#2680e6]"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Générer le QR Code
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
