import { useState } from 'react';
import { ChevronLeft, Eye, Share2, Plus, GripVertical, Trash2, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { MobileLinkWizard } from './mobile-link-wizard';
import { MobileAppearanceEditor } from './mobile-appearance-editor';
import { MobileSubscriptionEditor } from './mobile-subscription-editor';

interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string | null;
  type?: 'link' | 'video' | 'social';
}

interface MobileLinkInBioCreatorProps {
  onClose: () => void;
  onComplete?: (bioData: any) => void;
  editMode?: boolean;
  initialData?: any;
}

export function MobileLinkInBioCreator({ 
  onClose, 
  onComplete,
  editMode = false,
  initialData 
}: MobileLinkInBioCreatorProps) {
  const [showLinkWizard, setShowLinkWizard] = useState(false);
  const [showAppearanceEditor, setShowAppearanceEditor] = useState(false);
  const [showSubscriptionEditor, setShowSubscriptionEditor] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  
  const [bioData, setBioData] = useState({
    profileImage: initialData?.profileImage || null as File | null,
    backgroundImage: initialData?.backgroundImage || null as File | null,
    username: initialData?.username || '',
    bio: initialData?.bio || '',
    links: initialData?.links || [] as LinkItem[],
    theme: initialData?.theme || 'gradient-blue',
  });

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBioData({ ...bioData, profileImage: file });
      toast.success('Photo de profil ajoutée');
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBioData({ ...bioData, backgroundImage: file });
      toast.success('Image de fond ajoutée');
    }
  };

  const handleDeleteLink = (index: number) => {
    const newLinks = bioData.links.filter((_, i) => i !== index);
    setBioData({ ...bioData, links: newLinks });
    toast.success('Lien supprimé');
  };

  const handleEditLink = (index: number) => {
    setEditingLink({ ...bioData.links[index], id: index.toString() });
    setShowLinkWizard(true);
  };

  const handleSave = () => {
    if (!bioData.username) {
      toast.error('Veuillez ajouter un nom d\'utilisateur');
      return;
    }
    
    toast.success(editMode ? 'Link in bio mis à jour !' : 'Link in bio créé !');
    onComplete?.(bioData);
    onClose();
  };

  const handlePreview = () => {
    toast.info('Aperçu en cours de développement');
  };

  const handleShare = () => {
    toast.info('Partage en cours de développement');
  };

  const getGradientClass = (theme: string) => {
    switch (theme) {
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

  if (showSubscriptionEditor) {
    return (
      <MobileSubscriptionEditor
        onClose={() => setShowSubscriptionEditor(false)}
        currentPlan="starter"
      />
    );
  }

  if (showAppearanceEditor) {
    return (
      <MobileAppearanceEditor
        onClose={() => setShowAppearanceEditor(false)}
        onSave={(theme) => {
          setBioData({ ...bioData, theme });
          setShowAppearanceEditor(false);
        }}
        initialTheme={bioData.theme}
      />
    );
  }

  if (showLinkWizard) {
    return (
      <MobileLinkWizard
        onClose={() => {
          setShowLinkWizard(false);
          setEditingLink(null);
        }}
        onComplete={(linkData) => {
          if (editingLink) {
            // Update existing link
            const newLinks = [...bioData.links];
            newLinks[parseInt(editingLink.id)] = linkData;
            setBioData({ ...bioData, links: newLinks });
            toast.success('Lien mis à jour');
          } else {
            // Add new link
            setBioData({
              ...bioData,
              links: [...bioData.links, linkData]
            });
            toast.success('Lien ajouté au Link in bio');
          }
          setShowLinkWizard(false);
          setEditingLink(null);
        }}
        initialData={editingLink || undefined}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b border-border bg-white dark:bg-gray-900 safe-area-top">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-target active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setShowSubscriptionEditor(true)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="tracking-tight">
            <span className="text-foreground">open</span>
          </span>
          <Badge variant="secondary" className="bg-[#FFA500] text-white border-none text-xs px-2 py-0.5">
            Starter
          </Badge>
        </button>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Action buttons */}
      <div className="px-4 sm:px-6 md:px-8 py-3 border-b border-border bg-white dark:bg-gray-900 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 rounded-xl h-11"
          onClick={() => setShowAppearanceEditor(true)}
        >
          Modifier l'apparence
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl h-11 w-11 shrink-0"
          onClick={handlePreview}
        >
          <Eye className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl h-11 w-11 shrink-0"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Content - Preview Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Preview Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg max-w-md mx-auto">
            {/* Background Image */}
            <div className={`relative h-48 ${getGradientClass(bioData.theme)}`}>
              <input
                type="file"
                id="background-image"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
              />
              <label
                htmlFor="background-image"
                className="absolute top-4 right-4 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors border border-white/30">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pb-6">
              {/* Profile Image */}
              <div className="relative -mt-16 mb-4">
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-image"
                  className="block w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-900 cursor-pointer hover:opacity-80 transition-opacity relative group"
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                      <Plus className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </label>
              </div>

              {/* Username */}
              <div className="mb-2">
                <Input
                  type="text"
                  placeholder="Nom d'utilisateur..."
                  value={bioData.username}
                  onChange={(e) => setBioData({ ...bioData, username: e.target.value })}
                  className="border-0 px-0 focus-visible:ring-0 placeholder:text-gray-400"
                />
              </div>

              {/* Bio */}
              <div className="mb-6">
                <Textarea
                  placeholder="Ajouter une bio..."
                  value={bioData.bio}
                  onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                  className="border-0 px-0 focus-visible:ring-0 resize-none min-h-[40px] text-sm text-gray-600 dark:text-gray-400 placeholder:text-gray-400"
                  rows={2}
                />
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                {bioData.links.map((link: LinkItem, index: number) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    {/* Link Card */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-start gap-3 p-3">
                        {/* Add button */}
                        <button className="w-6 h-6 shrink-0 mt-1 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 transition-colors">
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-3">
                            {/* Text content */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium mb-1 line-clamp-2">{link.title}</p>
                              {link.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{link.description}</p>
                              )}
                            </div>

                            {/* Thumbnail */}
                            {link.thumbnail && (
                              <div className="w-20 h-20 shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img 
                                  src={link.thumbnail} 
                                  alt={link.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Menu button */}
                        <button 
                          onClick={() => handleEditLink(index)}
                          className="w-6 h-6 shrink-0 mt-1 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Delete button - appears on hover */}
                    <button
                      onClick={() => handleDeleteLink(index)}
                      className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add Link Button */}
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-12 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#3399ff] hover:bg-[#3399ff]/5 transition-all"
                  onClick={() => setShowLinkWizard(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter un lien
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="border-t border-border bg-white dark:bg-gray-900 p-4 pb-safe-enhanced">
        <Button
          onClick={handleSave}
          className="w-full bg-[#3399ff] hover:bg-[#2277dd] text-white rounded-xl h-12"
        >
          {editMode ? 'Mettre à jour' : 'Créer le Link in bio'}
        </Button>
      </div>
    </div>
  );
}
