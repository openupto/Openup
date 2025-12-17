import { useState } from 'react';
import { Plus, Users, Link2, Grid3x3, BarChart3, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MobileLinkInBioCreator } from './mobile-link-in-bio-creator';
import { MobileSubscriptionEditor } from './mobile-subscription-editor';
import { MobileHeader } from './mobile-header';
import { toast } from 'sonner@2.0.3';

interface MobileLinkInBioListProps {
  onMenuOpen: () => void;
  activeBottomTab?: string;
  onBottomTabChange?: (tab: string) => void;
}

export function MobileLinkInBioList({ 
  onMenuOpen,
  activeBottomTab,
  onBottomTabChange 
}: MobileLinkInBioListProps) {
  const [activeTab, setActiveTab] = useState<'link-in-bio' | 'business-card'>('link-in-bio');
  const [showCreator, setShowCreator] = useState(false);
  const [editingBio, setEditingBio] = useState<any>(null);
  const [showSubscriptionEditor, setShowSubscriptionEditor] = useState(false);

  // Fake data for demo
  const [linkInBios, setLinkInBios] = useState([
    {
      id: 1,
      username: 'MrBeast',
      bio: 'Subscribe for crazy challenges and giveaways!',
      backgroundImage: null,
      profileImage: null,
      linksCount: 5,
      theme: 'gradient-blue',
      links: [
        {
          id: '1',
          title: 'My latest Youtube video',
          description: 'Every country on the planet competes to win $250,000! Subscribe to get Toasted',
          url: 'https://youtube.com/mrbeast',
          thumbnail: 'https://images.unsplash.com/photo-1676380362680-85260af12dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0dWJlJTIwdmlkZW8lMjB0aHVtYm5haWx8ZW58MXx8fHwxNzU5OTI5Mzk4fDA&ixlib=rb-4.1.0&q=80&w=400',
          type: 'video'
        },
        {
          id: '2',
          title: 'DONATE TO TEAMWATTER $1 IS 1 YEAR OF CLEAN WATER FOR SOMEONE IN NEED!',
          description: 'Raising $40M to give 2 million people clean water for decades',
          url: 'https://teamwater.org',
          thumbnail: 'https://images.unsplash.com/photo-1547751550-50f3f7125b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY2hhcml0eXxlbnwxfHx8fDE3NTk5ODQxMzN8MA&ixlib=rb-4.1.0&q=80&w=400',
          type: 'link'
        },
        {
          id: '3',
          title: 'TikTok',
          url: 'https://tiktok.com/@mrbeast',
          thumbnail: 'https://images.unsplash.com/photo-1594319622369-1e381d83c35c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWt0b2slMjBzb2NpYWwlMjBtZWRpYXxlbnwxfHx8fDE3NTk5NzMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=400',
          type: 'social'
        }
      ]
    },
    {
      id: 2,
      username: 'Demo Account',
      bio: 'Mon Link in Bio de test',
      backgroundImage: null,
      profileImage: null,
      linksCount: 0,
      theme: 'gradient-pink',
      links: []
    }
  ]);

  const [businessCards, setBusinessCards] = useState([]);

  const handleCreateNew = () => {
    setEditingBio(null);
    setShowCreator(true);
  };

  const handleEditBio = (bio: any) => {
    setEditingBio(bio);
    setShowCreator(true);
  };

  const handleBioComplete = (bioData: any) => {
    if (editingBio) {
      // Update existing
      setLinkInBios(linkInBios.map(bio => 
        bio.id === editingBio.id ? { ...bio, ...bioData } : bio
      ));
      toast.success('Link in bio mis à jour !');
    } else {
      // Create new
      setLinkInBios([...linkInBios, { 
        id: Date.now(), 
        ...bioData,
        linksCount: bioData.links?.length || 0
      }]);
      toast.success('Link in bio créé !');
    }
  };

  if (showSubscriptionEditor) {
    return (
      <MobileSubscriptionEditor
        onClose={() => setShowSubscriptionEditor(false)}
        currentPlan="starter"
      />
    );
  }

  if (showCreator) {
    return (
      <MobileLinkInBioCreator
        onClose={() => setShowCreator(false)}
        onComplete={handleBioComplete}
        editMode={!!editingBio}
        initialData={editingBio}
      />
    );
  }

  const getGradientClass = (theme: string) => {
    switch (theme) {
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300';
      case 'gradient-pink':
        return 'bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-300';
      default:
        return 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <MobileHeader 
        onMenuOpen={onMenuOpen}
        subscriptionTier="starter"
      />
      
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('link-in-bio')}
            className={`flex-1 py-3 text-sm relative transition-colors ${
              activeTab === 'link-in-bio'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Link in bio
            {activeTab === 'link-in-bio' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3399ff]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('business-card')}
            className={`flex-1 py-3 text-sm relative transition-colors ${
              activeTab === 'business-card'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Business card
            {activeTab === 'business-card' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3399ff]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 pt-4">
        {activeTab === 'link-in-bio' && (
          <div className="space-y-4">
            {/* Create Button */}
            <Button
              onClick={handleCreateNew}
              className="w-full bg-[#3399ff] hover:bg-[#2680e6] text-white rounded-2xl h-14 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Créer un Link in bio
            </Button>

            {/* Link in Bio Cards */}
            <div className="grid grid-cols-2 gap-3">
              {linkInBios.map((bio) => (
                <button
                  key={bio.id}
                  onClick={() => handleEditBio(bio)}
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {/* Background */}
                  <div className={`absolute inset-0 ${getGradientClass(bio.theme)}`} />

                  {/* Profile */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 bg-white rounded-full mb-3 flex items-center justify-center shadow-lg">
                      {bio.profileImage ? (
                        <img 
                          src={bio.profileImage} 
                          alt={bio.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-white text-sm text-center drop-shadow-md">
                      {bio.username}
                    </p>
                    <p className="text-white/90 text-xs mt-1">
                      {bio.linksCount} lien{bio.linksCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {linkInBios.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="mb-2 text-gray-900 dark:text-white">Aucun Link in bio</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Créez votre premier Link in bio pour commencer
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-[#3399ff] hover:bg-[#2277dd] text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer maintenant
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'business-card' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-gray-900 dark:text-white">Business Cards</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Créez des cartes de visite numériques pour Apple Wallet et Google Wallet
            </p>
            <Badge variant="secondary" className="bg-[#FFD700] text-gray-900 border-none">
              Bientôt disponible
            </Badge>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe-enhanced">
        <div className="flex items-end justify-around px-4 pt-2">
          <button
            onClick={() => onBottomTabChange?.('dashboard')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Link2 className={`w-6 h-6 ${activeBottomTab === 'dashboard' ? 'text-[#3399ff]' : 'text-gray-900 dark:text-gray-100'}`} strokeWidth={2} />
          </button>

          <button
            onClick={() => onBottomTabChange?.('link-in-bio')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Grid3x3 className={`w-6 h-6 ${activeBottomTab === 'link-in-bio' ? 'text-[#3399ff]' : 'text-gray-900 dark:text-gray-100'}`} strokeWidth={2} />
          </button>

          <button
            onClick={handleCreateNew}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] -mb-3 touch-target"
          >
            <div className="w-14 h-14 bg-[#3399ff] rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </button>

          <button
            onClick={() => onBottomTabChange?.('analytics')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <BarChart3 className={`w-6 h-6 ${activeBottomTab === 'analytics' ? 'text-[#3399ff]' : 'text-gray-900 dark:text-gray-100'}`} strokeWidth={2} />
          </button>

          <button
            onClick={() => onBottomTabChange?.('settings')}
            className="flex flex-col items-center justify-center p-2 min-w-[60px] touch-target"
          >
            <Settings className={`w-6 h-6 ${activeBottomTab === 'settings' ? 'text-[#3399ff]' : 'text-gray-900 dark:text-gray-100'}`} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
