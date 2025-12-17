import { ArrowLeft, Zap, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';

interface IntegrationsPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

export function IntegrationsPage({ onBack, isMobile = false }: IntegrationsPageProps) {
  const integrations = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatisez vos workflows',
      icon: '⚡',
      color: 'orange',
      connected: true,
      premium: false
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Suivez vos statistiques',
      icon: '📊',
      color: 'blue',
      connected: true,
      premium: false
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Notifications en temps réel',
      icon: '💬',
      color: 'purple',
      connected: false,
      premium: true
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Intégrations personnalisées',
      icon: '🔗',
      color: 'green',
      connected: false,
      premium: true
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing',
      icon: '📧',
      color: 'yellow',
      connected: false,
      premium: true
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM et marketing',
      icon: '🎯',
      color: 'orange',
      connected: false,
      premium: true
    }
  ];

  const handleToggleIntegration = (integrationId: string, currentState: boolean) => {
    if (currentState) {
      toast.success(`${integrationId} déconnecté`);
    } else {
      toast.success(`${integrationId} connecté`);
    }
  };

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
        <h1 className="text-gray-900 dark:text-white">Intégrations</h1>
      </div>

      {/* Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 mb-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-[#3399ff] mt-0.5" />
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              Connectez vos outils préférés
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatisez votre workflow et synchronisez vos données avec vos applications favorites.
            </p>
          </div>
        </div>
      </Card>

      {/* Liste des intégrations */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className={`p-5 ${
              integration.connected
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900'
                : 'bg-gray-50 dark:bg-gray-800 border-0'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-1">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.premium && !integration.connected && (
                <Badge className="bg-purple-500 hover:bg-purple-500 text-white text-xs">
                  Pro
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              {integration.connected ? (
                <Badge className="bg-green-500 hover:bg-green-500 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Connecté
                </Badge>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Non connecté
                </span>
              )}
              <Switch
                checked={integration.connected}
                onCheckedChange={(checked) => 
                  handleToggleIntegration(integration.name, integration.connected)
                }
                disabled={integration.premium && !integration.connected}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* API Keys */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0 mt-6">
        <h3 className="text-gray-900 dark:text-white mb-4">
          Clés API
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Créez des clés API pour intégrer OpenUp dans vos propres applications.
        </p>
        <Button
          variant="outline"
          className="w-full rounded-xl"
        >
          Gérer les clés API
        </Button>
      </Card>
    </div>
  );
}
