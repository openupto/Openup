import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useAuth } from './auth-context';
import { DesignSystem, DesignConfig } from './design-system';
import { toast } from 'sonner@2.0.3';
import { 
  User, 
  Crown, 
  Users, 
  Shield, 
  Trash2, 
  Globe,
  CreditCard,
  Check,
  Zap,
  Palette
} from 'lucide-react';
import { cn } from './ui/utils';

interface SettingsProps {
  userData: any;
  onUpdateUserData: (data: any) => void;
}

export function Settings({ userData, onUpdateUserData }: SettingsProps) {
  const { signOut } = useAuth();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
  });

  // Design configuration state
  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    theme: 'minimal',
    layout: 'standard',
    template: 'beast-style',
    colorScheme: {
      background: '#ffffff',
      text: '#000000',
      accent: '#3399ff',
      buttonBg: '#3399ff',
      buttonText: '#ffffff'
    },
    typography: {
      fontFamily: 'inter',
      fontSize: 16,
      lineHeight: 1.5
    },
    spacing: {
      cardSpacing: 16,
      borderRadius: 12
    },
    animations: true,
    gradient: false
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleDeleteAccount = async () => {
    toast.success('Account deletion request submitted');
    setShowDeleteAccount(false);
  };

  const handleUpgrade = (plan: string) => {
    toast.info(`Redirecting to ${plan} plan checkout...`);
    // In a real app, this would redirect to Stripe checkout
  };

  const getSubscriptionBadge = (tier: string) => {
    const badges = {
      free: { label: 'Free', variant: 'secondary' as const, color: 'bg-gray-100' },
      starter: { label: 'Starter', variant: 'default' as const, color: 'bg-blue-100' },
      pro: { label: 'Pro', variant: 'default' as const, color: 'bg-blue-100' },
      premium: { label: 'Premium', variant: 'default' as const, color: 'bg-blue-200' },
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const planLimits = {
    free: { 
      links: 5, 
      analytics: 'Basic', 
      qr: 'Standard', 
      features: ['5 liens maximum', 'Analytics de base', 'QR codes standard', 'Support communautaire'],
      price: { monthly: 0, annual: 0 }
    },
    starter: { 
      links: 50, 
      analytics: 'Advanced', 
      qr: 'Custom', 
      features: ['50 liens', 'Slugs personnalisés', 'Protection par mot de passe', 'QR codes personnalisés', 'Analytics avancées'],
      price: { monthly: 12, annual: 119 }
    },
    pro: { 
      links: 500, 
      analytics: 'Real-time', 
      qr: 'Branded', 
      features: ['500 liens', 'UTM tracking', 'Expiration de liens', 'Limites de clics', '10 membres d\'équipe', 'Analytics temps réel', 'Routage intelligent'],
      price: { monthly: 23, annual: 229 }
    },
    premium: { 
      links: 'Unlimited', 
      analytics: 'Advanced', 
      qr: 'White-label', 
      features: ['Liens illimités', 'Support prioritaire', 'Membres d\'équipe illimités', 'QR codes white-label', 'Accès API', 'Domaines personnalisés'],
      price: { monthly: 40, annual: 399 }
    },
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations du profil</span>
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de compte et préférences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-gradient-to-r from-violet-600 to-purple-600">
                  Mettre à jour le profil
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Langue et Région</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Langue</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <Label>Fuseau horaire</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <DesignSystem
            designConfig={designConfig}
            onConfigChange={setDesignConfig}
            onPreview={() => {
              toast.success('Aperçu mis à jour !');
              // Ici vous pouvez déclencher une mise à jour de l'aperçu
            }}
            userTier={userData?.subscription_tier || 'free'}
          />
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Plan Actuel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSubscriptionBadge(userData?.subscription_tier).color}`}>
                    <Crown className="w-6 h-6 text-[#3399ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{userData?.subscription_tier} Plan</h3>
                    <p className="text-sm text-slate-600">
                      {userData?.links_count || 0} / {planLimits[userData?.subscription_tier as keyof typeof planLimits]?.links} links used
                    </p>
                  </div>
                </div>
                <Badge {...getSubscriptionBadge(userData?.subscription_tier)}>
                  {getSubscriptionBadge(userData?.subscription_tier).label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-4">
                <span className={cn("text-sm", billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground')}>
                  Mensuel
                </span>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "relative w-16 h-8 rounded-full p-0 transition-colors",
                      billingCycle === 'annual' ? 'bg-[#3399ff] border-[#3399ff]' : 'bg-gray-200'
                    )}
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  >
                    <div className={cn(
                      "absolute w-6 h-6 bg-white rounded-full transition-transform",
                      billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                    )} />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn("text-sm", billingCycle === 'annual' ? 'font-medium' : 'text-muted-foreground')}>
                    Annuel
                  </span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    -20%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Free Plan */}
            <Card className={userData?.subscription_tier === 'free' ? 'border-[#3399ff] bg-blue-50/50' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">Gratuit</CardTitle>
                <div className="text-2xl font-bold">
                  0€
                  <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {planLimits.free.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {userData?.subscription_tier === 'free' ? (
                  <Badge className="w-full mt-4 justify-center bg-[#3399ff]">Plan actuel</Badge>
                ) : (
                  <Button variant="outline" className="w-full mt-4" onClick={() => handleUpgrade('free')}>
                    Rétrograder
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className={userData?.subscription_tier === 'starter' ? 'border-[#3399ff] bg-blue-50/50' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">Starter</CardTitle>
                <div className="text-2xl font-bold">
                  {billingCycle === 'monthly' ? '9€' : '7€'}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mois' : 'mois'}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="text-xs text-muted-foreground">
                    Facturé 84€ par an
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {planLimits.starter.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {userData?.subscription_tier === 'starter' ? (
                  <Badge className="w-full mt-4 justify-center bg-[#3399ff]">Plan actuel</Badge>
                ) : (
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-[#3399ff] to-blue-600" 
                    onClick={() => handleUpgrade('starter')}
                  >
                    {userData?.subscription_tier === 'free' ? 'Passer au Starter' : 'Changer de plan'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={userData?.subscription_tier === 'pro' ? 'border-[#3399ff] bg-blue-50/50' : 'border-[#3399ff] shadow-lg'}>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-[#3399ff] text-white">Le plus populaire</Badge>
                <CardTitle className="text-lg">Pro</CardTitle>
                <div className="text-2xl font-bold">
                  {billingCycle === 'monthly' ? '29€' : '23€'}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mois' : 'mois'}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="text-xs text-muted-foreground">
                    Facturé 276€ par an
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {planLimits.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {userData?.subscription_tier === 'pro' ? (
                  <Badge className="w-full mt-4 justify-center bg-[#3399ff]">Plan actuel</Badge>
                ) : (
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-[#3399ff] to-blue-600" 
                    onClick={() => handleUpgrade('pro')}
                  >
                    {['free', 'starter'].includes(userData?.subscription_tier) ? 'Passer au Pro' : 'Changer de plan'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className={userData?.subscription_tier === 'premium' ? 'border-[#3399ff] bg-blue-50/50' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">Premium</CardTitle>
                <div className="text-2xl font-bold">
                  {billingCycle === 'monthly' ? '99€' : '79€'}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mois' : 'mois'}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="text-xs text-muted-foreground">
                    Facturé 948€ par an
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {planLimits.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {userData?.subscription_tier === 'premium' ? (
                  <Badge className="w-full mt-4 justify-center bg-[#3399ff]">Plan actuel</Badge>
                ) : (
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-[#3399ff] to-blue-600" 
                    onClick={() => handleUpgrade('premium')}
                  >
                    Passer au Premium
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Team Management</span>
              </CardTitle>
              <CardDescription>
                Invite team members and manage permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {['free', 'starter'].includes(userData?.subscription_tier) ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Team Features Available in Pro+</h3>
                  <p className="text-slate-600 mb-4">
                    Upgrade to Pro or Premium to invite team members and collaborate on links.
                  </p>
                  <Button onClick={() => handleUpgrade('pro')} className="bg-gradient-to-r from-[#3399ff] to-blue-600">
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input placeholder="Enter email address" className="flex-1" />
                    <Button>Send Invite</Button>
                  </div>
                  <div className="text-sm text-slate-600">
                    Team members: 0 / {userData?.subscription_tier === 'pro' ? '10' : 'Unlimited'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Change Password</h4>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                  <Button>Update Password</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-red-800">Delete Account</h5>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={() => setShowDeleteAccount(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your links, analytics data, and account information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}