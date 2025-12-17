import { ArrowLeft, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

interface HelpPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

export function HelpPage({ onBack, isMobile = false }: HelpPageProps) {
  const handleSubmit = () => {
    toast.success('Message envoyé ! Notre équipe vous répondra sous 24h.');
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'support@openup.com',
      action: 'Envoyer un email'
    },
    {
      icon: MessageCircle,
      title: 'Chat en direct',
      description: 'Disponible 9h-18h',
      action: 'Démarrer le chat'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      description: '+33 1 23 45 67 89',
      action: 'Appeler'
    }
  ];

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} bg-white dark:bg-gray-900 min-h-full`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-gray-900 dark:text-white">Besoin d'aide ?</h1>
      </div>

      {/* Moyens de contact */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-4 mb-8`}>
        {contactMethods.map((method, index) => (
          <Card
            key={index}
            className="p-6 bg-gray-50 dark:bg-gray-800 border-0 text-center"
          >
            <div className="w-12 h-12 bg-[#3399ff]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <method.icon className="w-6 h-6 text-[#3399ff]" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              {method.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {method.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg"
              onClick={() => toast.info(method.action)}
            >
              {method.action}
            </Button>
          </Card>
        ))}
      </div>

      {/* Formulaire de contact */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0">
        <h3 className="text-gray-900 dark:text-white mb-4">
          Envoyez-nous un message
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              placeholder="Comment pouvons-nous vous aider ?"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre problème ou votre question..."
              className="mt-2 min-h-[150px]"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#3399ff] hover:bg-[#2680e6] text-white rounded-xl h-12"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer le message
          </Button>
        </div>
      </Card>

      {/* FAQ rapide */}
      <div className="mt-8">
        <h3 className="text-gray-900 dark:text-white mb-4">
          Questions fréquentes
        </h3>
        <div className="space-y-3">
          {[
            'Comment créer un lien raccourci ?',
            'Comment personnaliser mon QR Code ?',
            'Comment utiliser Link in Bio ?',
            'Comment upgrader mon abonnement ?'
          ].map((question, index) => (
            <button
              key={index}
              className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="text-gray-900 dark:text-white">{question}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
