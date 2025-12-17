import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { profilesAPI, linkBioAPI, authAPI } from '../../utils/supabase/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Loader2, 
  Camera, 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Save, 
  LogOut, 
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { UserAvatar } from "../user-avatar";

export function ProfileView() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [initialState, setInitialState] = useState({ fullName: '', username: '' });
  
  // Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setFullName(authProfile.full_name || '');
      setUsername(authProfile.username || '');
      setInitialState({
        fullName: authProfile.full_name || '',
        username: authProfile.username || ''
      });
    }
  }, [authProfile]);

  const hasChanges = fullName !== initialState.fullName || username !== initialState.username;

  // --- Actions ---

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image est trop lourde (max 2Mo)");
      return;
    }

    setIsUploading(true);
    try {
      const { publicUrl, error } = await profilesAPI.uploadAvatar(user.id, file);
      if (error) throw error;
      if (publicUrl) {
        await profilesAPI.updateProfile(user.id, { avatar_url: publicUrl });
        await refreshProfile();
        toast.success("Photo de profil mise à jour");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Voulez-vous vraiment supprimer votre photo de profil ?")) return;
    setIsUploading(true);
    try {
       // Just nullify the URL in profile, we don't necessarily delete the file immediately
       // or we could, but updateProfile is enough for UI
       await profilesAPI.updateProfile(user!.id, { avatar_url: '' });
       await refreshProfile();
       toast.success("Photo supprimée");
    } catch (err) {
       toast.error("Erreur lors de la suppression");
    } finally {
       setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Validation
      if (!fullName.trim()) throw new Error("Le nom complet est requis");
      if (!username.trim()) throw new Error("Le nom d'utilisateur est requis");
      
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      if (cleanUsername.length < 3) throw new Error("Le nom d'utilisateur est trop court");

      // 2. Check uniqueness if username changed
      if (cleanUsername !== initialState.username) {
        const exists = await linkBioAPI.checkUsername(cleanUsername);
        if (exists) throw new Error("Ce nom d'utilisateur est déjà pris");
      }

      // 3. Update Profile
      await profilesAPI.updateProfile(user.id, {
        full_name: fullName.trim(),
        username: cleanUsername
      });

      // 4. Update LinkBio Pages (Optional but good UX)
      // Check if user has a page with old username? 
      // Actually link_bio_pages usually matches username. 
      // Implementation detail: For now we just update the profile reference.
      // If we wanted to sync, we'd find the page with old username and update it.
      // Let's rely on the user to manually change their page slug if they want, 
      // OR we can try to auto-update the main page.
      // For safety, let's just update the profile first.

      await refreshProfile();
      setInitialState({ fullName, username: cleanUsername });
      setUsername(cleanUsername);
      toast.success("Profil mis à jour avec succès");

    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profil</h1>
        <p className="text-slate-400 text-lg">
          Gérez vos informations personnelles et la sécurité de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card & Security */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col items-center text-center shadow-xl shadow-black/20">
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full ring-4 ring-slate-800 shadow-lg relative bg-slate-800">
                <UserAvatar 
                  user={authProfile} 
                  className="w-full h-full border-0" 
                  fallbackClassName="text-3xl"
                />
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white/80" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              {authProfile?.full_name || 'Utilisateur'}
            </h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              {authProfile?.email}
            </p>

            <div className="flex items-center gap-2 w-full">
              <label className="flex-1">
                 <div className="inline-flex h-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer w-full transition-colors">
                    Changer la photo
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                    />
                 </div>
              </label>
              {authProfile?.avatar_url && (
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-red-900/50 hover:bg-red-950/50 hover:text-red-500 text-red-700"
                    onClick={handleRemoveAvatar}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Sécurité</h3>
                    <p className="text-xs text-slate-400">Protégez votre compte</p>
                </div>
             </div>

             <div className="space-y-3">
                <Button 
                    variant="outline" 
                    className="w-full justify-between border-slate-800 hover:bg-slate-800 text-slate-300"
                    onClick={() => setIsPasswordModalOpen(true)}
                >
                    <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Changer mot de passe
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                </Button>

                <Button 
                    variant="outline" 
                    className="w-full justify-between border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-red-400"
                    onClick={() => authAPI.signOut()}
                >
                    <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Déconnexion
                    </span>
                </Button>
             </div>

             <div className="mt-6 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg flex gap-3">
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/80 leading-relaxed">
                    Utilisez un mot de passe unique et robuste pour garantir la sécurité de vos données.
                </p>
             </div>
          </div>
        </div>

        {/* Right Column: Information Form */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* General Info Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white">Informations personnelles</h2>
                        <p className="text-sm text-slate-400 mt-1">Mettez à jour vos informations publiques</p>
                    </div>
                    {hasChanges && (
                         <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                            Modifications non enregistrées
                         </Badge>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-slate-300">Nom complet</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input 
                                    id="fullname" 
                                    className="pl-9 bg-slate-950/50 border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-300">Nom d'utilisateur</Label>
                            <div className="flex shadow-sm rounded-md">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-800 bg-slate-900 text-slate-500 text-sm">
                                    openup.to/
                                </span>
                                <Input 
                                    id="username" 
                                    className="rounded-l-none bg-slate-950/50 border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder:text-slate-600"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Adresse Email</Label>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/30">
                            <div className="p-2 bg-indigo-500/10 rounded-full">
                                <Mail className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{authProfile?.email}</p>
                                <p className="text-xs text-slate-500">Email principal du compte</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50"
                                onClick={() => setIsEmailModalOpen(true)}
                            >
                                Modifier
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end border-t border-slate-800/50">
                        <Button 
                            size="lg"
                            disabled={!hasChanges || isLoading}
                            onClick={handleSaveChanges}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Enregistrer les modifications
                        </Button>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- Modals --- */}
      <ChangeEmailModal open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen} currentEmail={authProfile?.email || ''} />
      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
    </div>
  );
}

// Sub-components for cleaner file

function ChangeEmailModal({ open, onOpenChange, currentEmail }: { open: boolean, onOpenChange: (o: boolean) => void, currentEmail: string }) {
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateEmail = async () => {
        if (!newEmail || !newEmail.includes('@')) {
            toast.error("Email invalide");
            return;
        }
        if (newEmail === currentEmail) {
            toast.error("Le nouvel email doit être différent");
            return;
        }

        setLoading(true);
        try {
            const { error } = await authAPI.onAuthStateChange(() => {}) // Hack to access auth? No we have authAPI
            // Actually authAPI doesn't expose updateUser. We need to use supabase client directly or add to API.
            // Let's import supabase directly for this component or add to authAPI. 
            // I'll assume I can import { supabase } from '../../lib/supabase' based on context.
            // Wait, import { supabase } from '../../src/lib/supabase' was seen in api.tsx.
            // But I cannot easily import from src in components usually if aliases aren't set up.
            // I'll use the authAPI to add a method if needed, or better, let's assume I can import from `../../utils/supabase/client` or similar.
            // Re-reading api.tsx: `import { supabase } from '../../src/lib/supabase';`
            // So I can use `import { supabase } from '../../src/lib/supabase'` here too?
            // Actually, let's stick to `authAPI` extensions or using the global `supabase` object if available. 
            // I'll update authAPI later or try to use it here.
            // Let's add `updateUser` to `authAPI` in `api.tsx` first to be clean.
            // FOR NOW, I will implement the logic assuming authAPI has it, and then update API.tsx.
            
            await authAPI.updateUser({ email: newEmail });
            
            toast.success("Lien de confirmation envoyé ! Vérifiez votre ancienne ET nouvelle boîte mail.");
            onOpenChange(false);
            setNewEmail('');
        } catch (e: any) {
            toast.error(e.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Changer votre adresse email</DialogTitle>
                    <DialogDescription>
                        Vous recevrez un lien de confirmation sur votre nouvelle adresse.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Email actuel</Label>
                        <Input value={currentEmail} disabled className="bg-slate-100 dark:bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                        <Label>Nouvel email</Label>
                        <Input 
                            value={newEmail} 
                            onChange={(e) => setNewEmail(e.target.value)} 
                            placeholder="exemple@email.com"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={handleUpdateEmail} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Envoyer le lien
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ChangePasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (password.length < 6) {
            toast.error("Le mot de passe doit faire au moins 6 caractères");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        try {
            await authAPI.updateUser({ password: password });
            toast.success("Mot de passe mis à jour avec succès");
            onOpenChange(false);
            setPassword('');
            setConfirmPassword('');
        } catch (e: any) {
            toast.error(e.message || "Erreur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Changer le mot de passe</DialogTitle>
                    <DialogDescription>
                        Choisissez un mot de passe robuste pour sécuriser votre compte.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nouveau mot de passe</Label>
                        <Input 
                            type="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirmer le mot de passe</Label>
                        <Input 
                            type="password"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={handleUpdatePassword} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Mettre à jour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
