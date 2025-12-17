import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Move, 
  RotateCw, 
  Copy, 
  Trash2, 
  Settings, 
  ExternalLink,
  Image,
  GripVertical,
  MoreHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface LinkData {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  type?: string;
}

interface LinkPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

interface ResizableLinkProps {
  link: LinkData;
  position: LinkPosition;
  isSelected: boolean;
  isEditMode: boolean;
  theme: {
    background: string;
    text: string;
    button: string;
    buttonText: string;
  };
  onPositionChange: (newPosition: LinkPosition) => void;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onClick: () => void;
}

export function ResizableLink({
  link,
  position,
  isSelected,
  isEditMode,
  theme,
  onPositionChange,
  onSelect,
  onDelete,
  onDuplicate,
  onEdit,
  onClick
}: ResizableLinkProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const linkRef = useRef<HTMLDivElement>(null);

  // Gestion du drag & drop
  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect();
    
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      if (action === 'drag') {
        setIsDragging(true);
      } else {
        setIsResizing(true);
      }
    }
  }, [isEditMode, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isDragging) {
      onPositionChange({
        ...position,
        x: Math.max(0, position.x + deltaX),
        y: Math.max(0, position.y + deltaY)
      });
    } else if (isResizing) {
      onPositionChange({
        ...position,
        width: Math.max(120, position.width + deltaX),
        height: Math.max(60, position.height + deltaY)
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, position, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Event listeners globaux
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleRotate = () => {
    onPositionChange({
      ...position,
      rotation: (position.rotation + 15) % 360
    });
  };

  const handleScale = (scaleDirection: 'up' | 'down') => {
    const newScale = scaleDirection === 'up' 
      ? Math.min(2, position.scale + 0.1)
      : Math.max(0.5, position.scale - 0.1);
    
    onPositionChange({
      ...position,
      scale: newScale
    });
  };

  const bringToFront = () => {
    onPositionChange({
      ...position,
      zIndex: position.zIndex + 1
    });
  };

  const sendToBack = () => {
    onPositionChange({
      ...position,
      zIndex: Math.max(1, position.zIndex - 1)
    });
  };

  const resetTransform = () => {
    onPositionChange({
      ...position,
      rotation: 0,
      scale: 1
    });
    toast.success('Transformation réinitialisée');
  };

  return (
    <div
      ref={linkRef}
      className={`absolute transition-all duration-200 ${
        isEditMode ? 'cursor-move' : 'cursor-pointer'
      } ${isSelected && isEditMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transform: `rotate(${position.rotation}deg) scale(${position.scale})`,
        zIndex: position.zIndex,
        transformOrigin: 'center'
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditMode) {
          onSelect();
        } else {
          onClick();
        }
      }}
    >
      <Card className={`w-full h-full hover:shadow-lg transition-all duration-300 ${
        isDragging ? 'shadow-xl opacity-80' : ''
      } ${isResizing ? 'shadow-xl' : ''}`}>
        <CardContent className="p-4 h-full relative">
          {/* Contenu du lien */}
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
              <h3 className="font-semibold truncate text-sm" style={{ color: theme.text }}>
                {link.title}
              </h3>
              {link.description && (
                <p className="text-xs opacity-75 truncate mt-1" style={{ color: theme.text }}>
                  {link.description}
                </p>
              )}
            </div>
          </div>

          {/* Overlay de contrôles en mode édition */}
          {isEditMode && isSelected && (
            <>
              {/* Handle de redimensionnement */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl-md opacity-80 hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
              >
                <GripVertical className="w-3 h-3 text-white transform rotate-45" />
              </div>

              {/* Barre d'outils flottante */}
              <div className="absolute -top-12 left-0 right-0 flex justify-center">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex items-center p-1 space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleRotate}
                    title="Rotation"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleScale('up')}
                    title="Agrandir"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleScale('down')}
                    title="Réduire"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem onClick={onEdit}>
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDuplicate}>
                        <Copy className="w-4 h-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={bringToFront}>
                        <Move className="w-4 h-4 mr-2" />
                        Premier plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={sendToBack}>
                        <Move className="w-4 h-4 mr-2" />
                        Arrière plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={resetTransform}>
                        <RotateCw className="w-4 h-4 mr-2" />
                        Reset transform
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={onDelete}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Indicateur de déplacement */}
              <div className="absolute top-1 left-1">
                <div className="bg-blue-500 text-white rounded p-1">
                  <Move className="w-3 h-3" />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}