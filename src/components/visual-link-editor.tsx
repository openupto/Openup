import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  Move, 
  Resize, 
  RotateCcw, 
  Save, 
  Eye, 
  Settings,
  Plus,
  Grid3x3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ExternalLink,
  Image
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LinkPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
  clicks: number;
  created_at: string;
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  theme: string;
  verified: boolean;
}

interface VisualLinkEditorProps {
  profile: UserProfile;
  links: LinkItem[];
  onLinksUpdate: (links: LinkItem[]) => void;
  onAddLink: () => void;
}

export function VisualLinkEditor({ profile, links, onLinksUpdate, onAddLink }: VisualLinkEditorProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [linkPositions, setLinkPositions] = useState<LinkPosition[]>(() => 
    links.map((link, index) => ({
      id: link.id,
      x: 50 + (index % 2) * 250,
      y: 100 + Math.floor(index / 2) * 120,
      width: 240,
      height: 80,
      zIndex: 1
    }))
  );
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    isResizing: boolean;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    linkId: string | null;
  }>({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    linkId: null
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const getLinkPosition = (linkId: string): LinkPosition => {
    return linkPositions.find(pos => pos.id === linkId) || {
      id: linkId,
      x: 50,
      y: 100,
      width: 240,
      height: 80,
      zIndex: 1
    };
  };

  const updateLinkPosition = (linkId: string, updates: Partial<LinkPosition>) => {
    setLinkPositions(prev => 
      prev.map(pos => 
        pos.id === linkId ? { ...pos, ...updates } : pos
      )
    );
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, linkId: string, action: 'drag' | 'resize') => {
    e.preventDefault();
    setSelectedLinkId(linkId);
    
    const position = getLinkPosition(linkId);
    setDragState({
      isDragging: action === 'drag',
      isResizing: action === 'resize',
      startX: e.clientX,
      startY: e.clientY,
      startWidth: position.width,
      startHeight: position.height,
      linkId
    });

    // Mettre le lien au premier plan
    updateLinkPosition(linkId, { zIndex: Math.max(...linkPositions.map(p => p.zIndex)) + 1 });
  }, [linkPositions]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.linkId || (!dragState.isDragging && !dragState.isResizing)) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    const position = getLinkPosition(dragState.linkId);

    if (dragState.isDragging) {
      updateLinkPosition(dragState.linkId, {
        x: Math.max(0, position.x + deltaX),
        y: Math.max(0, position.y + deltaY)
      });
    } else if (dragState.isResizing) {
      updateLinkPosition(dragState.linkId, {
        width: Math.max(120, dragState.startWidth + deltaX),
        height: Math.max(60, dragState.startHeight + deltaY)
      });
    }

    setDragState(prev => ({ ...prev, startX: e.clientX, startY: e.clientY }));
  }, [dragState, linkPositions]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      linkId: null
    });
  }, []);

  // Event listeners pour le drag global
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  const resetLayout = () => {
    const newPositions = links.map((link, index) => ({
      id: link.id,
      x: 50 + (index % 2) * 250,
      y: 100 + Math.floor(index / 2) * 120,
      width: 240,
      height: 80,
      zIndex: 1
    }));
    setLinkPositions(newPositions);
    toast.success('Layout réinitialisé');
  };

  const arrangeInGrid = () => {
    const cols = Math.ceil(Math.sqrt(links.length));
    const newPositions = links.map((link, index) => ({
      id: link.id,
      x: 50 + (index % cols) * 280,
      y: 100 + Math.floor(index / cols) * 120,
      width: 240,
      height: 80,
      zIndex: 1
    }));
    setLinkPositions(newPositions);
    toast.success('Liens arrangés en grille');
  };

  const arrangeVertically = () => {
    const newPositions = links.map((link, index) => ({
      id: link.id,
      x: 50,
      y: 100 + index * 100,
      width: 300,
      height: 80,
      zIndex: 1
    }));
    setLinkPositions(newPositions);
    toast.success('Liens arrangés verticalement');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const theme = {
    background: profile.background_color,
    text: profile.text_color,
    button: profile.button_color,
    buttonText: profile.button_text_color
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? <Settings className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isEditMode ? 'Mode Edition' : 'Aperçu'}
          </Button>
          
          {isEditMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={arrangeInGrid}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Grille
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={arrangeVertically}
              >
                <AlignLeft className="w-4 h-4 mr-2" />
                Vertical
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetLayout}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddLink}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un lien
          </Button>
          
          <Button
            size="sm"
            onClick={() => toast.success('Layout sauvegardé!')}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-slate-50 relative" ref={canvasRef}>
        <div 
          className="min-h-full min-w-full relative"
          style={{ 
            background: theme.background,
            minHeight: '800px',
            minWidth: '600px'
          }}
        >
          {/* Profile Header */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback 
                className="text-xl"
                style={{ background: theme.button, color: theme.buttonText }}
              >
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
                {profile.display_name}
              </h1>
              {profile.verified && (
                <Badge className="bg-blue-500 text-white">✓</Badge>
              )}
            </div>
            
            <p className="text-sm opacity-75 mb-3" style={{ color: theme.text }}>
              @{profile.username}
            </p>
            
            {profile.bio && (
              <p className="text-sm leading-relaxed opacity-80 max-w-md" style={{ color: theme.text }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Links */}
          {links.map((link) => {
            const position = getLinkPosition(link.id);
            const isSelected = selectedLinkId === link.id;
            
            return (
              <div
                key={link.id}
                className={`absolute cursor-move transition-all duration-200 ${
                  isEditMode ? 'border-2 border-dashed border-transparent hover:border-blue-300' : ''
                } ${isSelected ? 'border-blue-500' : ''}`}
                style={{
                  left: position.x,
                  top: position.y,
                  width: position.width,
                  height: position.height,
                  zIndex: position.zIndex
                }}
                onMouseDown={(e) => isEditMode && handleMouseDown(e, link.id, 'drag')}
                onClick={() => setSelectedLinkId(link.id)}
              >
                <Card className="w-full h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 h-full">
                    <div className="flex items-center h-full">
                      {link.image_url ? (
                        <img
                          src={link.image_url}
                          alt={link.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
                          style={{ background: theme.button }}
                        >
                          <ExternalLink className="w-6 h-6" style={{ color: theme.buttonText }} />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate" style={{ color: theme.text }}>
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-sm opacity-75 truncate" style={{ color: theme.text }}>
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resize handle */}
                {isEditMode && isSelected && (
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl-md"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, link.id, 'resize');
                    }}
                  >
                    <Resize className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Move handle */}
                {isEditMode && isSelected && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Move className="w-3 h-3" />
                      <span>Déplacer</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Grid overlay en mode édition */}
          {isEditMode && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #3399ff 1px, transparent 1px),
                  linear-gradient(to bottom, #3399ff 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}
        </div>
      </div>

      {/* Instructions */}
      {isEditMode && (
        <div className="p-4 bg-blue-50 border-t">
          <div className="flex items-center justify-center space-x-6 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <Move className="w-4 h-4" />
              <span>Cliquer-glisser pour déplacer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Resize className="w-4 h-4" />
              <span>Coin bas-droit pour redimensionner</span>
            </div>
            <div className="flex items-center space-x-2">
              <Grid3x3 className="w-4 h-4" />
              <span>Utilisez les boutons pour organiser</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}