import { useState, useEffect } from 'react';
import { LinkBioPage, LinkBioLink, LinkBioTheme, linkBioAPI } from '../../utils/supabase/api';
import { LinkInBioProfile } from '../link-in-bio-profile';
import { Loader2 } from 'lucide-react';

interface PublicProfileProps {
  username: string;
}

export function PublicProfile({ username }: PublicProfileProps) {
  const [data, setData] = useState<{ page: LinkBioPage; links: LinkBioLink[]; theme: LinkBioTheme } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<'none' | 'not_found' | 'inactive'>('none');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorType('none');

        const { data: result, error: apiError } = await linkBioAPI.getPublicPage(username);

        if (apiError || !result || !result.page) {
          setErrorType('not_found');
          return;
        }

        // Check if page is active
        if (!result.page.is_active) {
          setErrorType('inactive');
          return;
        }

        if (!result.theme) {
           // Should not happen usually, but handle gracefully
           console.warn('Theme missing for page', result.page.id);
        }

        setData(result);
      } catch (e) {
        console.error('Error loading public profile:', e);
        setErrorType('not_found');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadData();
    }
  }, [username]);

  const handleLinkClick = (linkId: string, url: string) => {
    // Track the click
    linkBioAPI.trackClick(username, linkId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (errorType === 'inactive') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
             <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Page privée / inactive</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Ce profil est actuellement désactivé par son propriétaire.
          </p>
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (errorType === 'not_found' || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Page introuvable</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Désolé, nous ne trouvons pas la page que vous cherchez.
          </p>
          <a 
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02]"
          >
            Créer ma page OpenUp
          </a>
        </div>
      </div>
    );
  }

  return (
    <LinkInBioProfile 
      page={data.page}
      links={data.links}
      theme={data.theme}
      previewMode={false}
      onLinkClick={handleLinkClick}
    />
  );
}
