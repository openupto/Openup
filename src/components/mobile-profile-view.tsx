import React, { useState } from 'react';
import { 
  Crown,
  Share2,
  FileText,
  User,
  Settings,
  Moon,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { MobileSubscriptionEditor } from './mobile-subscription-editor';
import { UserAvatar } from './user-avatar';

interface MobileProfileViewProps {
  userData: any;
  onBack?: () => void;
}

export function MobileProfileView({ userData, onBack }: MobileProfileViewProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showSubscriptionEditor, setShowSubscriptionEditor] = useState(false);

  const subscriptionTier = userData?.subscription_tier || 'starter';
  const getBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'business':
        return 'bg-purple-500 hover:bg-purple-500';
      case 'pro':
        return 'bg-blue-500 hover:bg-blue-500';
      case 'starter':
      default:
        return 'bg-orange-500 hover:bg-orange-500';
    }
  };

  const getBadgeLabel = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'business':
        return 'Business';
      case 'pro':
        return 'Pro';
      case 'starter':
      default:
        return 'Starter';
    }
  };

  const handleLogout = () => {
    // Handle logout
    console.log('Logout');
  };

  // Show subscription editor if open
  if (showSubscriptionEditor) {
    const currentPlan = subscriptionTier.toLowerCase() === 'business' ? 'pro' : subscriptionTier.toLowerCase() as 'free' | 'starter' | 'pro';
    return (
      <MobileSubscriptionEditor 
        onClose={() => setShowSubscriptionEditor(false)}
        currentPlan={currentPlan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
        {/* Profile Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 flex-shrink-0">
            <UserAvatar 
              user={userData}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">{userData?.name || 'Mike Johnson'}</h2>
            <button onClick={() => setShowSubscriptionEditor(true)} className="inline-block">
              <Badge className={`${getBadgeColor(subscriptionTier)} text-white px-3 py-0.5 rounded text-xs cursor-pointer hover:opacity-90 transition-opacity active:scale-95`}>
                👑 {getBadgeLabel(subscriptionTier)}
              </Badge>
            </button>
          </div>
        </div>

        {/* Upgrade Button */}
        <button 
          onClick={() => setShowSubscriptionEditor(true)}
          className="w-full bg-[#006EF7] hover:bg-[#0056c7] text-white h-14 rounded-xl transition-colors flex items-center justify-center gap-2 touch-target"
        >
          <Crown className="w-4 h-4" />
          <span className="uppercase">Upgrade</span>
        </button>

        {/* Outils Section */}
        <div>
          <p className="text-xs text-gray-500 mb-3 px-1">Outils</p>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Domaine personnalisé</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Intégrations</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Compte Section */}
        <div>
          <p className="text-xs text-gray-500 mb-3 px-1">Compte</p>
          <div className="space-y-1">
            <button 
              onClick={() => setShowSubscriptionEditor(true)}
              className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Abonnements</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Facturation</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Profil</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Paramètre</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Affichage Section */}
        <div>
          <p className="text-xs text-gray-500 mb-3 px-1">Affichage</p>
          <div className="space-y-1">
            <div className="w-full flex items-center justify-between px-3 py-3.5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Mode sombre</span>
              </div>
              <Switch 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <p className="text-xs text-gray-500 mb-3 px-1">Contact</p>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">Besoin d'aide ?</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-gray-900">FAQ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-3.5 rounded-xl transition-colors"
        >
          Déconnexion
        </button>

        {/* Footer */}
        <div className="text-center space-y-1 pt-4 pb-4">
          <p className="text-sm text-gray-900">Mention légal</p>
          <p className="text-xs text-gray-400">Version 1</p>
        </div>
      </div>
    </div>
  );
}
