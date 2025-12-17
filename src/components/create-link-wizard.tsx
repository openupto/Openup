import { useState } from 'react';
import { X, Link2, ChevronRight, Check, Sparkles, Crown, QrCode, Image as ImageIcon, Palette, Clock, Lock, BarChart3, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useLinks } from './links-context';
import defaultPreviewImage from 'figma:asset/11dc7084042c1df8f1b443c647bae014ae08ce4a.png';

interface CreateLinkWizardProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionTier?: string;
  isMobile?: boolean;
  defaultType?: string;
}

interface LinkFormData {
  // Étape 1
  type: string;
  url: string;
  title: string;
  slug: string;
  domain: string;
  generateQR: boolean;
  
  // Étape 2
  previewImage: string;
  previewTitle: string;
  previewDescription: string;
  
  // Étape 3
  password: string;
  expirationDate: string;
  clickLimit: string;
  geoFilter: string;
  utmTracker: string;
}

export function CreateLinkWizard({ isOpen, onClose, subscriptionTier = 'free', isMobile = false, defaultType = 'url' }: CreateLinkWizardProps) {
  const { addLink } = useLinks();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LinkFormData>({
    type: defaultType,
    url: '',
    title: '',
    slug: '',
    domain: 'openup.to',
    generateQR: false,
    previewImage: '',
    previewTitle: '',
    previewDescription: '',
    password: '',
    expirationDate: '',
    clickLimit: '',
    geoFilter: '',
    utmTracker: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPro = subscriptionTier === 'pro' || subscriptionTier === 'business';
  const isStarter = subscriptionTier === 'starter' || isPro;

  const updateFormData = (field: keyof LinkFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'L\'URL de destination est obligatoire';
    } else if (!formData.url.match(/^https?:\/\/.+/)) {
      newErrors.url = 'L\'URL doit commencer par http:// ou https://';
    }

    if (formData.slug && formData.slug.length < 5) {
      newErrors.slug = 'Le slug doit contenir au moins 5 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
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

  const handleSubmit = () => {
    // Créer le lien
    addLink({
      title: formData.title || 'Lien sans titre',
      url: formData.url,
      shortUrl: '', // sera généré par addLink
      slug: formData.slug,
      domain: formData.domain,
      previewImage: formData.previewImage,
      previewTitle: formData.previewTitle,
      previewDescription: formData.previewDescription,
      password: formData.password,
      expirationDate: formData.expirationDate,
      clickLimit: formData.clickLimit,
      geoFilter: formData.geoFilter,
      utmTracker: formData.utmTracker,
      generateQR: formData.generateQR,
      type: formData.type,
    });

    toast.success('Lien créé avec succès !', {
      description: formData.title || formData.url,
    });

    // Réinitialiser le formulaire
    setFormData({
      type: defaultType,
      url: '',
      title: '',
      slug: '',
      domain: 'openup.to',
      generateQR: false,
      previewImage: '',
      previewTitle: '',
      previewDescription: '',
      password: '',
      expirationDate: '',
      clickLimit: '',
      geoFilter: '',
      utmTracker: '',
    });
    setCurrentStep(1);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
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
                  <div className="w-10 h-10 bg-[#3399ff] rounded-xl flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-gray-900 dark:text-white">Détails du lien</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
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
                {/* Étape 1 - Détails du lien */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* URL de destination */}
                    <div className="space-y-2">
                      <Label htmlFor="url" className="flex items-center gap-2">
                        URL de destination
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="Coller mon lien"
                        value={formData.url}
                        onChange={(e) => updateFormData('url', e.target.value)}
                        className={errors.url ? 'border-red-500' : ''}
                      />
                      {errors.url && (
                        <p className="text-sm text-red-500">{errors.url}</p>
                      )}
                    </div>

                    {/* Titre du lien */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du lien</Label>
                      <Input
                        id="title"
                        placeholder="Mon super projet"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                      />
                    </div>

                    {/* Modifier le slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="flex items-center gap-2">
                        Modifier le slug
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Starter
                        </Badge>
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                          openup.to/
                        </div>
                        <Input
                          id="slug"
                          placeholder="Monlien"
                          value={formData.slug}
                          onChange={(e) => updateFormData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          disabled={!isStarter}
                          className={errors.slug ? 'border-red-500' : ''}
                        />
                      </div>
                      {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">Min. 5 caractères</p>
                    </div>

                    {/* Nom de domaine */}
                    <div className="space-y-2">
                      <Label htmlFor="domain" className="flex items-center gap-2">
                        Nom de domaine
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </Label>
                      <Select
                        value={formData.domain}
                        onValueChange={(value) => updateFormData('domain', value)}
                        disabled={!isPro}
                      >
                        <SelectTrigger id="domain">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openup.to">openup.to</SelectItem>
                          {isPro && (
                            <>
                              <SelectItem value="custom1.com">custom1.com</SelectItem>
                              <SelectItem value="custom2.com">custom2.com</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Générer QR Code */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3399ff]/10 rounded-lg flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-[#3399ff]" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">Générer un QR Code à partir de ce lien</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.generateQR}
                        onCheckedChange={(checked) => updateFormData('generateQR', checked)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 - Détails du lien */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Image d'aperçu */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Image d'aperçu
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Premium
                        </Badge>
                      </Label>
                      <div className="relative">
                        <div className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                          <img 
                            src={formData.previewImage || defaultPreviewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                        <button
                          className="absolute bottom-0 left-0 right-0 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-b-2xl transition-colors"
                          onClick={() => {
                            // TODO: Implement image upload
                            toast.info('Fonctionnalité de téléchargement d\'image à venir');
                          }}
                        >
                          Charger image
                        </button>
                      </div>
                    </div>

                    {/* Titre d'aperçu */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="previewTitle" className="flex items-center gap-2">
                          Titre d'aperçu
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Libre
                          </Badge>
                        </Label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Max. 60 caractères)
                        </span>
                      </div>
                      <Input
                        id="previewTitle"
                        placeholder="Mon super projet"
                        value={formData.previewTitle}
                        onChange={(e) => {
                          if (e.target.value.length <= 60) {
                            updateFormData('previewTitle', e.target.value);
                          }
                        }}
                        maxLength={60}
                      />
                      <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                        {formData.previewTitle.length}/60
                      </p>
                    </div>

                    {/* Description d'aperçu */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="previewDescription" className="flex items-center gap-2">
                          Titre d'aperçu
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Libre
                          </Badge>
                        </Label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Max. 100 caractères)
                        </span>
                      </div>
                      <Textarea
                        id="previewDescription"
                        placeholder="Découvrez mon super projet et accédez à toutes les infos en un clic."
                        value={formData.previewDescription}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            updateFormData('previewDescription', e.target.value);
                          }
                        }}
                        maxLength={100}
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                        {formData.previewDescription.length}/100
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 - Détails du lien */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Protection par mot de passe */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        Protection par mot de passe
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Pro
                        </Badge>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mot de passe"
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          disabled={!isPro}
                          className="pr-10"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Date d'expiration */}
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate" className="flex items-center gap-2">
                        Date d'expiration
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Pro
                        </Badge>
                      </Label>
                      <div className="relative">
                        <Input
                          id="expirationDate"
                          type="text"
                          placeholder="jj / mm / aaaa"
                          value={formData.expirationDate}
                          onChange={(e) => updateFormData('expirationDate', e.target.value)}
                          disabled={!isPro}
                          className="pr-10"
                          onFocus={(e) => {
                            e.target.type = 'date';
                          }}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              e.target.type = 'text';
                            }
                          }}
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Limite de clics */}
                    <div className="space-y-2">
                      <Label htmlFor="clickLimit" className="flex items-center gap-2">
                        Limite de clics
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Pro
                        </Badge>
                      </Label>
                      <Select
                        value={formData.clickLimit}
                        onValueChange={(value) => updateFormData('clickLimit', value)}
                        disabled={!isPro}
                      >
                        <SelectTrigger id="clickLimit">
                          <SelectValue placeholder="Illimité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unlimited">Illimité</SelectItem>
                          <SelectItem value="100">100 clics</SelectItem>
                          <SelectItem value="500">500 clics</SelectItem>
                          <SelectItem value="1000">1 000 clics</SelectItem>
                          <SelectItem value="5000">5 000 clics</SelectItem>
                          <SelectItem value="10000">10 000 clics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtre géographique */}
                    <div className="space-y-2">
                      <Label htmlFor="geoFilter" className="flex items-center gap-2">
                        Filtre géographique
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Pro
                        </Badge>
                      </Label>
                      <Input
                        id="geoFilter"
                        type="text"
                        placeholder="Coller mon lien"
                        value={formData.geoFilter}
                        onChange={(e) => updateFormData('geoFilter', e.target.value)}
                        disabled={!isPro}
                      />
                    </div>

                    {/* UTM Tracker */}
                    <div className="space-y-2">
                      <Label htmlFor="utmTracker" className="flex items-center gap-2">
                        UTM Tracker
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Pro
                        </Badge>
                      </Label>
                      <Input
                        id="utmTracker"
                        type="text"
                        placeholder="Lien UTM"
                        value={formData.utmTracker}
                        onChange={(e) => updateFormData('utmTracker', e.target.value)}
                        disabled={!isPro}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer avec boutons */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? onClose : handlePrevious}
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
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Créer mon lien
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
