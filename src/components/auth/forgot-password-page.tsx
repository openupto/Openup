import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabase/client';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email invalide');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Erreur lors de l\'envoi de l\'email');
      } else {
        setEmailSent(true);
        toast.success('Email de réinitialisation envoyé !');
      }
    } catch (error: any) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/login';
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
            {!emailSent ? (
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#006EF7]" />
                  </div>
                  <h1 className="text-3xl">
                    Mot de passe oublié ?
                  </h1>
                  <p className="text-gray-500">
                    Pas de problème ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                      onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                      className="w-full h-14 px-4 bg-gray-50 border-0 rounded-xl text-base"
                      autoFocus
                    />
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    className="w-full h-14 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white rounded-xl text-base shadow-lg transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center text-sm">
                    <a href="/login" className="text-[#006EF7] hover:underline">
                      ← Retour à la connexion
                    </a>
                  </div>
                </div>
              </>
            ) : (
              /* Success Message */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl">Email envoyé !</h2>
                <p className="text-gray-500">
                  Nous avons envoyé un lien de réinitialisation à <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>

                <div className="pt-4">
                  <Button
                    onClick={() => window.location.href = '/login'}
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                  >
                    Retour à la connexion
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  Vous n'avez pas reçu l'email ?{' '}
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      handleResetPassword();
                    }}
                    className="text-[#006EF7] hover:underline"
                  >
                    Renvoyer
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
