import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Input } from '../ui/input';
import { useState } from 'react';

interface FaqPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

export function FaqPage({ onBack, isMobile = false }: FaqPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Général',
      questions: [
        {
          q: "Qu'est-ce que OpenUp ?",
          a: "OpenUp est une plateforme SaaS complète qui vous permet de créer des liens raccourcis, des QR codes personnalisés, et des pages Link in Bio professionnelles pour booster votre présence en ligne."
        },
        {
          q: 'Comment commencer ?',
          a: "Créez un compte gratuit, puis cliquez sur le bouton 'Créer un lien' pour raccourcir votre première URL. Vous pouvez également créer des QR codes et des pages Link in Bio depuis le menu."
        },
        {
          q: 'OpenUp est-il gratuit ?',
          a: "Oui ! Nous offrons un plan gratuit Starter avec 5 liens et 1 QR Code. Pour des fonctionnalités avancées, consultez nos plans Pro et Business."
        }
      ]
    },
    {
      category: 'Liens raccourcis',
      questions: [
        {
          q: 'Comment créer un lien raccourci ?',
          a: "Cliquez sur 'Créer un lien', entrez votre URL longue, personnalisez l'URL courte si vous le souhaitez, puis validez. Votre lien est immédiatement actif !"
        },
        {
          q: 'Puis-je personnaliser mon lien ?',
          a: "Oui ! Avec les plans Pro et Business, vous pouvez choisir votre propre slug (ex: openup.to/monlien) et même utiliser votre propre domaine."
        },
        {
          q: 'Les liens expirent-ils ?',
          a: "Non, vos liens sont permanents tant que votre compte est actif. Vous pouvez également définir une date d'expiration pour certains liens."
        }
      ]
    },
    {
      category: 'QR Codes',
      questions: [
        {
          q: 'Comment créer un QR Code ?',
          a: "Allez dans l'onglet QR Code, cliquez sur 'Créer un QR Code', entrez votre URL, personnalisez les couleurs et le style, puis téléchargez-le en haute résolution."
        },
        {
          q: 'Puis-je personnaliser les couleurs ?',
          a: "Absolument ! Vous pouvez choisir n'importe quelle couleur, ajouter votre logo au centre, et choisir parmi plusieurs styles de design."
        },
        {
          q: 'Dans quel format puis-je télécharger ?',
          a: "Les QR codes sont disponibles en PNG, SVG, PDF et EPS pour une qualité optimale à toutes les tailles."
        }
      ]
    },
    {
      category: 'Link in Bio',
      questions: [
        {
          q: "C'est quoi Link in Bio ?",
          a: "C'est une page web personnalisée qui regroupe tous vos liens importants. Parfait pour Instagram, TikTok et autres réseaux sociaux qui ne permettent qu'un seul lien."
        },
        {
          q: 'Comment personnaliser ma page ?',
          a: "Utilisez l'éditeur visuel pour choisir un thème, modifier les couleurs, ajouter votre photo de profil, et organiser vos liens par drag & drop."
        },
        {
          q: 'Puis-je avoir plusieurs pages ?',
          a: "Oui ! Créez autant de pages Link in Bio que vous le souhaitez pour différentes campagnes ou audiences."
        }
      ]
    },
    {
      category: 'Analytics',
      questions: [
        {
          q: 'Quelles statistiques puis-je voir ?',
          a: "Vous pouvez voir le nombre de clics, la géolocalisation, les appareils utilisés, les navigateurs, les heures de pic, et bien plus encore."
        },
        {
          q: 'Les analytics sont-elles en temps réel ?',
          a: "Oui ! Les statistiques sont mises à jour en temps réel et vous pouvez les consulter à tout moment depuis le tableau de bord."
        },
        {
          q: 'Puis-je exporter les données ?',
          a: "Avec les plans Pro et Business, vous pouvez exporter vos analytics en CSV ou via notre API."
        }
      ]
    },
    {
      category: 'Abonnement et facturation',
      questions: [
        {
          q: 'Quels sont les modes de paiement acceptés ?',
          a: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) et PayPal."
        },
        {
          q: 'Puis-je annuler à tout moment ?',
          a: "Oui, vous pouvez annuler votre abonnement à tout moment. Vous conserverez l'accès jusqu'à la fin de votre période de facturation."
        },
        {
          q: 'Y a-t-il des réductions pour les paiements annuels ?',
          a: "Oui ! Économisez 20% en choisissant la facturation annuelle au lieu de mensuelle."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
        <h1 className="text-gray-900 dark:text-white">FAQ</h1>
      </div>

      {/* Recherche */}
      <div className="mb-8">
        <Input
          placeholder="Rechercher dans la FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6 max-w-3xl">
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-gray-900 dark:text-white mb-4">
              {category.category}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {category.questions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`${categoryIndex}-${index}`}
                  className="bg-gray-50 dark:bg-gray-800 border-0 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="text-gray-900 dark:text-white">
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune question ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950 rounded-xl max-w-3xl">
        <h3 className="text-gray-900 dark:text-white mb-2">
          Vous ne trouvez pas votre réponse ?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Notre équipe support est là pour vous aider !
        </p>
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-xl"
        >
          Contacter le support
        </Button>
      </div>
    </div>
  );
}
