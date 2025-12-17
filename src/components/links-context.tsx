import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useApp } from './app-context';
import { linksAPI, qrCodesAPI, Link as APILink } from '../utils/supabase/api';
import { toast } from 'sonner@2.0.3';

// Extended Link interface for UI compatibility
export interface Link {
  id: string;
  title: string;
  url: string;
  shortUrl: string;
  slug?: string;
  domain: string;
  clicks: string;
  date: string;
  isActive: boolean;
  type?: string;
  previewImage?: string;
  previewTitle?: string;
  previewDescription?: string;
  password?: string;
  expirationDate?: string;
  clickLimit?: string;
  geoFilter?: string;
  utmTracker?: string;
  generateQR?: boolean;
  position?: number;
}

interface LinksContextType {
  links: Link[];
  loading: boolean;
  addLink: (link: Omit<Link, 'id' | 'clicks' | 'date' | 'isActive'>) => Promise<void>;
  updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (links: Link[]) => Promise<void>;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export function LinksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { links: apiLinks, clickCounts, refreshLinks, linksLoading, canCreateLink, currentPlan } = useApp();

  // Helper to safely get base URL
  const getBaseUrl = () => {
    try {
      // @ts-ignore
      if (import.meta && import.meta.env && import.meta.env.VITE_APP_BASE_URL) {
        // @ts-ignore
        return import.meta.env.VITE_APP_BASE_URL;
      }
    } catch (e) {
      // ignore
    }
    return 'openup.to';
  };

  const baseUrl = getBaseUrl();

  // Convert API links to UI format
  const links: Link[] = apiLinks.map(apiLink => ({
    id: apiLink.id,
    title: apiLink.title || 'Sans titre',
    url: apiLink.original_url,
    shortUrl: `${baseUrl}/${apiLink.slug}`,
    slug: apiLink.slug,
    domain: 'openup.to',
    clicks: formatClicks(clickCounts[apiLink.id] || 0),
    date: new Date(apiLink.created_at).toLocaleDateString('fr-FR'),
    isActive: apiLink.is_active, // Use is_active boolean
    type: apiLink.type,
    password: apiLink.password_hash,
    expirationDate: apiLink.expiration_date,
    clickLimit: apiLink.click_limit?.toString(),
    previewTitle: apiLink.title,
    previewDescription: '', // Description not in DB schema
    position: apiLink.position,
  }));

  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const addLink = async (linkData: Omit<Link, 'id' | 'clicks' | 'date' | 'isActive'>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un lien');
      return;
    }

    // Check plan limits
    if (!canCreateLink) {
      toast.error(`Limite atteinte. Votre plan permet ${currentPlan?.links_limit || 0} liens.`);
      return;
    }

    try {
      const shortCode = linkData.slug || generateShortCode();
      
      const newLink: Partial<APILink> = {
        user_id: user.id,
        slug: shortCode,
        original_url: linkData.url,
        title: linkData.title,
        // Ensure optional fields are null if empty string to avoid 400 errors
        password_hash: linkData.password || null,
        expiration_date: linkData.expirationDate || null,
        click_limit: linkData.clickLimit ? parseInt(linkData.clickLimit) : null,
        status: 'active',
        is_active: true,
        type: linkData.type || 'url',
      };

      console.log('Creating link with payload:', newLink);

      const { data, error } = await linksAPI.createLink(newLink);

      if (error) {
        console.error('Supabase createLink error:', error);
        toast.error(error.message || 'Erreur lors de la création du lien');
        return;
      }

      // Generate QR code if requested
      if (linkData.generateQR && data) {
        try {
          await qrCodesAPI.createQRCode({
            link_id: data.id,
            user_id: user.id,
            name: linkData.title || 'QR Code',
            target_url: linkData.url,
            style: {}, // Default style
          });
        } catch (qrError) {
          console.error('Error generating QR code:', qrError);
          // Don't fail the link creation if QR fails
        }
      }

      toast.success('Lien créé avec succès !');
      await refreshLinks();
    } catch (error: any) {
      console.error('Error adding link:', error);
      toast.error('Erreur lors de la création du lien');
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      const apiUpdates: Partial<APILink> = {
        title: updates.title,
        original_url: updates.url,
        password_hash: updates.password || null,
        expiration_date: updates.expirationDate || null,
        click_limit: updates.clickLimit ? parseInt(updates.clickLimit) : null,
        status: updates.isActive !== undefined ? (updates.isActive ? 'active' : 'disabled') : undefined,
        is_active: updates.isActive,
      };

      const { error } = await linksAPI.updateLink(id, apiUpdates);

      if (error) {
        toast.error(error.message || 'Erreur lors de la mise à jour');
        return;
      }

      toast.success('Lien mis à jour avec succès');
      await refreshLinks();
    } catch (error: any) {
      console.error('Error updating link:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      const { error } = await linksAPI.deleteLink(id);

      if (error) {
        toast.error(error.message || 'Erreur lors de la suppression');
        return;
      }

      toast.success('Lien supprimé avec succès');
      await refreshLinks();
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const reorderLinks = async (updatedLinks: Link[]) => {
    if (!user) return;
    
    // Optimistic update logic could go here if we had local state, 
    // but we rely on refreshLinks mostly.
    
    try {
      const linkIds = updatedLinks.map(l => l.id);
      await linksAPI.reorderLinks(linkIds);
      await refreshLinks();
    } catch (error) {
      console.error('Error reordering links:', error);
      toast.error('Erreur lors de la réorganisation');
    }
  };

  return (
    <LinksContext.Provider value={{ links, loading: linksLoading, addLink, updateLink, deleteLink, reorderLinks }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
}

// Helper function to format click counts
function formatClicks(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
