import { useState, useEffect } from 'react';
import { 
  Plus, Search, MoreHorizontal, ExternalLink, 
  Copy, Trash2, Edit, Loader2, CheckCircle2, Files, Eye, Power 
} from 'lucide-react';
import { LinkBioPage, linkBioAPI } from '../../utils/supabase/api';
import { useAuth } from '../auth-context';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../../utils/clipboard';

interface BioPagesListProps {
  onEditPage: (page: LinkBioPage) => void;
}

export function BioPagesList({ onEditPage }: BioPagesListProps) {
  const { user } = useAuth();
  const [pages, setPages] = useState<LinkBioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchPages = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await linkBioAPI.getPages(user.id);
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [user]);

  const handleCreatePage = async () => {
    if (!user) return;
    
    // Validation
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!newUsername || newUsername.length < 3) {
      toast.error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return;
    }
    if (!usernameRegex.test(newUsername)) {
      toast.error('Caractères alphanumériques et tirets uniquement');
      return;
    }

    try {
      setIsCreating(true);
      
      // Check availability
      const isTaken = await linkBioAPI.checkUsername(newUsername);
      if (isTaken) {
        toast.error('Ce nom d\'utilisateur est déjà pris');
        setIsCreating(false);
        return;
      }

      const { data, error } = await linkBioAPI.createPage(user.id, newUsername);
      if (error) throw error;
      if (data) {
        toast.success('Page créée avec succès');
        setIsCreateOpen(false);
        setNewUsername('');
        fetchPages();
        onEditPage(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (pageId: string) => {
    if (!user) return;
    try {
      toast.loading('Duplication en cours...');
      await linkBioAPI.duplicatePage(pageId, user.id);
      toast.dismiss();
      toast.success('Page dupliquée');
      fetchPages();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Erreur lors de la duplication');
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.')) return;
    try {
      await linkBioAPI.deletePage(pageId);
      toast.success('Page supprimée');
      setPages(pages.filter(p => p.id !== pageId));
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSetActive = async (page: LinkBioPage) => {
    if (!user) return;
    if (page.is_active) return; // Already active

    // Optimistic update
    const previousPages = [...pages];
    setPages(pages.map(p => ({
      ...p,
      is_active: p.id === page.id
    })));

    try {
      await linkBioAPI.setPageActive(page.id, user.id);
      toast.success('Page activée');
      fetchPages(); // Refresh to ensure backend state matches
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'activation');
      setPages(previousPages); // Revert
    }
  };

  const filteredPages = pages.filter(p => 
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.link_bio_theme_settings?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6 container mx-auto max-w-6xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Link in Bio</h1>
          <p className="text-gray-500 mt-1">Gérez vos multiples pages de liens pour différents contextes.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4 mr-2" />
              Créer une page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle page</DialogTitle>
              <DialogDescription>
                Choisissez un nom d'utilisateur unique pour votre URL openup.to
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <div className="flex items-center">
                   <span className="bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-md px-3 py-2 text-sm text-gray-500">
                     openup.to/u/
                   </span>
                   <Input 
                     value={newUsername}
                     onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                     placeholder="mon-nom"
                     className="rounded-l-none"
                     autoFocus
                   />
                </div>
                <p className="text-xs text-gray-500">Lettres, chiffres et tirets uniquement.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
              <Button onClick={handleCreatePage} disabled={isCreating} className="bg-blue-600 text-white">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer la page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Rechercher une page..." 
          className="pl-10 max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredPages.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune page trouvée</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            {searchQuery ? "Aucun résultat pour votre recherche." : "Commencez par créer votre première page Link in Bio."}
          </p>
          {!searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 text-blue-600"
            >
              Créer une page maintenant
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => {
            const theme = page.link_bio_theme_settings;
            const bgStyle = theme?.background_type === 'image' && theme.bg_image_url
              ? { backgroundImage: `url(${theme.bg_image_url})`, backgroundSize: 'cover' }
              : theme?.background_type === 'gradient'
              ? { background: theme.background_value }
              : { backgroundColor: theme?.background_value || '#f3f4f6' };

            return (
              <div 
                key={page.id} 
                className={`
                  group relative bg-white dark:bg-gray-900 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col
                  ${page.is_active ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800'}
                `}
              >
                {/* Preview Thumbnail Header */}
                <div className="h-32 relative" style={bgStyle}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {page.is_active ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-none gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-white/80 backdrop-blur-md dark:bg-black/50 text-gray-600 dark:text-gray-300 shadow-sm">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Avatar Preview */}
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-900 p-1 shadow-md">
                      <div className="w-full h-full rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        {page.profile_image_url || theme?.avatar_url ? (
                          <img 
                            src={theme?.avatar_url || page.profile_image_url} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">
                            {(theme?.display_name || page.username || '?')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-12 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {theme?.display_name || `@${page.username}`}
                      </h3>
                      <div className="flex items-center gap-2">
                        <a 
                          href={linkBioAPI.getLinkBioPublicUrl(page.username)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-gray-500 hover:text-blue-600 truncate flex items-center gap-1"
                        >
                          openup.to/u/{page.username}
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEditPage(page)}>
                          <Edit className="w-4 h-4 mr-2" /> Éditer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                          <Files className="w-4 h-4 mr-2" /> Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(linkBioAPI.getLinkBioPublicUrl(page.username), 'Lien copié')}>
                          <Copy className="w-4 h-4 mr-2" /> Copier URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(page.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
                    {page.is_active ? (
                      <>
                        <Button 
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                          onClick={() => window.open(linkBioAPI.getLinkBioPublicUrl(page.username), '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button 
                          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm"
                          onClick={() => onEditPage(page)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Gérer
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={() => onEditPage(page)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Gérer
                        </Button>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20"
                          onClick={() => handleSetActive(page)}
                        >
                          <Power className="w-4 h-4 mr-2" />
                          Activer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
