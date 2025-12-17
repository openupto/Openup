import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Move, 
  RotateCcw,
  Grid3x3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Layers,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Save,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Hand,
  Square,
  Circle
} from 'lucide-react';
import { ResizableLink } from './resizable-link';
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
  rotation: number;
  scale: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

interface AdvancedLayoutEditorProps {
  profile: UserProfile;
  links: LinkItem[];
  onLinksUpdate: (links: LinkItem[]) => void;
  onAddLink: () => void;
}

export function AdvancedLayoutEditor({ profile, links, onLinksUpdate, onAddLink }: AdvancedLayoutEditorProps) {
  const [tool, setTool] = useState<'select' | 'pan' | 'shape'>('select');
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showGuides, setShowGuides] = useState(true);
  const [history, setHistory] = useState<LinkPosition[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [linkPositions, setLinkPositions] = useState<{ [key: string]: LinkPosition }>(() => {
    const positions: { [key: string]: LinkPosition } = {};
    links.forEach((link, index) => {
      positions[link.id] = {
        x: 50 + (index % 3) * 280,
        y: 200 + Math.floor(index / 3) * 120,
        width: 240,
        height: 80,
        rotation: 0,
        scale: 1,
        zIndex: index + 1,
        locked: false,
        visible: true
      };
    });
    return positions;
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(Object.values(linkPositions));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, linkPositions]);

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      const newPositions: { [key: string]: LinkPosition } = {};
      previousState.forEach((pos, index) => {
        const linkId = links[index]?.id;
        if (linkId) {
          newPositions[linkId] = pos;
        }
      });
      setLinkPositions(newPositions);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      const newPositions: { [key: string]: LinkPosition } = {};
      nextState.forEach((pos, index) => {
        const linkId = links[index]?.id;
        if (linkId) {
          newPositions[linkId] = pos;
        }
      });
      setLinkPositions(newPositions);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const updateLinkPosition = (linkId: string, updates: Partial<LinkPosition>) => {
    setLinkPositions(prev => ({
      ...prev,
      [linkId]: {
        ...prev[linkId],
        ...updates,
        x: snapToGridValue(updates.x ?? prev[linkId].x),
        y: snapToGridValue(updates.y ?? prev[linkId].y)
      }
    }));
  };

  const selectLink = (linkId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedLinkIds(prev => 
        prev.includes(linkId) 
          ? prev.filter(id => id !== linkId)
          : [...prev, linkId]
      );
    } else {
      setSelectedLinkIds([linkId]);
    }
  };

  const alignSelected = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedLinkIds.length < 2) return;

    const positions = selectedLinkIds.map(id => linkPositions[id]);
    let newPositions: { [key: string]: Partial<LinkPosition> } = {};

    switch (alignment) {
      case 'left':
        const minX = Math.min(...positions.map(p => p.x));
        selectedLinkIds.forEach(id => {
          newPositions[id] = { x: minX };
        });
        break;
      case 'center':
        const avgX = positions.reduce((sum, p) => sum + p.x + p.width / 2, 0) / positions.length;
        selectedLinkIds.forEach(id => {
          newPositions[id] = { x: avgX - linkPositions[id].width / 2 };
        });
        break;
      case 'right':
        const maxX = Math.max(...positions.map(p => p.x + p.width));
        selectedLinkIds.forEach(id => {
          newPositions[id] = { x: maxX - linkPositions[id].width };
        });
        break;
      case 'top':
        const minY = Math.min(...positions.map(p => p.y));
        selectedLinkIds.forEach(id => {
          newPositions[id] = { y: minY };
        });
        break;
      case 'middle':
        const avgY = positions.reduce((sum, p) => sum + p.y + p.height / 2, 0) / positions.length;
        selectedLinkIds.forEach(id => {
          newPositions[id] = { y: avgY - linkPositions[id].height / 2 };
        });
        break;
      case 'bottom':
        const maxY = Math.max(...positions.map(p => p.y + p.height));
        selectedLinkIds.forEach(id => {
          newPositions[id] = { y: maxY - linkPositions[id].height };
        });
        break;
    }

    selectedLinkIds.forEach(id => {
      updateLinkPosition(id, newPositions[id]);
    });
    addToHistory();
    toast.success('Liens alignés');
  };

  const distributeSelected = (direction: 'horizontal' | 'vertical') => {
    if (selectedLinkIds.length < 3) return;

    const positions = selectedLinkIds.map(id => ({ id, ...linkPositions[id] }));
    
    if (direction === 'horizontal') {
      positions.sort((a, b) => a.x - b.x);
      const first = positions[0];
      const last = positions[positions.length - 1];
      const totalSpace = (last.x + last.width) - first.x;
      const spacing = totalSpace / (positions.length - 1);

      positions.forEach((pos, index) => {
        if (index > 0 && index < positions.length - 1) {
          updateLinkPosition(pos.id, { x: first.x + spacing * index });
        }
      });
    } else {
      positions.sort((a, b) => a.y - b.y);
      const first = positions[0];
      const last = positions[positions.length - 1];
      const totalSpace = (last.y + last.height) - first.y;
      const spacing = totalSpace / (positions.length - 1);

      positions.forEach((pos, index) => {
        if (index > 0 && index < positions.length - 1) {
          updateLinkPosition(pos.id, { y: first.y + spacing * index });
        }
      });
    }

    addToHistory();
    toast.success('Liens distribués');
  };

  const duplicateSelected = () => {
    if (selectedLinkIds.length === 0) return;

    const newLinks: LinkItem[] = [];
    selectedLinkIds.forEach(id => {
      const originalLink = links.find(l => l.id === id);
      if (originalLink) {
        const newLink: LinkItem = {
          ...originalLink,
          id: Date.now().toString() + Math.random(),
          title: originalLink.title + ' (Copie)'
        };
        newLinks.push(newLink);
        
        const originalPosition = linkPositions[id];
        setLinkPositions(prev => ({
          ...prev,
          [newLink.id]: {
            ...originalPosition,
            x: originalPosition.x + 20,
            y: originalPosition.y + 20,
            zIndex: Math.max(...Object.values(prev).map(p => p.zIndex)) + 1
          }
        }));
      }
    });

    onLinksUpdate([...links, ...newLinks]);
    setSelectedLinkIds(newLinks.map(l => l.id));
    toast.success(`${newLinks.length} lien(s) dupliqué(s)`);
  };

  const deleteSelected = () => {
    if (selectedLinkIds.length === 0) return;

    const remainingLinks = links.filter(link => !selectedLinkIds.includes(link.id));
    onLinksUpdate(remainingLinks);
    
    const newPositions = { ...linkPositions };
    selectedLinkIds.forEach(id => delete newPositions[id]);
    setLinkPositions(newPositions);
    
    setSelectedLinkIds([]);
    toast.success(`${selectedLinkIds.length} lien(s) supprimé(s)`);
  };

  const theme = {
    background: profile.background_color,
    text: profile.text_color,
    button: profile.button_color,
    buttonText: profile.button_text_color
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full flex">
      {/* Sidebar Tools */}
      <div className="w-64 border-r bg-white flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('select')}
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'pan' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('pan')}
            >
              <Hand className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'shape' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('shape')}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="layout" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="align">Aligner</TabsTrigger>
            <TabsTrigger value="layers">Calques</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Grille</Label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Snap to grid</Label>
                <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
              </div>
              
              <div>
                <Label>Taille de grille: {gridSize}px</Label>
                <Slider
                  value={[gridSize]}
                  onValueChange={([value]) => setGridSize(value)}
                  min={10}
                  max={50}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Guides</Label>
                <Switch checked={showGuides} onCheckedChange={setShowGuides} />
              </div>
              
              <div>
                <Label>Zoom: {Math.round(zoom * 100)}%</Label>
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="align" className="p-4 space-y-4">
            <div>
              <Label className="mb-2 block">Alignement horizontal</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('left')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('center')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('right')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Alignement vertical</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('top')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignVerticalJustifyStart className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('middle')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alignSelected('bottom')}
                  disabled={selectedLinkIds.length < 2}
                >
                  <AlignVerticalJustifyEnd className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Distribution</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => distributeSelected('horizontal')}
                  disabled={selectedLinkIds.length < 3}
                >
                  Distribuer horizontalement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => distributeSelected('vertical')}
                  disabled={selectedLinkIds.length < 3}
                >
                  Distribuer verticalement
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={duplicateSelected}
                disabled={selectedLinkIds.length === 0}
              >
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600"
                onClick={deleteSelected}
                disabled={selectedLinkIds.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="p-4">
            <div className="space-y-2">
              {links.map(link => {
                const position = linkPositions[link.id];
                if (!position) return null;

                return (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      selectedLinkIds.includes(link.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => selectLink(link.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLinkPosition(link.id, { visible: !position.visible });
                        }}
                      >
                        {position.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLinkPosition(link.id, { locked: !position.locked });
                        }}
                      >
                        {position.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </Button>
                      <span className="text-sm truncate">{link.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button className="w-full" onClick={onAddLink}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un lien
          </Button>
          <Button variant="outline" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <div
          ref={canvasRef}
          className="relative w-full h-full cursor-move"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'top left'
          }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{ background: theme.background, minWidth: '1200px', minHeight: '800px' }}
          >
            {/* Grid */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #3399ff 1px, transparent 1px),
                    linear-gradient(to bottom, #3399ff 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px ${gridSize}px`
                }}
              />
            )}

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
            {links.map(link => {
              const position = linkPositions[link.id];
              if (!position || !position.visible) return null;

              return (
                <ResizableLink
                  key={link.id}
                  link={link}
                  position={position}
                  isSelected={selectedLinkIds.includes(link.id)}
                  isEditMode={true}
                  theme={theme}
                  onPositionChange={(newPosition) => updateLinkPosition(link.id, newPosition)}
                  onSelect={() => selectLink(link.id, false)}
                  onDelete={() => deleteSelected()}
                  onDuplicate={duplicateSelected}
                  onEdit={() => toast.info('Édition du lien...')}
                  onClick={() => window.open(link.url, '_blank')}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}