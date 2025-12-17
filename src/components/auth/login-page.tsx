import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../auth-context';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email invalide');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Email ou mot de passe incorrect');
      } else {
        toast.success('Connexion réussie !');
        // Explicit redirect as requested
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      // ALWAYS reset loading state
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006EF7] via-[#4A9FFF] to-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
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
              <h1 className="text-3xl font-bold text-gray-900">
                Bon retour ! 
                <span className="inline-block ml-2 align-bottom">
                  <svg className="w-8 h-8" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="#006EF7"/>
                    <circle cx="24" cy="24" r="16" fill="white"/>
                    <path fill="#006EF7" d="M24 14 C18 14 14 18 14 24 C14 30 18 34 24 34 C30 34 34 30 34 24 C34 18 30 14 24 14 Z M24 16 C28.4 16 32 19.6 32 24 C32 28.4 28.4 32 24 32 C19.6 32 16 28.4 16 24 C16 19.6 19.6 16 24 16 Z"/>
                    <circle cx="19" cy="22" r="2" fill="#006EF7"/>
                    <circle cx="29" cy="22" r="2" fill="#006EF7"/>
                  </svg>
                </span>
              </h1>
              <p className="text-gray-500">
                Connectez-vous à votre compte
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-4 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#006EF7] rounded-xl text-base transition-all"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  className="w-full h-14 px-4 bg-gray-50 border-gray-100 focus:bg-white focus:border-[#006EF7] rounded-xl text-base transition-all"
                  disabled={loading}
                />
              </div>

              <div className="text-right">
                <a 
                  href="/forgot-password" 
                  className={`text-sm text-[#006EF7] hover:underline ${loading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <Button
                onClick={handleSignIn}
                className="w-full h-14 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white rounded-xl text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <span className="text-gray-500">Vous n'avez pas de compte ? </span>
                <a 
                  href="/signup" 
                  className={`text-[#006EF7] hover:underline font-medium ${loading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  S'inscrire
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
