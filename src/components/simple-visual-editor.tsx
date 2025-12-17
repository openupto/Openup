import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  Move, 
  RotateCcw, 
  Save, 
  Eye, 
  Settings,
  Plus,
  Grid3x3,
  AlignLeft,
  AlignCenter,
  ExternalLink,
  GripVertical,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

interface LinkPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SimpleVisualEditorProps {
  profile: UserProfile;
  links: LinkItem[];
  onLinksUpdate: (links: LinkItem[]) => void;
  onAddLink: () => void;
}

export function SimpleVisualEditor({ profile, links, onLinksUpdate, onAddLink }: SimpleVisualEditorProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [linkPositions, setLinkPositions] = useState<{ [key: string]: LinkPosition }>(() => {
    const positions: { [key: string]: LinkPosition } = {};
    links.forEach((link, index) => {
      positions[link.id] = {
        x: 50 + (index % 2) * 280,
        y: 200 + Math.floor(index / 2) * 120,
        width: 260,
        height: 80
      };
    });
    return positions;
  });

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    dragId: string | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({
    isDragging: false,
    dragId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const getLinkPosition = (linkId: string): LinkPosition => {
    return linkPositions[linkId] || { x: 50, y: 200, width: 260, height: 80 };
  };

  const updateLinkPosition = (linkId: string, updates: Partial<LinkPosition>) => {
    setLinkPositions(prev => ({
      ...prev,
      [linkId]: { ...prev[linkId], ...updates }
    }));
  };

  const handleMouseDown = (e: React.MouseEvent, linkId: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    setSelectedLinkId(linkId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      dragId: linkId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.dragId) return;

    const newX = e.clientX - dragState.offsetX;
    const newY = e.clientY - dragState.offsetY;

    updateLinkPosition(dragState.dragId, {
      x: Math.max(0, newX),
      y: Math.max(0, newY)
    });
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0
    });
  }, []);

  // Event listeners globaux
  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const arrangeInGrid = () => {
    const newPositions: { [key: string]: LinkPosition } = {};
    links.forEach((link, index) => {
      const cols = 2;
      newPositions[link.id] = {
        x: 50 + (index % cols) * 300,
        y: 200 + Math.floor(index / cols) * 120,
        width: 260,
        height: 80
      };
    });
    setLinkPositions(newPositions);
    toast.success('Liens arrangés en grille');
  };

  const arrangeVertically = () => {
    const newPositions: { [key: string]: LinkPosition } = {};
    links.forEach((link, index) => {
      newPositions[link.id] = {
        x: 50,
        y: 200 + index * 100,
        width: 300,
        height: 80
      };
    });
    setLinkPositions(newPositions);
    toast.success('Liens arrangés verticalement');
  };

  const resetLayout = () => {
    const newPositions: { [key: string]: LinkPosition } = {};
    links.forEach((link, index) => {
      newPositions[link.id] = {
        x: 50 + (index % 2) * 280,
        y: 200 + Math.floor(index / 2) * 120,
        width: 260,
        height: 80
      };
    });
    setLinkPositions(newPositions);
    toast.success('Layout réinitialisé');
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
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={arrangeInGrid}
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                Grille
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={arrangeVertically}
              >
                <AlignLeft className="w-4 h-4 mr-1" />
                Vertical
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetLayout}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={onAddLink}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success('Layout sauvegardé!')}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <div 
          className="relative min-h-full min-w-full"
          style={{ 
            background: theme.background,
            minHeight: '600px',
            minWidth: '800px'
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
                className={`absolute transition-all duration-200 ${
                  isEditMode ? 'cursor-move' : 'cursor-pointer'
                } ${isSelected && isEditMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{
                  left: position.x,
                  top: position.y,
                  width: position.width,
                  height: position.height
                }}
                onMouseDown={(e) => handleMouseDown(e, link.id)}
                onClick={() => !isEditMode && window.open(link.url, '_blank')}
              >
                <Card className="w-full h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 h-full">
                    <div className="flex items-center h-full">
                      {link.image_url ? (
                        <img
                          src={link.image_url}
                          alt={link.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3 flex-shrink-0"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
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

                {/* Drag indicator */}
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
              className="absolute inset-0 pointer-events-none opacity-5"
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
        <div className="p-3 bg-blue-50 border-t">
          <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
            <div className="flex items-center space-x-1">
              <Move className="w-4 h-4" />
              <span>Cliquer-glisser pour déplacer les liens</span>
            </div>
            <div className="flex items-center space-x-1">
              <Grid3x3 className="w-4 h-4" />
              <span>Utilisez les boutons pour organiser automatiquement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}