import { useState, useEffect } from 'react';
import { LinkBioPage, LinkBioTheme, linkBioAPI } from '../../utils/supabase/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../auth-context';

interface SettingsTabProps {
  page: LinkBioPage;
  theme: LinkBioTheme | null;
  onUpdate: () => void;
}

export function SettingsTab({ page, theme, onUpdate }: SettingsTabProps) {
  const { user } = useAuth();
  const [slug, setSlug] = useState(page.username);
  const [displayName, setDisplayName] = useState(theme?.display_name || '');
  const [seoTitle, setSeoTitle] = useState(theme?.seo_title || '');
  const [seoDesc, setSeoDesc] = useState(theme?.seo_description || '');
  const [loading, setLoading] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setSlug(page.username);
    setDisplayName(theme?.display_name || '');
    setSeoTitle(theme?.seo_title || '');
    setSeoDesc(theme?.seo_description || '');
  }, [page, theme]);

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // 1. Update Theme Settings (Display Name)
      await linkBioAPI.updateTheme(page.id, { display_name: displayName });
      
      // 2. Update Slug (Page) if changed
      if (slug !== page.username) {
        // Validate slug
        if (slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
           toast.error("Le slug doit contenir au moins 3 caractères alphanumériques.");
           setLoading(false);
           return;
        }

        const isTaken = await linkBioAPI.checkUsername(slug);
        if (isTaken) {
           toast.error("Ce slug est déjà pris.");
           setLoading(false);
           return;
        }

        await linkBioAPI.updatePage(page.id, { username: slug });
      }

      toast.success("Paramètres mis à jour");
      onUpdate(); 
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSEO = async () => {
    setLoading(true);
    try {
      await linkBioAPI.updateTheme(page.id, { 
        seo_title: seoTitle,
        seo_description: seoDesc
      });
      toast.success("SEO mis à jour");
      onUpdate();
    } catch (e) {
      toast.error("Erreur sauvegarde SEO");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr ? Cette action est irréversible.")) return;
    try {
      setLoading(true);
      await linkBioAPI.deletePage(page.id);
      toast.success("Page supprimée");
      // Redirect handled by parent component observing list change or simple reload/callback
      window.location.reload(); 
    } catch (e) {
      toast.error("Erreur suppression");
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
     if (!user) return;
     if (page.is_active) {
       toast.error("Vous ne pouvez pas désactiver la page active directement. Activez une autre page.");
       return;
     }
     try {
       await linkBioAPI.setPageActive(page.id, user.id);
       toast.success("Page activée");
       onUpdate();
     } catch (e) {
       toast.error("Erreur d'activation");
     }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Général</CardTitle>
          <CardDescription>Informations de base de votre page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom de la page (Public)</Label>
            <Input 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              placeholder="Mon Profil"
            />
            <p className="text-xs text-gray-500">Affiché en haut de votre page Link in Bio.</p>
          </div>

          <div className="space-y-2">
            <Label>Slug URL</Label>
            <div className="flex items-center">
              <span className="bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-md px-3 py-2 text-sm text-gray-500">
                openup.to/u/
              </span>
              <Input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="rounded-l-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t bg-gray-50/50 dark:bg-gray-900/50 py-3">
          <Button onClick={handleSaveGeneral} disabled={loading}>
             {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </CardFooter>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
           <CardTitle>Visibilité</CardTitle>
           <CardDescription>Gérez l'état de votre page.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
           <div>
             <div className="font-medium flex items-center gap-2">
               Statut actuel : 
               {page.is_active ? (
                 <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Actif</span>
               ) : (
                 <span className="text-gray-500">Inactif</span>
               )}
             </div>
             <p className="text-sm text-gray-500 mt-1">
               {page.is_active 
                 ? "Cette page est visible publiquement." 
                 : "Cette page n'est pas accessible. Activez-la pour la rendre visible."}
             </p>
           </div>
           {!page.is_active && (
             <Button onClick={handleToggleActive} variant="default">Activer cette page</Button>
           )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Optimisez votre page pour les moteurs de recherche.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Méta Titre</Label>
            <Input 
              value={seoTitle} 
              onChange={(e) => setSeoTitle(e.target.value)} 
              placeholder={displayName || page.username}
            />
          </div>
          <div className="space-y-2">
            <Label>Méta Description</Label>
            <Input 
              value={seoDesc} 
              onChange={(e) => setSeoDesc(e.target.value)} 
              placeholder="Découvrez mes liens..."
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t bg-gray-50/50 dark:bg-gray-900/50 py-3">
          <Button onClick={handleSaveSEO} disabled={loading} variant="outline">
             Enregistrer SEO
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            La suppression de cette page est définitive. Tous les liens et statistiques associés seront perdus.
          </p>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer la page
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
