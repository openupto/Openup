import { useState, useCallback } from 'react';
import { ArrowLeft, Eye, Share2, Plus, Trash2, GripVertical, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';
import { AppearanceModal } from './appearance-modal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BioLink {
  id: string;
  type: 'youtube' | 'teamwater' | 'tiktok' | 'custom';
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  icon?: string;
}

interface BioEditorProps {
  bio: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    profileImage?: string;
    theme: string;
  };
  onBack: () => void;
  onSave?: (data: any) => void;
  isMobile?: boolean;
}

// Composant de lien draggable
function SortableLinkItem({ link, onDelete }: { link: BioLink; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-grab active:cursor-grabbing"
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {link.thumbnail ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  <h3 className="text-sm text-gray-900 dark:text-white line-clamp-1">
                    {link.title}
                  </h3>
                </div>
                {link.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {link.description}
                  </p>
                )}
              </div>
              <img
                src={link.thumbnail}
                alt={link.title}
                className="w-20 h-14 object-cover rounded-lg shrink-0"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {link.icon && <span className="text-xl">{link.icon}</span>}
              <h3 className="text-gray-900 dark:text-white">
                {link.title}
              </h3>
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(link.id)}
          className="flex items-center justify-center w-10 h-10 bg-red-50 dark:bg-red-950 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
}

export function BioEditor({ bio, onBack, onSave, isMobile = false }: BioEditorProps) {
  const [username, setUsername] = useState(bio.title || 'Nom d\'utilisateur...');
  const [bioText, setBioText] = useState(bio.description || 'Ajouter une bio...');
  const [profileImage, setProfileImage] = useState(bio.profileImage || '');
  const [currentTheme, setCurrentTheme] = useState(bio.theme);
  const [currentButtonStyle, setCurrentButtonStyle] = useState('rounded');
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  
  const [links, setLinks] = useState<BioLink[]>([
    {
      id: '1',
      type: 'youtube',
      title: '🎬 My lastest Youtube video',
      description: 'Every country on the planet competes to win $250,000! Subscribe to be in a video!',
      url: 'https://youtube.com/watch?v=...',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop',
    },
    {
      id: '2',
      type: 'teamwater',
      title: '💧 DONATE TO TEAMWATER $1 IS 1 YEAR OF CLEAN WATER FOR SOMEONE IN NEED!',
      description: 'Raising $40M to give 2 million people clean water for decades',
      url: 'https://teamwater.org',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop',
    },
    {
      id: '3',
      type: 'tiktok',
      title: 'TikTok',
      url: 'https://tiktok.com/@...',
      icon: '🎵',
    },
  ]);

  // Sensors pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success('Ordre des liens modifié');
    }
  }, []);

  const handleAddLink = () => {
    const newLink: BioLink = {
      id: String(Date.now()),
      type: 'custom',
      title: 'Nouveau lien',
      url: '',
    };
    setLinks([...links, newLink]);
    toast.success('Nouveau lien ajouté');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Lien supprimé');
  };

  const handleSave = () => {
    const data = {
      username,
      bio: bioText,
      profileImage,
      links,
      theme: currentTheme,
      buttonStyle: currentButtonStyle,
    };
    if (onSave) {
      onSave(data);
    }
    toast.success('Modifications enregistrées');
  };

  const handleAppearanceSave = (theme: string, buttonStyle: string) => {
    setCurrentTheme(theme);
    setCurrentButtonStyle(buttonStyle);
    toast.success('Apparence mise à jour');
  };

  const handleShare = () => {
    const url = `https://openup.to/${bio.slug}`;
    copyToClipboard(url, 'Lien copié dans le presse-papier');
  };

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} bg-gray-50 dark:bg-gray-900 min-h-full`}>
      {/* Header avec boutons */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAppearanceModal(true)}
            variant="outline"
            className="h-12 px-6 rounded-xl border-gray-300 dark:border-gray-700"
          >
            Modifier l'apparence
          </Button>
          
          <button
            onClick={() => window.open(`/u/${bio.slug}`, '_blank')}
            className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={handleShare}
            className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Zone de preview/édition - background gris clair */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6 mb-6 max-w-md mx-auto">
        {/* Photo de profil + infos */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-200 dark:border-gray-600 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt={username} className="w-full h-full object-cover" />
              ) : (
                <button className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <Plus className="w-8 h-8 text-gray-400" />
                </button>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#3399ff] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2680e6] transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-center mb-2 bg-white dark:bg-gray-700 border-0 h-auto py-2"
            placeholder="Nom d'utilisateur..."
          />
          
          <Textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="text-center text-sm bg-white dark:bg-gray-700 border-0 resize-none"
            placeholder="Ajouter une bio..."
            rows={2}
          />
        </div>

        {/* Liste des liens avec drag & drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map(link => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Bouton ajouter un lien */}
        <Button
          onClick={handleAddLink}
          variant="outline"
          className="w-full mt-4 h-14 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#3399ff] dark:hover:border-[#3399ff] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un lien
        </Button>
      </div>

      {/* Bouton sauvegarder */}
      <div className="max-w-md mx-auto">
        <Button
          onClick={handleSave}
          className="w-full bg-[#3399ff] hover:bg-[#2680e6] text-white h-14 rounded-xl"
        >
          Enregistrer les modifications
        </Button>
      </div>

      {/* Modal d'apparence */}
      <AppearanceModal
        isOpen={showAppearanceModal}
        onClose={() => setShowAppearanceModal(false)}
        onSave={handleAppearanceSave}
        currentTheme={currentTheme}
        currentButtonStyle={currentButtonStyle}
      />
    </div>
  );
}
