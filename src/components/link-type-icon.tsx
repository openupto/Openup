import { Youtube, Instagram, Twitter, Facebook, Globe, Music } from 'lucide-react';
import linkIconImage from 'figma:asset/3a304e1e94112bfebacc05eefa1de8a206255445.png';

interface LinkTypeIconProps {
  url: string;
  type?: 'link' | 'video' | 'social';
  className?: string;
}

export function LinkTypeIcon({ url, type, className = "w-5 h-5" }: LinkTypeIconProps) {
  const lowerUrl = url.toLowerCase();
  
  // Detect from URL
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return <Youtube className={className} />;
  }
  if (lowerUrl.includes('instagram.com')) {
    return <Instagram className={className} />;
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return <Twitter className={className} />;
  }
  if (lowerUrl.includes('facebook.com')) {
    return <Facebook className={className} />;
  }
  if (lowerUrl.includes('tiktok.com')) {
    return <Music className={className} />;
  }
  
  // Use type prop
  if (type === 'video') {
    return <Youtube className={className} />;
  }
  if (type === 'social') {
    return <Globe className={className} />;
  }
  
  // Default - use custom link icon
  return <img src={linkIconImage} alt="Link" className={className} />;
}
