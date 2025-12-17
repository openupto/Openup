import { useState, useEffect, useCallback } from 'react';
import { Loader2, ExternalLink, Copy, ArrowLeft, ChevronDown, Settings, Palette, Link as LinkIcon, Smartphone, CheckCircle2, Eye, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { linkBioAPI, LinkBioPage, LinkBioLink, LinkBioTheme } from '../../utils/supabase/api';
import { copyToClipboard } from '../../utils/clipboard';
import { LinkInBioProfile } from '../link-in-bio-profile';
import { LinksTab } from './links-tab';
import { SettingsTab } from './settings-tab';
import { AppearanceTab } from './appearance-tab';
import { useAuth } from '../auth-context';
import { ErrorBoundary } from '../error-boundary';

interface BioPageEditorProps {
  initialPage: LinkBioPage;
  onBack: () => void;
}

export function BioPageEditor({ initialPage, onBack }: BioPageEditorProps) {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<LinkBioPage>(initialPage);
  const [allPages, setAllPages] = useState<LinkBioPage[]>([]);
  const [links, setLinks] = useState<LinkBioLink[]>([]);
  const [theme, setTheme] = useState<LinkBioTheme | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all pages for the dropdown switcher
  useEffect(() => {
    let mounted = true;
    if (user) {
      linkBioAPI.getPages(user.id).then(({ data }) => {
        if (mounted && data) setAllPages(data);
      }).catch(err => console.error("Failed to fetch pages", err));
    }
    return () => { mounted = false; };
  }, [user]);

  // Fetch data for current active page
  const refreshPageData = useCallback(async () => {
    if (!user || !activePage?.id) return;
    
    try {
      // 1. Refresh page metadata
      const { data: pageData } = await linkBioAPI.getPageById(activePage.id);
      if (pageData) setActivePage(pageData);

      // 2. Refresh links and theme
      const [linksRes, themeRes] = await Promise.all([
        linkBioAPI.getLinks(activePage.id),
        linkBioAPI.getTheme(activePage.id)
      ]);
      
      if (linksRes.data) setLinks(linksRes.data);
      
      // 3. Auto-create theme if missing
      if (!themeRes.data && !themeRes.error) {
         const defaultTheme: Partial<LinkBioTheme> = {
            page_id: activePage.id,
            background_type: 'solid',
            background_value: '#000000',
            button_style: 'rounded',
            button_color: '#ffffff',
            button_text_color: '#000000',
            font_family: 'inter',
         };
         // Attempt to create it
         await linkBioAPI.updateTheme(activePage.id, defaultTheme);
         // Optimistically set it
         // @ts-ignore
         setTheme(defaultTheme);
      } else if (themeRes.data) {
         setTheme(themeRes.data);
      } else {
        setTheme(null);
      }

    } catch (e) {
      console.error(e);
      toast.error('Erreur de chargement des données');
    }
  }, [user, activePage.id]);

  useEffect(() => {
    let mounted = true;
    setLoadingData(true);
    
    refreshPageData().finally(() => {
      if (mounted) setLoadingData(false);
    });

    return () => { mounted = false; };
  }, [refreshPageData]);

  const handleSetActive = async () => {
    if (!user) return;
    try {
      await linkBioAPI.setPageActive(activePage.id, user.id);
      toast.success('Page activée');
      // Update local state and all pages list
      setActivePage({ ...activePage, is_active: true });
      setAllPages(allPages.map(p => ({
        ...p,
        is_active: p.id === activePage.id
      })));
    } catch (e) {
      toast.error('Erreur lors de l\'activation');
    }
  };

  const handleThemeUpdate = (updates: Partial<LinkBioTheme>) => {
    if (theme) {
      setTheme({ ...theme, ...updates } as LinkBioTheme);
    }
  };

  if (!activePage) return null; // Defensive

  const publicDisplayUrl = linkBioAPI.getLinkBioPublicUrl(activePage.username);

  if (loadingData && !theme && allPages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-gray-50 dark:bg-black/20">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Mes pages
            </Button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[150px] md:min-w-[200px] justify-between">
                  <span className="truncate max-w-[100px] md:max-w-none">@{activePage.username}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {allPages.map(p => (
                  <DropdownMenuItem 
                    key={p.id} 
                    onClick={() => setActivePage(p)}
                    className="justify-between"
                  >
                    <span className={p.id === activePage.id ? "font-bold" : ""}>@{p.username}</span>
                    {p.is_active && <span className="w-2 h-2 rounded-full bg-green-500" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {activePage.is_active ? (
              <span className="hidden md:flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200 items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            ) : (
              <Button 
                size="sm" 
                variant="secondary" 
                className="hidden md:flex h-7 text-xs"
                onClick={handleSetActive}
              >
                Activer
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
             {/* Mobile Preview Button */}
             <button
                onClick={() => {
                  if (!activePage) {
                      toast.error("Sélectionne une page pour prévisualiser");
                      return;
                  }
                  setShowPreview(true);
                }}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#0A5BFF]"
                disabled={!activePage}
                style={{ opacity: !activePage ? 0.4 : 1 }}
                title="Aperçu"
             >
                <Eye className="w-5 h-5" />
             </button>

             <Button 
               variant="outline" 
               size="sm" 
               className="hidden md:flex"
               onClick={() => copyToClipboard(publicDisplayUrl, 'URL copiée')}
             >
               <Copy className="w-4 h-4 mr-2" />
               Copier l'URL
             </Button>
             <Button 
               size="sm"
               className="hidden md:flex bg-blue-600 text-white hover:bg-blue-700"
               onClick={() => window.open(publicDisplayUrl, '_blank')}
             >
               <ExternalLink className="w-4 h-4 mr-2" />
               Voir la page
             </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Editor Tabs */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
             <Tabs defaultValue="links" className="flex-1 flex flex-col">
               <div className="px-6 pt-6 bg-white dark:bg-gray-900 z-10">
                  <TabsList className="w-full justify-start h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 grid grid-cols-3">
                    <TabsTrigger value="links" className="py-2.5 gap-2">
                      <LinkIcon className="w-4 h-4" /> Liens
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="py-2.5 gap-2">
                      <Palette className="w-4 h-4" /> Apparence
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="py-2.5 gap-2">
                      <Settings className="w-4 h-4" /> Réglages
                    </TabsTrigger>
                  </TabsList>
               </div>

               <TabsContent value="links" className="flex-1 overflow-y-auto px-6 pb-20 m-0">
                  <LinksTab 
                    page={activePage} 
                    links={links} 
                    setLinks={setLinks}
                    refreshLinks={refreshPageData}
                  />
               </TabsContent>
               
               <TabsContent value="appearance" className="flex-1 overflow-y-auto m-0">
                  <AppearanceTab 
                    page={activePage}
                    theme={theme}
                    onThemeUpdate={handleThemeUpdate}
                    onPageUpdate={refreshPageData}
                  />
               </TabsContent>

               <TabsContent value="settings" className="flex-1 overflow-y-auto px-6 pb-20 m-0">
                  <SettingsTab 
                    page={activePage}
                    theme={theme}
                    onUpdate={() => {
                      refreshPageData();
                      // Also refresh all pages list in case username changed
                      if (user) linkBioAPI.getPages(user.id).then(({data}) => data && setAllPages(data));
                    }}
                  />
               </TabsContent>
             </Tabs>
          </div>

          {/* Right: Live Preview */}
          <div className="hidden lg:flex flex-col w-[420px] flex-shrink-0 bg-gray-50 dark:bg-black/30 items-center justify-center relative border-l border-gray-200 dark:border-gray-800">
             
             {/* Device Mockup */}
             <div className="relative w-[300px] h-[600px] rounded-[3rem] border-8 border-gray-900 bg-gray-900 shadow-2xl overflow-hidden z-20 ring-1 ring-black/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-30"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-white overflow-y-auto scrollbar-hide">
                  {theme && (
                    <LinkInBioProfile 
                      page={activePage}
                      links={links}
                      theme={theme}
                      previewMode={true}
                    />
                  )}
                </div>
             </div>

             <div className="absolute bottom-6 left-0 w-full text-center text-gray-400 text-sm font-medium">
               Aperçu en direct
             </div>
          </div>
        </div>

        {/* Mobile Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-black flex flex-col"
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-white/10 shrink-0 safe-area-top">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Retour
                </button>
                <span className="font-medium text-white">Aperçu</span>
                {publicDisplayUrl ? (
                     <button 
                       onClick={() => window.open(publicDisplayUrl, '_blank')}
                       className="text-white/70 hover:text-white transition-colors"
                       title="Ouvrir dans un nouvel onglet"
                     >
                       <ExternalLink className="w-5 h-5" />
                     </button>
                ) : <div className="w-5" />}
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto bg-black scrollbar-hide">
                 {theme && (
                    <LinkInBioProfile 
                       page={activePage} 
                       links={links} 
                       theme={theme} 
                       previewMode={true} 
                    />
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}