import { useState } from 'react';
import { useLinkBio } from './link-bio-context';
import { useAuth } from './auth-context';
import { LinkInBioProfile } from './link-in-bio-profile';
import { AppearanceTab } from './appearance-tab';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  MoreVertical, 
  BarChart3, 
  Trash2, 
  ExternalLink,
  Smartphone,
  Layout,
  Copy,
  Link as LinkIcon,
  Palette,
  ChevronUp,
  ChevronDown,
  Globe,
  Loader2,
  Pencil
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { copyToClipboard } from '../utils/clipboard';
import { linkBioAPI } from '../utils/supabase/api';

export function ModernLinkInBio() {
  const { 
    page, 
    links, 
    theme, 
    loading, 
    createPage, 
    addLink, 
    updateLink, 
    deleteLink, 
    reorderLinks 
  } = useLinkBio();

  const [activeTab, setActiveTab] = useState<'links' | 'appearance'>('links');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  
  // Link editing state
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Add Link Modal
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleCreatePage = async () => {
    if (!newUsername.trim()) return;
    const success = await createPage(newUsername.toLowerCase().trim());
    if (success) setIsCreateOpen(false);
  };

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) return;
    await addLink(newLinkTitle, newLinkUrl);
    setIsAddLinkOpen(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleStartEdit = (link: any) => {
    setEditingLinkId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleSaveEdit = async (id: string) => {
    await updateLink(id, { title: editTitle, url: editUrl });
    setEditingLinkId(null);
  };

  const handleMoveLink = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    
    await reorderLinks(newLinks);
  };

  const handleCopyUrl = () => {
    if (!page) return;
    const url = linkBioAPI.getLinkBioPublicUrl(page.username);
    copyToClipboard(url, 'Lien copié !');
  };

  const handleViewPage = () => {
    if (!page) return;
    // Use the Edge Function URL or public domain
    window.open(linkBioAPI.getLinkBioPublicUrl(page.username), '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!page) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-8">
            <Layout className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crée ton Link in Bio
          </h1>
          <p className="text-gray-500 text-lg">
            Rassemble tous tes liens en une seule page magnifique. Comme Linktree, mais intégré à OpenUp.
          </p>

          <Button 
            size="lg" 
            onClick={() => setIsCreateOpen(true)}
            className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white rounded-full transition-all hover:scale-105"
          >
            Créer mon Link in Bio
          </Button>
        </div>

        {/* Create Page Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choisis ton username</DialogTitle>
              <DialogDescription>
                Ce sera l'adresse de ta page publique : openup.to/@ton-nom
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium">openup.to/@</span>
                <Input 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  placeholder="username"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
              <Button onClick={handleCreatePage} disabled={!newUsername}>Créer la page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // --- MAIN EDITOR ---
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col xl:flex-row gap-8 overflow-hidden">
      
      {/* LEFT COLUMN - Management */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Link in Bio</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">@{page.username}</span>
              <button onClick={handleCopyUrl} className="hover:text-blue-600 transition-colors">
                <Copy className="w-3 h-3" />
              </button>
              <span className="mx-1">•</span>
              <button onClick={handleViewPage} className="flex items-center hover:text-blue-600 transition-colors">
                <ExternalLink className="w-3 h-3 mr-1" />
                Voir ma page
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {activeTab === 'links' && (
              <Button onClick={() => setIsAddLinkOpen(true)} className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un bouton
              </Button>
             )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6 mb-6">
            <TabsTrigger 
              value="links" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Liens
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2"
            >
              <Palette className="w-4 h-4 mr-2" />
              Apparence
            </TabsTrigger>
          </TabsList>

          {/* TAB LINKS */}
          <TabsContent value="links" className="flex-1 overflow-y-auto pr-2 pb-20 m-0">
            {links.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl">
                 <p className="text-gray-500 mb-4">Tu n'as aucun bouton pour le moment.</p>
                 <Button variant="outline" onClick={() => setIsAddLinkOpen(true)}>Ajouter mon premier lien</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {links.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      layout
                    >
                      <Card className={`
                        transition-all border-gray-200 dark:border-gray-800 
                        ${!link.is_active ? 'opacity-60 bg-gray-50' : 'bg-white hover:shadow-md'}
                      `}>
                        <CardContent className="p-4 flex items-center gap-4">
                          
                          {/* Drag / Reorder */}
                          <div className="flex flex-col items-center gap-1 text-gray-300">
                             <button 
                               onClick={() => handleMoveLink(index, 'up')}
                               disabled={index === 0}
                               className="hover:text-blue-500 disabled:opacity-0 p-0.5"
                             >
                               <ChevronUp className="w-4 h-4" />
                             </button>
                             <MoreVertical className="w-4 h-4" />
                             <button 
                               onClick={() => handleMoveLink(index, 'down')}
                               disabled={index === links.length - 1}
                               className="hover:text-blue-500 disabled:opacity-0 p-0.5"
                             >
                               <ChevronDown className="w-4 h-4" />
                             </button>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {editingLinkId === link.id ? (
                              <div className="space-y-2">
                                <Input 
                                  value={editTitle} 
                                  onChange={(e) => setEditTitle(e.target.value)} 
                                  placeholder="Titre du bouton"
                                  className="font-semibold h-8"
                                />
                                <Input 
                                  value={editUrl} 
                                  onChange={(e) => setEditUrl(e.target.value)} 
                                  placeholder="https://..."
                                  className="text-sm h-8"
                                />
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" onClick={() => handleSaveEdit(link.id)}>Enregistrer</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingLinkId(null)}>Annuler</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="group cursor-pointer" onClick={() => handleStartEdit(link)}>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{link.title}</h3>
                                  <Pencil className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-sm text-gray-500 truncate">{link.url}</div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                            <Switch 
                              checked={link.is_active}
                              onCheckedChange={(checked) => updateLink(link.id, { is_active: checked })}
                            />
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStartEdit(link)}>
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => deleteLink(link.id)}
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* TAB APPEARANCE */}
          <TabsContent value="appearance" className="flex-1 overflow-y-auto pr-2 pb-20 m-0">
             <AppearanceTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT COLUMN - Preview */}
      <div className="hidden xl:flex flex-col w-[400px] flex-shrink-0 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 items-center justify-center relative">
        <div className="absolute top-6 left-0 w-full text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            Aperçu en direct
          </h3>
        </div>

        {/* Phone Frame */}
        <div className="relative w-[320px] h-[640px] bg-gray-950 rounded-[40px] shadow-2xl border-[8px] border-gray-800 overflow-hidden">
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl z-20"></div>
           
           {/* Screen Content */}
           <div className="w-full h-full overflow-y-auto scrollbar-hide bg-white">
              {theme && (
                <LinkInBioProfile 
                  page={page}
                  links={links}
                  theme={theme}
                  previewMode={true}
                />
              )}
           </div>
        </div>
        
        <div className="absolute bottom-6 w-full text-center">
           <Button variant="link" onClick={handleViewPage} className="text-gray-500 hover:text-blue-600">
             Voir la page réelle <ExternalLink className="w-3 h-3 ml-1" />
           </Button>
        </div>
      </div>

      {/* ADD LINK DIALOG */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un bouton</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input 
                value={newLinkTitle} 
                onChange={(e) => setNewLinkTitle(e.target.value)} 
                placeholder="Ex: Mon Site Web"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                value={newLinkUrl} 
                onChange={(e) => setNewLinkUrl(e.target.value)} 
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsAddLinkOpen(false)}>Annuler</Button>
             <Button onClick={handleAddLink} disabled={!newLinkTitle || !newLinkUrl}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
