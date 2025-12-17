import { ArrowLeft, Bell, Globe, Lock, Mail, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface ParametersPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

export function ParametersPage({ onBack, isMobile = false }: ParametersPageProps) {
  const handleSave = () => {
    toast.success('Paramètres sauvegardés');
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
        <h1 className="text-gray-900 dark:text-white">Paramètres</h1>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Notifications */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#3399ff]" />
            <h3 className="text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir les mises à jour par email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes de sécurité</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Être alerté des activités suspectes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir les actualités OpenUp
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Langue et région */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-[#3399ff]" />
            <h3 className="text-gray-900 dark:text-white">Langue et région</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fuseau horaire</Label>
              <Select defaultValue="paris">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paris">Paris (GMT+1)</SelectItem>
                  <SelectItem value="london">London (GMT+0)</SelectItem>
                  <SelectItem value="newyork">New York (GMT-5)</SelectItem>
                  <SelectItem value="tokyo">Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Sécurité */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#3399ff]" />
            <h3 className="text-gray-900 dark:text-white">Sécurité</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sécurisez votre compte avec 2FA
                </p>
              </div>
              <Switch />
            </div>
            <Button
              variant="outline"
              className="w-full rounded-xl"
            >
              <Lock className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
          </div>
        </Card>

        {/* Bouton Enregistrer */}
        <Button
          onClick={handleSave}
          className="w-full bg-[#3399ff] hover:bg-[#2680e6] text-white rounded-xl h-12"
        >
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
