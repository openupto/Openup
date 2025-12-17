import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Upload, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import defaultPreviewImage from 'figma:asset/11dc7084042c1df8f1b443c647bae014ae08ce4a.png';

interface MobileLinkWizardProps {
  onClose: () => void;
  onComplete?: (linkData: any) => void;
}

export function MobileLinkWizard({ onClose, onComplete }: MobileLinkWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  
  // Form data
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    slug: '',
    domain: 'openup.to',
    generateQR: false,
    previewImage: null as File | null,
    previewTitle: '',
    previewDescription: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!formData.url) {
        toast.error('Veuillez entrer une URL de destination');
        return;
      }
      if (!formData.title) {
        toast.error('Veuillez entrer un titre pour le lien');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success('Lien créé avec succès !');
    onComplete?.(formData);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, previewImage: file });
      toast.success('Image ajoutée');
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-white dark:bg-gray-900 safe-area-top">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="tracking-tight">
            <span className="text-foreground">open</span>
          </span>
          <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
            Starter
          </Badge>
        </div>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        <div className="px-4 py-4">
          {/* Section header */}
          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="flex items-center gap-2 mb-6 text-[#3399ff] touch-target w-full active:scale-95 transition-transform"
          >
            <span className="text-lg font-medium">+</span>
            <span className="flex-1 text-left">Détails du lien</span>
            {detailsExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {detailsExpanded && (
            <div className="space-y-6">
              {/* Step indicators */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 touch-target active:scale-95 ${
                      currentStep === step
                        ? 'bg-[#3399ff] text-white scale-110 shadow-lg shadow-[#3399ff]/30'
                        : currentStep > step
                        ? 'bg-[#e6f2ff] dark:bg-[#3399ff]/20 text-[#3399ff]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-tab-enter">
                  {/* URL de destination */}
                  <div>
                    <label className="block mb-2 text-sm">
                      URL de destination <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="url"
                      placeholder="Coller mon lien"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base placeholder:text-gray-400"
                    />
                  </div>

                  {/* Titre du lien */}
                  <div>
                    <label className="block mb-2 text-sm">Titre du lien</label>
                    <Input
                      type="text"
                      placeholder="Mon super projet"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base placeholder:text-gray-400"
                    />
                  </div>

                  {/* Modifier le slug */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Modifier le slug</label>
                      <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
                        Starter
                      </Badge>
                      <span className="text-xs text-gray-500">(Min. 5 caractères)</span>
                    </div>
                    <div className="flex items-stretch border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                      <div className="bg-gray-50 dark:bg-gray-800 px-3 flex items-center border-r border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">openup.to/</span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Monlien"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white dark:bg-gray-800 text-base placeholder:text-gray-400 px-3"
                      />
                    </div>
                  </div>

                  {/* Nom de domaine */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Nom de domaine</label>
                      <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
                        Pro
                      </Badge>
                    </div>
                    <div className="relative">
                      <select
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3.5 pr-10 text-base"
                      >
                        <option value="openup.to">openup.to</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Générer un QR Code */}
                  <div>
                    <label className="block mb-3 text-sm">Générer un QR Code à partir de ce lien</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, generateQR: true })}
                        className={`flex-1 py-3.5 rounded-xl border-2 transition-all active:scale-95 ${
                          formData.generateQR
                            ? 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 font-medium'
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, generateQR: false })}
                        className={`flex-1 py-3.5 rounded-xl border-2 transition-all active:scale-95 ${
                          !formData.generateQR
                            ? 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 font-medium'
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Preview Settings */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-tab-enter">
                  {/* Image d'aperçu */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Image d'aperçu</label>
                      <Info className="w-4 h-4 text-gray-400" />
                      <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
                        Starter
                      </Badge>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
                      <input
                        type="file"
                        id="preview-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="preview-image"
                        className="block h-48 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:bg-gray-200 dark:active:bg-gray-600 relative overflow-hidden group"
                      >
                        <img 
                          src={formData.previewImage ? URL.createObjectURL(formData.previewImage) : defaultPreviewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm text-white font-medium">
                              {formData.previewImage ? 'Changer l\'image' : 'Charger image'}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Titre d'aperçu */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Titre d'aperçu</label>
                      <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
                        Starter
                      </Badge>
                      <span className="text-xs text-gray-500">(Max. 60 caractères)</span>
                    </div>
                    <Input
                      type="text"
                      placeholder="Mon super projet"
                      value={formData.previewTitle}
                      onChange={(e) => setFormData({ ...formData, previewTitle: e.target.value })}
                      maxLength={60}
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base placeholder:text-gray-400"
                    />
                  </div>

                  {/* Description d'aperçu */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Titre d'aperçu</label>
                      <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
                        Starter
                      </Badge>
                      <span className="text-xs text-gray-500">(Max. 150 caractères)</span>
                    </div>
                    <Textarea
                      placeholder="Découvrez mon super projet et accédez à toutes les infos en un clic."
                      value={formData.previewDescription}
                      onChange={(e) => setFormData({ ...formData, previewDescription: e.target.value })}
                      maxLength={150}
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3.5 min-h-[100px] resize-none text-base placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Advanced Settings */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-tab-enter">
                  <div className="text-center py-4">
                    <div className="w-20 h-20 bg-[#3399ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-10 h-10 text-[#3399ff]" />
                    </div>
                    <h3 className="mb-2">Paramètres avancés</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 px-4">
                      Configurez les options avancées pour votre lien
                    </p>
                    <div className="space-y-3 text-left">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Protection par mot de passe</span>
                          <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
                            Pro
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Sécurisez votre lien avec un mot de passe
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Date d'expiration</span>
                          <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
                            Pro
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Définir une date d'expiration pour ce lien
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Deep links iOS/Android</span>
                          <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none text-xs px-2 py-0.5">
                            Pro
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Redirection intelligente vers les apps natives
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border p-4 pb-safe-enhanced shadow-lg">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 rounded-xl h-12 border-gray-200 dark:border-gray-700 active:scale-95 transition-transform"
            >
              Précédent
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-[#3399ff] hover:bg-[#2277dd] text-white rounded-xl h-12 shadow-lg shadow-[#3399ff]/20 active:scale-95 transition-all"
          >
            {currentStep === totalSteps ? 'Créer le lien' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
}
