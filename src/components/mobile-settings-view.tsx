import React from 'react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { MobileHeader } from './mobile-header';
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  LogOut,
  ChevronRight,
  Crown
} from 'lucide-react';
import { UserAvatar } from './user-avatar';

interface MobileSettingsViewProps {
  userData: any;
  onMenuOpen: () => void;
}

export function MobileSettingsView({ userData, onMenuOpen }: MobileSettingsViewProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <MobileHeader 
        onMenuOpen={onMenuOpen}
        subscriptionTier={userData?.subscription_tier || 'starter'}
      />

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto no-scrollbar">
      {/* Profile Card */}
      <Card className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar 
            user={userData} 
            className="w-16 h-16"
            fallbackClassName="text-xl"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{userData?.name || 'Demo User'}</h3>
            <p className="text-sm text-gray-600">{userData?.email || 'demo@openup.com'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
          <Crown className="w-5 h-5 text-orange-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Plan {userData?.subscription_tier || 'Starter'}</p>
            <p className="text-xs text-gray-600">Passer à Pro pour débloquer plus de fonctionnalités</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Card>

      {/* Account Settings */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wide">Compte</h3>
        
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#0066ff]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Profil</p>
                <p className="text-xs text-gray-500">Modifier vos informations</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="h-px bg-gray-100" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Sécurité</p>
                <p className="text-xs text-gray-500">Mot de passe et authentification</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </Card>
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wide">Notifications</h3>
        
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Notifications push</p>
                <p className="text-xs text-gray-500">Recevoir des alertes</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="h-px bg-gray-100" />
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Emails hebdomadaires</p>
                <p className="text-xs text-gray-500">Rapport d'activité</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>
      </div>

      {/* Appearance */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wide">Apparence</h3>
        
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Thème</p>
                <p className="text-xs text-gray-500">Clair</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="h-px bg-gray-100" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#0066ff]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Langue</p>
                <p className="text-xs text-gray-500">Français</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </Card>
      </div>

      {/* Billing */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wide">Facturation</h3>
        
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Abonnement</p>
                <p className="text-xs text-gray-500">Gérer votre abonnement</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </Card>
      </div>

      {/* Logout */}
      <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-red-600">Déconnexion</p>
            </div>
          </div>
        </button>
      </Card>

      {/* Version */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">OpenUp v1.0.0</p>
      </div>
      </div>
    </div>
  );
}
