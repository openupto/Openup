import { LinkBioPage, LinkBioLink, LinkBioTheme } from '../utils/supabase/api';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Instagram, Twitter, Youtube, Linkedin, Facebook, Globe, Twitch, Github, Mail, Play } from 'lucide-react';
import { useState } from 'react';

interface LinkInBioProfileProps {
  page: LinkBioPage;
  links: LinkBioLink[];
  theme: LinkBioTheme;
  previewMode?: boolean;
  onLinkClick?: (linkId: string, url: string) => void;
}

const SocialIconMap: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter, 
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  twitch: Twitch,
  github: Github,
  email: Mail,
  website: Globe,
};

export function getYouTubeId(url: string): string | null {
  try {
    if (!url) return null;
    let safeUrl = url;
    if (!safeUrl.startsWith('http')) {
        safeUrl = `https://${safeUrl}`;
    }
    const u = new URL(safeUrl);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex(p => ["shorts", "embed"].includes(p));
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumb(videoId: string) {
  return {
    max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

const VideoPlayer = ({ videoId, title, theme }: { videoId: string; title: string; theme: LinkBioTheme }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div 
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl group cursor-pointer transform transition-transform duration-300 isolate"
      style={{
         borderRadius: theme.button_radius ? `${theme.button_radius}px` : '12px',
         border: theme.button_border_color ? `1px solid ${theme.button_border_color}` : '1px solid rgba(255,255,255,0.1)',
         backgroundColor: 'rgba(0,0,0,0.2)'
      }}
      onClick={() => setIsPlaying(true)}
    >
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}
            className="absolute inset-0 z-10"
          >
            {/* High Res Thumbnail */}
            <img 
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Play Button Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl ring-1 ring-white/20"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6 ml-1 fill-white" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-black relative z-20"
          >
             <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function LinkInBioProfile({ page, links, theme, previewMode = false, onLinkClick }: LinkInBioProfileProps) {
  
  // Font Family Logic
  const getFontFamily = (font: string) => {
    switch (font) {
      case 'inter': return 'Inter, sans-serif';
      case 'poppins': return 'Poppins, sans-serif';
      case 'dm_sans': return 'DM Sans, sans-serif';
      case 'playfair': return 'Playfair Display, serif';
      case 'satoshi': return 'Satoshi, sans-serif'; 
      case 'outfit': return 'Outfit, sans-serif';
      default: return 'Inter, sans-serif';
    }
  };

  // Background Logic
  const getBackgroundStyle = () => {
    if (theme.background_type === 'image' && theme.bg_image_url) {
      return {
        backgroundImage: `url(${theme.bg_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    if (theme.background_type === 'gradient') {
      return { background: theme.background_value };
    }
    return { background: theme.background_value };
  };

  const bgStyle = getBackgroundStyle();
  const fontFamily = getFontFamily(theme.font_family);

  // Button Style Logic
  const getButtonStyle = () => {
    const base: any = {
      backgroundColor: theme.button_bg || theme.button_color,
      color: theme.button_text_color,
      borderRadius: `${theme.button_radius ?? 8}px`,
      border: theme.button_border_color ? `1px solid ${theme.button_border_color}` : 'none',
      padding: `${theme.button_padding_y ?? 16}px ${theme.button_padding_x ?? 24}px`,
      boxShadow: theme.button_shadow ? `0px ${theme.button_shadow}px ${theme.button_shadow * 2}px rgba(0,0,0,0.1)` : 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    };

    if (theme.button_style === 'outline') {
      base.backgroundColor = 'transparent';
      base.border = `2px solid ${theme.button_color}`;
      base.color = theme.button_color;
    } else if (theme.button_style === 'glass') {
      base.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      base.backdropFilter = 'blur(10px)';
      base.WebkitBackdropFilter = 'blur(10px)';
      base.border = '1px solid rgba(255, 255, 255, 0.2)';
    } else if (theme.button_style === 'neon') {
      base.backgroundColor = 'transparent';
      base.border = `2px solid ${theme.button_color}`;
      base.color = theme.button_color;
      base.boxShadow = `0 0 10px ${theme.button_color}, inset 0 0 10px ${theme.button_color}`;
    } else if (theme.button_style === 'shadow') {
      base.boxShadow = '4px 4px 0px rgba(0,0,0,0.8)';
      base.border = '2px solid black';
    }

    return base;
  };

  const buttonStyle = getButtonStyle();

  const handleLinkClick = (e: React.MouseEvent, link: LinkBioLink) => {
    if (previewMode) {
      e.preventDefault();
      return;
    }
    if (onLinkClick) {
      onLinkClick(link.id, link.url);
    }
  };

  const visibleLinks = previewMode ? links : links.filter(l => l.is_active);

  // Layout Width
  const maxWidthClass = theme.page_width === 'sm' ? 'max-w-sm' : theme.page_width === 'lg' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div 
      className="min-h-full w-full flex flex-col items-center py-12 px-4 transition-all duration-500 relative overflow-x-hidden"
      style={{ 
        ...bgStyle,
        fontFamily,
        color: theme.text_color || '#000000',
        fontSize: `${theme.font_size || 16}px`,
        fontWeight: theme.font_weight || 400,
        minHeight: '100vh',
      }}
    >
      {/* Background Overlay */}
      {(theme.bg_overlay_opacity ?? 0) > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundColor: theme.bg_overlay_color || '#000', 
            opacity: (theme.bg_overlay_opacity || 0) / 100,
            backdropFilter: theme.bg_blur ? `blur(${theme.bg_blur}px)` : 'none',
            WebkitBackdropFilter: theme.bg_blur ? `blur(${theme.bg_blur}px)` : 'none',
          }}
        />
      )}

      <div className={`relative z-10 w-full ${maxWidthClass} flex flex-col items-center`}>
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8 text-center w-full"
        >
          {theme.show_avatar !== false && (
            <div 
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white/20 shadow-xl"
              style={{
                borderColor: theme.button_color // Use button color for border for coherence
              }}
            >
               {(theme.avatar_url || page.profile_image_url) ? (
                 <img 
                   src={theme.avatar_url || page.profile_image_url} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-2xl font-bold">
                   {page.username?.[0]?.toUpperCase()}
                 </div>
               )}
            </div>
          )}
          
          <h1 className="text-xl font-bold mb-2">
            {theme.display_name || `@${page.username}`}
          </h1>
          
          {(theme.bio || page.bio) && (
            <p className="text-sm opacity-80 whitespace-pre-wrap max-w-sm">
              {theme.bio || page.bio}
            </p>
          )}

          {/* Social Icons (Top Position) */}
          {theme.show_social_icons && theme.social_links && theme.social_links.length > 0 && (
             <div className="flex gap-4 mt-4 flex-wrap justify-center">
               {theme.social_links.map((social: any, idx: number) => {
                 const Icon = SocialIconMap[social.platform.toLowerCase()] || Globe;
                 return (
                   <a 
                     key={idx}
                     href={social.url}
                     target="_blank"
                     rel="noreferrer"
                     className="transition-transform hover:scale-110"
                     style={{ 
                       color: theme.social_icon_style === 'colored' ? undefined : theme.text_color, 
                     }}
                   >
                     <Icon className="w-6 h-6" />
                   </a>
                 );
               })}
             </div>
          )}
        </motion.div>

        {/* Links */}
        <div className="w-full space-y-4 mb-12" style={{ gap: theme.spacing ? `${theme.spacing}px` : '16px', display: 'flex', flexDirection: 'column' }}>
          {visibleLinks.map((link, idx) => {
            // YouTube Video Block (Legacy: Inline Player)
            if (link.icon_key === 'youtube_video') {
                const videoId = getYouTubeId(link.url);
                if (videoId) {
                    return (
                       <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="w-full relative z-10"
                       >
                           <VideoPlayer videoId={videoId} title={link.title} theme={theme} />
                       </motion.div>
                    );
                }
            }
            
            // YouTube Link Card (New: Card with Thumb + Play that opens link)
            if (link.icon_key === 'youtube') {
              const id = getYouTubeId(link.url);
              const thumbs = id ? getYouTubeThumb(id) : null;

              if (thumbs) {
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="w-full relative z-10"
                    >
                        <button
                          onClick={() => window.open(link.url, "_blank")}
                          className="w-full text-left rounded-2xl overflow-hidden bg-white/10 border border-white/10 hover:border-white/20 transition group shadow-lg relative"
                          style={{
                              borderRadius: theme.button_radius ? `${theme.button_radius}px` : '16px',
                              backgroundColor: 'rgba(0,0,0,0.05)', 
                              border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="relative aspect-video">
                              <img
                                src={thumbs.max}
                                onError={(e) => { e.currentTarget.src = thumbs.hq; }}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={link.title || "YouTube"}
                              />
                            
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-black/80 backdrop-blur-md">
                            <div className="text-white font-semibold truncate text-sm">
                              {link.title || "Vidéo YouTube"}
                            </div>
                            <div className="text-white/60 text-xs truncate opacity-75">{link.url}</div>
                          </div>
                        </button>
                    </motion.div>
                  );
              }
            }

            // Standard Link
            return (
            <motion.a
              key={link.id}
              href={link.url}
              target={theme.open_in_new_tab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(e, link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={
                theme.button_hover_effect === 'lift' ? { y: -5 } :
                theme.button_hover_effect === 'glow' ? { boxShadow: `0 0 20px ${theme.button_color}` } :
                theme.button_hover_effect === 'invert' ? { filter: 'invert(1)' } : undefined
              }
              className={`
                block w-full text-center font-medium transition-all
                flex items-center justify-center relative group
                ${!link.is_active && previewMode ? 'opacity-50 grayscale' : ''}
              `}
              style={buttonStyle}
            >
              {/* Left Icon/Image */}
              {(link.icon_url || link.icon_key) && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded overflow-hidden">
                      {link.icon_url ? (
                          <img src={link.icon_url} alt="" className="w-full h-full object-cover rounded-sm" />
                      ) : (
                         <img 
                           src={`https://simpleicons.org/icons/${link.icon_key === 'globe' ? 'googleearth' : link.icon_key === 'mail' ? 'gmail' : link.icon_key === 'phone' ? 'googlephone' : link.icon_key}.svg`} 
                           alt="" 
                           className="w-6 h-6 object-contain"
                           style={{ filter: theme.button_text_color === '#ffffff' ? 'invert(1)' : 'none' }} 
                           onError={(e) => { e.currentTarget.style.display = 'none'; }}
                         />
                      )}
                  </div>
              )}

              <span className="truncate px-12">{link?.title || "Lien"}</span>
              
              {/* Optional Right Arrow / Favicon Fallback */}
              {!link.icon_url && !link.icon_key && theme.show_link_icons && (
                <div className="absolute left-4">
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`} 
                    alt="" 
                    className="w-5 h-5 opacity-80" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </motion.a>
            );
          })}

          {visibleLinks.length === 0 && (
            <div className="text-center opacity-50 text-sm py-10">
              Aucun lien pour le moment
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="mt-auto pt-8 opacity-50 hover:opacity-100 transition-opacity text-xs font-medium">
          <a href="https://openup.to" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <span>Créé avec</span>
            <span className="font-bold">OpenUp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
