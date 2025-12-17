import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { linkBioAPI, LinkBioPage } from '../../utils/supabase/api';
import { useAuth } from '../auth-context';
import { BioDashboard } from '../link-in-bio/bio-dashboard';

interface LinkInBioViewProps {
  onCreateBio?: () => void;
  isMobile?: boolean;
  refreshTrigger?: number;
}

type TabType = 'link-in-bio' | 'business-card';

export function LinkInBioView({ onCreateBio, isMobile = false, refreshTrigger = 0 }: LinkInBioViewProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('link-in-bio');
  const [pages, setPages] = useState<LinkBioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchPages() {
      if (!user) {
        if (mounted) setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await linkBioAPI.getPages(user.id);
        
        if (error) {
          console.error('Error fetching pages:', error);
          toast.error('Erreur lors du chargement des pages');
          return;
        }

        if (mounted && data) {
           setPages(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    fetchPages();

    return () => {
      mounted = false;
    };
  }, [user, refreshTrigger]);

  const tabs = [
    {
      id: 'link-in-bio' as TabType,
      label: 'Link in bio',
    },
    {
      id: 'business-card' as TabType,
      label: 'Business card',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Tabs Navigation - Sticky */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-3">
        <div className="grid grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative py-4 px-0 transition-all duration-200 flex items-center justify-center
                ${activeTab === tab.id 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>
              
              {/* Bordure inférieure pour l'onglet actif */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006EF7]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`${isMobile ? 'px-4 py-6' : 'p-8'}`}>

        {/* Content basé sur l'onglet actif */}
        {activeTab === 'link-in-bio' ? (
          <>
            {/* Loading State */}
            {loading && !initialized ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : pages.length > 0 ? (
              // If user has a page, show the Dashboard
              // Removed invalid 'page' prop
              <BioDashboard />
            ) : (
              // Empty State -> Create Flow
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                  <Plus className="w-12 h-12 text-gray-400 opacity-50" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2 text-xl font-semibold">
                  Créez votre Link in Bio
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-8">
                  Regroupez tous vos liens importants sur une seule page magnifique et facile à partager.
                </p>
                <Button
                  onClick={onCreateBio}
                  className="bg-[#006EF7] hover:bg-[#0056c7] text-white h-12 px-8 rounded-xl text-lg shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Button>
              </div>
            )}
          </>
        ) : (
          // Business card tab content
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
              <Plus className="w-12 h-12 text-gray-400 opacity-50" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">
              Business Cards
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
              Fonctionnalité à venir...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
