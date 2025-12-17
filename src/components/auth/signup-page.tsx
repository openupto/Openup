import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../auth-context';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';

export function SignUpPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleContinue = () => {
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email invalide');
      return;
    }

    setStep('password');
  };

  const handleSignUp = async () => {
    if (!password || !fullName) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        toast.error(error.message || 'Erreur lors de l\'inscription');
      } else {
        toast.success('Compte créé avec succès !');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error: any) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'password') {
      setStep('email');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006EF7] via-[#4A9FFF] to-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl">
                Bienvenue ! 
                <span className="inline-block ml-2">👋</span>
              </h1>
              <p className="text-gray-500">
                Inscrivez-vous gratuitement
              </p>
            </div>

            {step === 'email' ? (
              /* Email Step */
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                    className="w-full h-14 px-4 bg-gray-50 border-0 rounded-xl text-base"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full h-14 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white rounded-xl text-base shadow-lg transition-all"
                  disabled={loading}
                >
                  Continuer
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                  <span className="text-gray-500">Vous avez déjà un compte ? </span>
                  <a href="/login" className="text-[#006EF7] hover:underline">
                    Se connecter
                  </a>
                </div>

                {/* Legal Text */}
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  En cliquant sur <span className="font-medium">Continuer</span>, vous acceptez la{' '}
                  <a href="/privacy" className="text-gray-500 hover:underline">
                    politique de confidentialité
                  </a>{' '}
                  et les{' '}
                  <a href="/terms" className="text-gray-500 hover:underline">
                    conditions générales
                  </a>{' '}
                  de OpenUp.
                </p>
              </div>
            ) : (
              /* Password Step */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <Input
                    type="text"
                    placeholder="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-14 px-4 bg-gray-50 border-0 rounded-xl text-base mb-3"
                    autoFocus
                  />
                  <Input
                    type="password"
                    placeholder="Mot de passe (min. 6 caractères)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
                    className="w-full h-14 px-4 bg-gray-50 border-0 rounded-xl text-base"
                  />
                </div>

                <Button
                  onClick={handleSignUp}
                  className="w-full h-14 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white rounded-xl text-base shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-500">Email : </span>
                  <span className="font-medium">{email}</span>
                  <button
                    onClick={() => setStep('email')}
                    className="ml-2 text-[#006EF7] hover:underline"
                  >
                    Modifier
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
