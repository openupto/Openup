import { Card } from './ui/card';
import { Play, Youtube } from 'lucide-react';
import exampleImage from 'figma:asset/9caa7999c0c85e16e1790eb614319b496c2b3015.png';

interface VideoLinkCardProps {
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  onLinkClick: () => void;
  style?: React.CSSProperties;
}

export function VideoLinkCard({ 
  title, 
  description, 
  url, 
  thumbnail,
  duration,
  onLinkClick, 
  style 
}: VideoLinkCardProps) {
  
  // Extract video ID from URL for fallback thumbnail
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^([^"&?\/\s]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const videoId = extractYouTubeVideoId(url);
  const thumbnailUrl = thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

  return (
    <Card
      className="cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl border-0 overflow-hidden"
      style={style}
      onClick={onLinkClick}
    >
      <div className="flex items-center space-x-4 p-4">
        {/* Video Thumbnail */}
        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a gradient background if image fails
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Youtube className="w-8 h-8 text-white" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-gray-800 fill-gray-800 ml-0.5" />
            </div>
          </div>
          
          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Youtube className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium text-red-600">My latest Youtube video</span>
          </div>
          <div className="font-medium text-base leading-tight mb-1 line-clamp-2">
            {title}
          </div>
          {description && (
            <div className="text-sm opacity-80 line-clamp-2 leading-tight">
              {description}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}