import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Globe, Edit2, ChevronUp, ChevronDown, Image as ImageIcon, Smile, Upload, X, Loader2, Youtube, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { LinkBioPage, LinkBioLink, linkBioAPI, subscriptionsAPI } from '../../utils/supabase/api';
import { useAuth } from '../auth-context';

interface LinksTabProps {
  page: LinkBioPage;
  links: LinkBioLink[];
  setLinks: (links: LinkBioLink[]) => void;
  refreshLinks: () => void;
}

const SUPPORTED_ICONS = [
  { value: 'globe', label: 'Globe' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'mail', label: 'Email' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to handle both legacy and new YouTube keys
const isYoutubeKey = (key?: string | null) => key === 'youtube' || key === 'youtube_video';

export function LinksTab({ page, links, setLinks, refreshLinks }: LinksTabProps) {
  const { user } = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkBioLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [contentType, setContentType] = useState<'link' | 'youtube'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  
  // Icon / Image state
  const [mediaType, setMediaType] = useState<'none' | 'icon' | 'image'>('none');
  const [iconKey, setIconKey] = useState<string>('globe');
  const [iconUrl, setIconUrl] = useState(''); // Stores the public URL after upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setContentType('link');
    setMediaType('none');
    setIconKey('globe');
    setIconUrl('');
    setSelectedFile(null);
    setEditingLink(null);
  };

  const handleEditClick = (link: LinkBioLink) => {
    setTitle(link.title || '');
    setUrl(link.url || '');
    
    // Check if it's a YouTube video (valid key + valid ID)
    const videoId = getYoutubeId(link.url || '');
    if (isYoutubeKey(link.icon_key) && videoId) {
        setContentType('youtube');
        setMediaType('none');
    } else {
        setContentType('link');
        // Determine media type based on what data exists
        if (link.icon_url) {
            setMediaType('image');
            setIconUrl(link.icon_url);
            setSelectedFile(null);
        } else if (link.icon_key) {
            setMediaType('icon');
            setIconKey(link.icon_key);
        } else {
            setMediaType('none');
        }
    }

    setEditingLink(link);
  };

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      subscriptionsAPI.getUserSubscription(user.id).then(({ data }) => {
        if (data?.plan?.code === 'pro' || data?.plan?.code === 'business') {
          setIsPremium(true);
        }
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('L\'image ne doit pas dépasser 1MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddLink = async () => {
    // Validation based on content type
    if (contentType === 'link') {
        if (!title.trim()) {
            toast.error('Le titre est requis');
            return;
        }
    } 

    let safeUrl = url.trim();
    let finalIconKey = mediaType === 'icon' ? iconKey : undefined;

    if (contentType === 'youtube') {
        const videoId = getYoutubeId(safeUrl);
        if (!videoId) {
            toast.error("URL YouTube invalide");
            return;
        }

        // Check limits: Count only actual video embeds
        const videoCount = safeLinks.filter(l => isYoutubeKey(l.icon_key) && getYoutubeId(l.url)).length;
        if (videoCount >= 1 && !isPremium) {
             toast.error("Limite atteinte : 1 vidéo max (Plan Gratuit)");
             return;
        }

        safeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // FORCE 'youtube' key for all new videos
        finalIconKey = 'youtube';
        
    } else {
        if (!safeUrl.match(/^https?:\/\//)) {
            safeUrl = 'https://' + safeUrl;
        }
    }
    
    const finalTitle = title.trim() || (contentType === 'youtube' ? 'Vidéo YouTube' : 'Lien');

    if (!page?.id || !user) {
      toast.error('Erreur session');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload image if selected
      let uploadedUrl = '';
      if (contentType === 'link' && mediaType === 'image' && selectedFile) {
         const result = await linkBioAPI.uploadLinkAsset(user.id, page.id, selectedFile);
         if (result.error || !result.data) {
             throw new Error("Erreur upload image");
         }
         uploadedUrl = result.data.publicUrl;
      }

      // 2. Create link
      const payload = {
        page_id: page.id,
        title: finalTitle,
        url: safeUrl,
        is_active: true,
        icon_key: finalIconKey,
        icon_url: (contentType === 'link' && mediaType === 'image' && uploadedUrl) ? uploadedUrl : undefined
      };

      console.log("Insert payload:", payload); // Debug logging

      const { error } = await linkBioAPI.createLink(payload);

      if (error) throw error;

      toast.success(contentType === 'youtube' ? 'Vidéo ajoutée' : 'Lien ajouté');
      resetForm();
      setIsAddOpen(false);
      refreshLinks();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Impossible d’ajouter la vidéo. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink || !url || !user) return;
    
    if (contentType === 'link' && !title) {
         toast.error('Le titre est requis');
         return;
    }

    let safeUrl = url.trim();
    let finalIconKey = mediaType === 'icon' ? iconKey : null as any;

    if (contentType === 'youtube') {
         const videoId = getYoutubeId(safeUrl);
         if (!videoId) {
            toast.error("URL YouTube invalide");
            return;
         }
         safeUrl = `https://www.youtube.com/watch?v=${videoId}`;
         finalIconKey = 'youtube'; // FORCE 'youtube' key
    } else {
        if (!safeUrl.match(/^https?:\/\//)) {
           safeUrl = 'https://' + safeUrl;
        }
    }

    setIsLoading(true);
    try {
      let uploadedUrl = editingLink.icon_url;

      if (contentType === 'link' && mediaType === 'image' && selectedFile) {
          const result = await linkBioAPI.uploadLinkAsset(user.id, page.id, selectedFile);
          if (result.error || !result.data) {
               throw new Error("Erreur upload image");
          }
          uploadedUrl = result.data.publicUrl;
      }
      
      if (contentType === 'youtube') {
          uploadedUrl = null as any;
      }

      const updateData: Partial<LinkBioLink> = {
        title: title || (contentType === 'youtube' ? 'Vidéo YouTube' : 'Lien'),
        url: safeUrl,
        icon_key: finalIconKey,
        icon_url: contentType === 'link' && mediaType === 'image' ? uploadedUrl : null as any
      };

      console.log("Update payload:", updateData);

      const { error } = await linkBioAPI.updateLink(editingLink.id, updateData);

      if (error) throw error;
      toast.success('Lien modifié');
      resetForm();
      refreshLinks();
    } catch (error) {
      console.error(error);
      toast.error('Impossible de modifier le lien. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (link: LinkBioLink) => {
    if (!confirm('Supprimer ce lien ?')) return;
    try {
      await linkBioAPI.deleteLink(link.id);
      toast.success('Lien supprimé');
      setLinks(links.filter(l => l.id !== link.id));
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (link: LinkBioLink) => {
    const newStatus = !link.is_active;
    setLinks(links.map(l => l.id === link.id ? { ...l, is_active: newStatus } : l));
    try {
      await linkBioAPI.updateLink(link.id, { is_active: newStatus });
    } catch (error) {
      console.error(error);
      toast.error('Erreur de mise à jour');
      refreshLinks();
    }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    if (!links) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setLinks(newLinks);

    try {
      const updates = newLinks.map((link, idx) => ({
        id: link.id,
        order_index: idx
      }));
      await Promise.all(updates.map(u => linkBioAPI.updateLink(u.id, { order_index: u.order_index })));
    } catch (error) {
      console.error(error);
      toast.error('Erreur de réorganisation');
      refreshLinks();
    }
  };

  const safeLinks = Array.isArray(links) ? links : [];

  const MediaSelector = () => (
      <div className="space-y-4 pt-2">
          <Label>Média (Optionnel)</Label>
          <div className="flex gap-4">
              <Button 
                type="button" 
                variant={mediaType === 'none' ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType('none')}
              >
                  Aucun
              </Button>
              <Button 
                type="button"
                variant={mediaType === 'icon' ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType('icon')}
              >
                  <Smile className="w-4 h-4 mr-2" />
                  Icône
              </Button>
              <Button 
                type="button"
                variant={mediaType === 'image' ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType('image')}
              >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
              </Button>
          </div>

          {mediaType === 'icon' && (
              <div className="space-y-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Label>Choisir une icône</Label>
                  <Select value={iconKey} onValueChange={setIconKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_ICONS.map(icon => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                             <img 
                               src={`https://simpleicons.org/icons/${icon.value === 'globe' ? 'googleearth' : icon.value === 'mail' ? 'gmail' : icon.value === 'phone' ? 'googlephone' : icon.value}.svg`}
                               className="w-4 h-4 dark:invert"
                               alt=""
                             />
                             {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 flex justify-center">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                         <img 
                           src={`https://simpleicons.org/icons/${iconKey === 'globe' ? 'googleearth' : iconKey === 'mail' ? 'gmail' : iconKey === 'phone' ? 'googlephone' : iconKey}.svg`}
                           className="w-6 h-6"
                           alt=""
                         />
                      </div>
                  </div>
              </div>
          )}

          {mediaType === 'image' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                      <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir une image
                      </Button>
                      <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/png,image/jpeg,image/webp,image/svg+xml" 
                          className="hidden" 
                          onChange={handleFileChange}
                      />
                      {selectedFile && <span className="text-sm truncate max-w-[150px]">{selectedFile.name}</span>}
                  </div>
                  
                  {/* Preview */}
                  {(selectedFile || iconUrl) && (
                      <div className="mt-2">
                          <Label className="mb-2 block">Aperçu</Label>
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
                              <img 
                                  src={selectedFile ? URL.createObjectURL(selectedFile) : iconUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                              />
                          </div>
                      </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Formats acceptés: PNG, JPG, SVG. Max 1MB.
                  </p>
              </div>
          )}
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vos liens</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un lien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter du contenu</DialogTitle>
              <DialogDescription className="text-gray-500">
                Ajoutez un lien ou une vidéo YouTube à votre page.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="link" value={contentType} onValueChange={(v) => setContentType(v as any)} className="w-full py-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link" className="flex gap-2"><LinkIcon className="w-4 h-4"/> Lien</TabsTrigger>
                <TabsTrigger value="youtube" className="flex gap-2"><Youtube className="w-4 h-4"/> YouTube</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Titre <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="Mon super site" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="https://..." 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                    />
                  </div>
                  <MediaSelector />
              </TabsContent>

              <TabsContent value="youtube" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>URL de la vidéo YouTube <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="https://youtube.com/watch?v=..." 
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                    />
                    <p className="text-xs text-gray-500">Collez un lien YouTube (youtube.com ou youtu.be)</p>
                  </div>
                  
                  {getYoutubeId(url) && (
                      <div className="rounded-lg overflow-hidden border aspect-video bg-black shadow-sm">
                          <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${getYoutubeId(url)}`} 
                              title="YouTube video player"
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full h-full"
                          ></iframe>
                      </div>
                  )}

                   <div className="space-y-2">
                    <Label>Titre (Optionnel)</Label>
                    <Input 
                      placeholder="Titre de la vidéo" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
              <Button onClick={handleAddLink} disabled={isLoading || (contentType === 'link' ? (!title || !url) : !url)}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {safeLinks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <Globe className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pas encore de liens</h3>
          <p className="text-sm text-gray-500 mt-1">Ajoutez votre premier lien pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {safeLinks.map((link, index) => {
            if (!link) return null;
            
            // Logic to show icon/image in list item
            let Thumbnail = <Globe className="w-5 h-5 text-gray-400" />;
            const isVideo = isYoutubeKey(link.icon_key) && getYoutubeId(link.url);
            
            if (isVideo) {
                 const videoId = getYoutubeId(link.url)!; // Verified by isVideo
                 Thumbnail = <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover scale-110" />;
            } else if (link.icon_url) {
                Thumbnail = <img src={link.icon_url} alt="" className="w-full h-full object-cover" />;
            } else if (link.icon_key) {
                Thumbnail = (
                    <img 
                        src={`https://simpleicons.org/icons/${link.icon_key === 'globe' ? 'googleearth' : link.icon_key === 'mail' ? 'gmail' : link.icon_key === 'phone' ? 'googlephone' : link.icon_key}.svg`}
                        className="w-5 h-5 dark:invert"
                        alt=""
                    />
                );
            }

            return (
              <Card key={link.id || index} className={`group overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-all ${isVideo ? 'border-l-4 border-l-red-500' : 'hover:border-blue-500/30'}`}>
                <CardContent className="p-0 flex items-center">
                  <div className="w-10 self-stretch bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-800 cursor-move text-gray-400 gap-1">
                      <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="hover:text-blue-600 disabled:opacity-30 p-1">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <GripVertical className="w-4 h-4" />
                      <button onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="hover:text-blue-600 disabled:opacity-30 p-1">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                  </div>
                  
                  <div className="flex-1 p-4 min-w-0">
                      {editingLink?.id === link.id ? (
                        <div className="space-y-4">
                          {contentType === 'youtube' ? (
                              <div className="grid gap-3">
                                <Label>Modifier la vidéo YouTube</Label>
                                <Input 
                                  value={url} 
                                  onChange={e => setUrl(e.target.value)} 
                                  placeholder="https://youtube.com/..."
                                />
                                {getYoutubeId(url) && (
                                   <div className="rounded-md overflow-hidden border aspect-video bg-black h-32 w-auto self-start relative group-preview">
                                      <img src={`https://img.youtube.com/vi/${getYoutubeId(url)}/mqdefault.jpg`} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                          <Youtube className="w-8 h-8 text-white" />
                                      </div>
                                   </div>
                                )}
                                <Input 
                                  value={title} 
                                  onChange={e => setTitle(e.target.value)} 
                                  placeholder="Titre (Optionnel)"
                                />
                              </div>
                          ) : (
                              <div className="grid gap-3">
                                <Input 
                                  value={title} 
                                  onChange={e => setTitle(e.target.value)} 
                                  placeholder="Titre"
                                />
                                <Input 
                                  value={url} 
                                  onChange={e => setUrl(e.target.value)} 
                                  placeholder="URL"
                                />
                                <MediaSelector />
                              </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdateLink} disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2"/> : null}
                                Enregistrer
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingLink(null)}>Annuler</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                             <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                                {Thumbnail}
                             </div>

                             <div className="min-w-0">
                               <h4 className="font-medium truncate text-gray-900 dark:text-gray-100">{link.title}</h4>
                               <p className="text-xs text-gray-500 truncate">{link.url}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 mr-2">
                              <Switch 
                                checked={link.is_active} 
                                onCheckedChange={() => handleToggleActive(link)}
                              />
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-500 hover:text-blue-600"
                              onClick={() => handleEditClick(link)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                              onClick={() => handleDeleteLink(link)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
