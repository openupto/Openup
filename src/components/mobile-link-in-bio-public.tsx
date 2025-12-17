import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';

interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string | null;
  type?: 'link' | 'video' | 'social';
}

interface MobileLinkInBioPublicProps {
  username: string;
  bio?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  theme?: string;
  links: LinkItem[];
}

export function MobileLinkInBioPublic({
  username,
  bio,
  profileImage,
  backgroundImage,
  theme = 'gradient-blue',
  links
}: MobileLinkInBioPublicProps) {
  const getGradientClass = (themeId: string) => {
    switch (themeId) {
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300';
      case 'gradient-pink':
        return 'bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-300';
      case 'gradient-green':
        return 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-300';
      case 'gradient-orange':
        return 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-300';
      case 'gradient-dark':
        return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
      case 'solid-white':
        return 'bg-white';
      case 'solid-black':
        return 'bg-black';
      default:
        return 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: username,
        text: bio || `Découvrez mon Link in Bio`,
        url: window.location.href
      }).catch(() => {
        // User cancelled or error
      });
    } else {
      copyToClipboard(window.location.href, 'Lien copié dans le presse-papiers');
    }
  };

  const handleLinkClick = (link: LinkItem) => {
    window.open(link.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="tracking-tight">
                <span className="text-foreground">open</span>
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Preview Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
            {/* Background */}
            <div className={`relative h-48 ${getGradientClass(theme)}`}>
              {backgroundImage && (
                <img 
                  src={backgroundImage} 
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pb-6">
              {/* Profile Image */}
              {profileImage && (
                <div className="relative -mt-16 mb-4">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden">
                    <img 
                      src={profileImage} 
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Username */}
              <h1 className="mb-2">{username}</h1>

              {/* Bio */}
              {bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {bio}
                </p>
              )}

              {/* Links */}
              <div className="space-y-3">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all active:scale-98"
                  >
                    <div className="flex gap-3 items-start">
                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium mb-1 line-clamp-2">{link.title}</p>
                        {link.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {link.description}
                          </p>
                        )}
                      </div>

                      {/* Thumbnail */}
                      {link.thumbnail && (
                        <div className="w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img 
                            src={link.thumbnail} 
                            alt={link.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {links.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun lien disponible pour le moment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#3399ff] transition-colors inline-flex items-center gap-1"
            >
              Créez votre Link in Bio avec 
              <span className="font-medium">open</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
