import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { linkBioAPI, LinkBioPage, LinkBioLink, LinkBioTheme } from '../utils/supabase/api';
import { toast } from 'sonner@2.0.3';

interface LinkBioContextType {
  // State
  page: LinkBioPage | null;
  links: LinkBioLink[];
  theme: LinkBioTheme | null;
  loading: boolean;
  
  // Actions
  createPage: (username: string) => Promise<boolean>;
  updatePage: (updates: Partial<LinkBioPage>) => Promise<void>;
  
  addLink: (title: string, url: string) => Promise<void>;
  updateLink: (id: string, updates: Partial<LinkBioLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (links: LinkBioLink[]) => Promise<void>;
  
  saveTheme: (updates: Partial<LinkBioTheme>) => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
}

const LinkBioContext = createContext<LinkBioContextType | undefined>(undefined);

export function LinkBioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [page, setPage] = useState<LinkBioPage | null>(null);
  const [links, setLinks] = useState<LinkBioLink[]>([]);
  const [theme, setTheme] = useState<LinkBioTheme | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize
  useEffect(() => {
    if (!user) {
      setPage(null);
      setLinks([]);
      setTheme(null);
      setLoading(false);
      return;
    }

    refreshAll();
  }, [user]);

  const refreshAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Get Page
      const { data: pageData } = await linkBioAPI.getPage(user.id);
      
      if (pageData) {
        setPage(pageData);
        
        // 2. Get Links
        const { data: linksData } = await linkBioAPI.getLinks(pageData.id);
        if (linksData) setLinks(linksData);
        
        // 3. Get Theme
        const { data: themeData } = await linkBioAPI.getTheme(pageData.id);
        if (themeData) setTheme(themeData);
      } else {
        setPage(null);
      }
    } catch (e) {
      console.error('Error fetching Link Bio data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const createPage = async (username: string) => {
    if (!user) return false;
    
    // Check uniqueness
    const exists = await linkBioAPI.checkUsername(username);
    if (exists) {
      toast.error('Ce nom d\'utilisateur est déjà pris.');
      return false;
    }

    const { data, error } = await linkBioAPI.createPage(user.id, username);
    if (error) {
      toast.error('Erreur lors de la création de la page');
      return false;
    }
    
    toast.success('Page créée avec succès !');
    await refreshAll();
    return true;
  };

  const updatePage = async (updates: Partial<LinkBioPage>) => {
    if (!page) return;
    
    // Optimistic
    setPage({ ...page, ...updates });
    
    const { error } = await linkBioAPI.updatePage(page.id, updates);
    if (error) {
      toast.error('Erreur de sauvegarde');
      refreshAll(); // revert
    }
  };

  const addLink = async (title: string, url: string) => {
    if (!page) return;
    
    const { error } = await linkBioAPI.createLink(page.id, { title, url });
    if (error) {
      toast.error('Erreur lors de l\'ajout du lien');
      return;
    }
    
    // Refresh to get ID and position
    const { data: newLinks } = await linkBioAPI.getLinks(page.id);
    if (newLinks) setLinks(newLinks);
    toast.success('Lien ajouté');
  };

  const updateLink = async (id: string, updates: Partial<LinkBioLink>) => {
    // Optimistic
    setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
    
    const { error } = await linkBioAPI.updateLink(id, updates);
    if (error) {
      toast.error('Erreur de mise à jour');
      // No full refresh needed usually, maybe revert?
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return;

    // Optimistic
    setLinks(links.filter(l => l.id !== id));
    
    const { error } = await linkBioAPI.deleteLink(id);
    if (error) {
      toast.error('Erreur lors de la suppression');
      const { data: newLinks } = await linkBioAPI.getLinks(page!.id);
      if (newLinks) setLinks(newLinks);
    }
  };

  const reorderLinks = async (updatedLinks: LinkBioLink[]) => {
    // Optimistic update
    setLinks(updatedLinks);
    
    const ids = updatedLinks.map(l => l.id);
    await linkBioAPI.reorderLinks(ids);
  };

  const saveTheme = async (updates: Partial<LinkBioTheme>) => {
    if (!page) return;
    
    // Optimistic
    if (theme) {
      setTheme({ ...theme, ...updates });
    }
    
    const { error } = await linkBioAPI.updateTheme(page.id, updates);
    if (error) {
      console.error(error);
      toast.error('Erreur lors de la sauvegarde du thème');
    }
  };

  const checkUsername = async (username: string) => {
    return await linkBioAPI.checkUsername(username);
  };

  return (
    <LinkBioContext.Provider value={{
      page,
      links,
      theme,
      loading,
      createPage,
      updatePage,
      addLink,
      updateLink,
      deleteLink,
      reorderLinks,
      saveTheme,
      checkUsername
    }}>
      {children}
    </LinkBioContext.Provider>
  );
}

export function useLinkBio() {
  const context = useContext(LinkBioContext);
  if (context === undefined) {
    throw new Error('useLinkBio must be used within a LinkBioProvider');
  }
  return context;
}
