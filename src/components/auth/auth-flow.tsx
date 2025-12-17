import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Link as LinkIcon, 
  Layers, 
  Smartphone,
  Mail,
  Lock,
  User,
  ChevronLeft,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '../../utils/supabase/api';
import { toast } from 'sonner@2.0.3';

const IMAGES = {
  links: "https://images.unsplash.com/photo-1759724369762-376e0a29478b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  mobile: "https://images.unsplash.com/photo-1589561143018-62df35971405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  analytics: "https://images.unsplash.com/photo-1671750764695-10c7f164844c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
};

type ViewState = 'welcome' | 'onboarding' | 'signup' | 'login' | 'success';

export function AuthFlow({ initialView = 'welcome' }: { initialView?: ViewState }) {
  const [view, setView] = useState<ViewState>(initialView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A5BFF] to-[#7CCBFF] text-slate-900 font-sans overflow-x-hidden relative flex items-center justify-center p-4">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#004ecb]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md md:max-w-4xl relative z-10 perspective-1000">
        <AnimatePresence mode="wait">
          {view === 'welcome' && <WelcomeScreen key="welcome" onNavigate={setView} />}
          {view === 'onboarding' && <OnboardingScreen key="onboarding" onNavigate={setView} />}
          {view === 'signup' && <SignUpFlow key="signup" onNavigate={setView} />}
          {view === 'login' && <LoginScreen key="login" onNavigate={setView} />}
          {view === 'success' && <SuccessScreen key="success" onNavigate={setView} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- 1. Welcome Screen ---

function WelcomeScreen({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto border border-white/50"
    >
      <div className="w-16 h-16 bg-[#0A5BFF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
        <LinkIcon className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
        Un seul lien pour tout partager
      </h1>
      <p className="text-slate-600 text-lg mb-8 leading-relaxed">
        Créez des liens intelligents, une bio link personnalisée et analysez vos performances.
      </p>

      <div className="space-y-4 mb-8 text-left max-w-xs mx-auto">
        {[
          { icon: LinkIcon, text: "Liens intelligents" },
          { icon: Layers, text: "Bio link personnalisée" },
          { icon: BarChart3, text: "Statistiques en temps réel" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0A5BFF]">
              <item.icon className="w-4 h-4" />
            </div>
            {item.text}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Button 
          size="lg" 
          onClick={() => onNavigate('onboarding')}
          className="w-full h-12 rounded-xl bg-[#0A5BFF] hover:bg-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
        >
          Commencer gratuitement
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('login')}
          className="w-full text-slate-500 hover:text-[#0A5BFF] hover:bg-blue-50 font-medium"
        >
          Se connecter
        </Button>
      </div>
    </motion.div>
  );
}

// --- 2. Onboarding Screen ---

function OnboardingScreen({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Créez vos liens en quelques secondes",
      desc: "Raccourcissez vos URLs, créez des QR codes et gérez tout depuis un seul dashboard.",
      image: IMAGES.links,
      icon: LinkIcon
    },
    {
      title: "Partagez partout",
      desc: "Instagram, TikTok, QR Code, domaine personnalisé… Un lien pour tout.",
      image: IMAGES.mobile,
      icon: Smartphone
    },
    {
      title: "Analysez ce qui fonctionne",
      desc: "Suivez vos clics et performances en temps réel.",
      image: IMAGES.analytics,
      icon: BarChart3
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onNavigate('signup');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row h-[600px] md:h-[500px]"
    >
      {/* Image Side */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-slate-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={step}
            src={slides[step].image}
            alt="Slide"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white relative">
        <Button 
           variant="ghost" 
           size="sm"
           onClick={() => onNavigate('welcome')}
           className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          Fermer
        </Button>

        <div className="mt-4 md:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#0A5BFF] mb-6">
                {React.createElement(slides[step].icon, { className: "w-6 h-6" })}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {slides[step].title}
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                {slides[step].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#0A5BFF]' : 'w-2 bg-slate-200'}`} 
              />
            ))}
          </div>
          <Button 
            onClick={handleNext}
            className="rounded-full px-8 bg-[#0A5BFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
          >
            {step === slides.length - 1 ? "Créer mon compte" : "Suivant"}
            {step !== slides.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// --- 3. Sign Up Flow (2 Steps) ---

function SignUpFlow({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.email) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.password) return;

    setIsLoading(true);
    try {
      const { error } = await authAPI.signUp(formData.email, formData.password, formData.name);
      if (error) throw error;
      onNavigate('success');
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'inscription");
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    return strength; // 0-3
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColor = strength === 0 ? 'bg-slate-200' : strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-md mx-auto relative overflow-hidden"
    >
      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
        <div 
          className="h-full bg-[#0A5BFF] transition-all duration-500" 
          style={{ width: `${(step / 3) * 100}%` }} // Step 1=33%, 2=66%, Success=100% implicitly
        />
      </div>

      <div className="mb-8 mt-2">
        <h2 className="text-2xl font-bold text-slate-900">
          {step === 1 ? "Bienvenue sur OpenUp 👋" : "Presque terminé ✨"}
        </h2>
        <p className="text-slate-500 mt-1">
          {step === 1 ? "Créez votre compte gratuitement" : `Étape ${step} sur 3`}
        </p>
      </div>

      <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-10 h-12 bg-white border-slate-200 focus:ring-[#0A5BFF] focus:border-[#0A5BFF] rounded-xl text-base"
                    autoFocus
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center pt-2">
                Aucun spam. Désinscription possible à tout moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-5"
            >
              {/* Auto Generated Avatar Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold text-[#0A5BFF]">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="w-8 h-8 opacity-50" />}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nom complet</label>
                <Input 
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 bg-white border-slate-200 focus:ring-[#0A5BFF] focus:border-[#0A5BFF] rounded-xl text-base"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pl-10 pr-10 h-12 bg-white border-slate-200 focus:ring-[#0A5BFF] focus:border-[#0A5BFF] rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength Indicator */}
                <div className="flex gap-1 h-1 mt-2">
                   <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? strengthColor : 'bg-slate-100'}`} />
                   <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? strengthColor : 'bg-slate-100'}`} />
                   <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? strengthColor : 'bg-slate-100'}`} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#0A5BFF] hover:bg-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (step === 1 ? "Continuer" : "Créer mon compte")}
          </Button>
        </div>
      </form>
      
      {step === 1 && (
         <div className="mt-6 text-center">
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm text-slate-500 hover:text-[#0A5BFF] font-medium"
            >
              Déjà un compte ? Se connecter
            </button>
         </div>
      )}
      {step === 2 && (
         <div className="mt-6 text-center">
            <button 
              onClick={() => setStep(1)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
         </div>
      )}
    </motion.div>
  );
}

// --- 4. Success Screen ---

function SuccessScreen({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  // Simulate redirect delay or just show the button
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-center max-w-sm mx-auto"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Votre espace OpenUp est prêt 🚀
      </h2>
      <p className="text-slate-500 mb-8">
        Bienvenue à bord ! Voici ce qui vous attend :
      </p>

      <div className="space-y-4 mb-8 text-left bg-slate-50 p-6 rounded-2xl">
        {[
          "Créez vos liens",
          "Personnalisez votre bio",
          "Analysez vos clics"
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="flex items-center gap-3 text-slate-700 font-medium"
          >
             <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✔</div>
             {item}
          </motion.div>
        ))}
      </div>

      <Button 
        onClick={() => {
            // Force reload to pick up auth session or simple redirect
            window.location.href = '/dashboard';
        }}
        className="w-full h-12 rounded-xl bg-[#0A5BFF] hover:bg-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25"
      >
        Accéder à mon dashboard
      </Button>
    </motion.div>
  );
}

// --- 5. Login Screen ---

function LoginScreen({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    console.log("login start");

    try {
      // Timeout Helper
      const withTimeout = <T,>(promise: Promise<T>, ms = 10000): Promise<T> => {
          return Promise.race([
            promise,
            new Promise<T>((_, reject) =>
              setTimeout(() => reject(new Error("TIMEOUT")), ms)
            ),
          ]);
      };

      // 1. Sign In
      const { data, error: signInError } = await withTimeout(
          authAPI.signIn(email, password), 
          10000
      );
      
      console.log("login success session:", data?.session);
      console.log("login error:", signInError);

      if (signInError) throw signInError;
      if (!data?.session) throw new Error("No session returned");

      // 2. Verify Session
      const { data: sessionData } = await authAPI.getCurrentUser();
      
      if (!sessionData?.session) {
          throw new Error("Session missing after login");
      }

      toast.success("Bon retour !");
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error("Login caught error:", err);
      let msg = "Email ou mot de passe incorrect";
      
      if (err.message === "TIMEOUT") {
          msg = "Connexion impossible. Vérifie ta connexion internet et réessaie.";
      } else if (err.message?.includes("Network")) {
          msg = "Erreur réseau. Vérifiez votre connexion.";
      } else if (err.message === "No session returned" || err.message === "Session missing after login") {
          msg = "Erreur de session. Veuillez réessayer.";
      }
      
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Bon retour 👋</h2>
        <p className="text-slate-500 mt-1">Connectez-vous à votre compte OpenUp</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input 
              type="email" 
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
              disabled={isLoading}
              className="h-12 bg-white border-slate-200 focus:ring-[#0A5BFF] focus:border-[#0A5BFF] rounded-xl"
            />
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <a href="/forgot-password" className="text-xs text-[#0A5BFF] hover:underline">Mot de passe oublié ?</a>
            </div>
            <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  required
                  disabled={isLoading}
                  className="pr-10 h-12 bg-white border-slate-200 focus:ring-[#0A5BFF] focus:border-[#0A5BFF] rounded-xl"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
            </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#0A5BFF] hover:bg-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Se connecter"}
        </Button>
      </form>

      <div className="mt-8 text-center bg-slate-50/50 -mx-10 -mb-10 p-6 rounded-b-3xl border-t border-slate-100">
        <p className="text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <button 
            onClick={() => onNavigate('signup')}
            disabled={isLoading}
            className="text-[#0A5BFF] font-semibold hover:underline disabled:opacity-50"
          >
            Créer un compte gratuitement
          </button>
        </p>
      </div>
    </motion.div>
  );
}
