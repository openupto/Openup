import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Shield, User, Mail, CheckCircle, Clock, Trash2, UserPlus, AlertCircle, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
  SelectValue 
} from '../ui/select';
import { Label } from '../ui/label';
import { useAuth } from '../auth-context';
import { teamsAPI } from '../../utils/supabase/api';
import { toast } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';

interface TeamViewProps {
  isMobile?: boolean;
}

interface TeamMember {
  id: string; // membership id
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
  profile: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
  status: string;
}

export function TeamView({ isMobile = false }: TeamViewProps) {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    try {
      setIsLoading(true);
      const { data: teams, error: teamsError } = await teamsAPI.getUserTeams(user!.id);
      
      if (teamsError) throw teamsError;
      
      if (teams && teams.length > 0) {
        const currentTeamId = teams[0].id;
        setTeamId(currentTeamId);
        
        const { data: membersData, error: membersError } = await teamsAPI.getTeamMembers(currentTeamId);
        if (membersError) throw membersError;
        setMembers(membersData as any[] || []);

        const { data: invitesData, error: invitesError } = await teamsAPI.getPendingInvites(currentTeamId);
        if (invitesError) console.warn("Could not fetch invites", invitesError); 
        setInvites(invitesData as any[] || []);
      } else {
        setMembers([]); 
      }
    } catch (e) {
      console.error("Error loading team:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@') || !teamId) return;

    setIsInviting(true);
    try {
      // Use Edge Function
      const response = await teamsAPI.inviteMemberEdge(teamId, inviteEmail, inviteRole);
      
      // Edge functions usually return JSON directly, but invokeEdgeFunction wrapper handles errors
      // The wrapper returns response.json()
      
      const { accept_url } = response;
      
      toast.success(
        <div className="flex flex-col gap-2">
            <span>Invitation envoyée à {inviteEmail}</span>
            {accept_url && (
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs bg-white text-black border-gray-200 hover:bg-gray-100"
                    onClick={() => {
                        navigator.clipboard.writeText(accept_url);
                        toast.info("Lien copié !");
                    }}
                >
                    <Copy className="w-3 h-3 mr-1.5" />
                    Copier le lien
                </Button>
            )}
        </div>,
        { duration: 5000 }
      );

      setIsInviteOpen(false);
      setInviteEmail('');
      setInviteRole('editor');
      
      // Refresh invites
      const { data } = await teamsAPI.getPendingInvites(teamId);
      setInvites(data as any[] || []);
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Erreur lors de l'invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    if (!confirm('Annuler cette invitation ?')) return;
    try {
       await teamsAPI.deleteInvite(inviteId);
       setInvites(invites.filter(i => i.id !== inviteId));
       toast.success('Invitation annulée');
    } catch (e) {
       toast.error('Erreur');
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
      if(!teamId) return;
      if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return;
      try {
          await teamsAPI.removeMember(userId, teamId);
          setMembers(members.filter(m => m.id !== memberId));
          toast.success('Membre retiré');
      } catch (e) {
          toast.error('Erreur lors de la suppression');
      }
  };

  const getRoleBadge = (role: string) => {
     const styles: Record<string, string> = {
        owner: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        viewer: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
     };
     const labels: Record<string, string> = {
         owner: 'Owner',
         editor: 'Editor',
         viewer: 'Viewer'
     };
     return (
        <Badge variant="outline" className={`${styles[role] || ""} backdrop-blur-md`}>
            {labels[role] || role}
        </Badge>
     );
  };

  const filteredMembers = members.filter(member => 
      member.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check current user role
  const currentUserMember = members.find(m => m.user_id === user?.id);
  const isOwner = currentUserMember?.role === 'owner';

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  const isEmptyState = members.length === 0;

  return (
    <div className={`max-w-7xl mx-auto space-y-8 ${isMobile ? 'pb-24 px-4 py-6' : 'p-8'}`}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestion de l'équipe</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    Gérez les membres qui ont accès à votre espace de travail
                </p>
            </div>
            
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all rounded-xl px-6 h-12 text-base">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Inviter un membre
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Inviter un membre</DialogTitle>
                        <DialogDescription>
                            Envoyez une invitation pour rejoindre l'équipe.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="collegue@entreprise.com"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rôle</Label>
                            <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="editor">Editor (Peut modifier)</SelectItem>
                                    <SelectItem value="viewer">Viewer (Lecture seule)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Annuler</Button>
                        <Button onClick={handleInvite} disabled={isInviting || !inviteEmail} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isInviting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Envoyer l'invitation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {/* Empty State */}
        {isEmptyState ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl border-dashed">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Aucun membre pour le moment</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-base">
                    Vous êtes seul dans cette équipe. Invitez des collaborateurs pour travailler ensemble.
                </p>
                <Button onClick={() => setIsInviteOpen(true)} variant="outline" className="border-gray-300 dark:border-gray-700">
                    Inviter un membre
                </Button>
            </div>
        ) : (
            <>
                {/* Pending Invites Section */}
                {invites.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Invitations en attente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {invites.map((invite) => (
                                <Card key={invite.id} className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-md border border-orange-200 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-all">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{invite.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs font-normal">
                                                        {invite.role}
                                                    </Badge>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        En attente
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {isOwner && (
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => handleDeleteInvite(invite.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Members List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Membres ({filteredMembers.length})</h3>
                         {/* Optional Search */}
                         <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Rechercher..." 
                                className="pl-9 h-9 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                         </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => (
                            <Card key={member.id} className="group bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700 shadow-sm">
                                                <AvatarImage src={member.profile?.avatar_url} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                                                    {member.profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                                                    {member.profile?.full_name || 'Utilisateur'}
                                                </h4>
                                                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                                    {member.profile?.email}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Dropdown Menu - Only for Owner and not on themselves (unless leaving team?) */}
                                        {isOwner && member.role !== 'owner' ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem disabled>Modifier le rôle (Bientôt)</DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                        onClick={() => handleRemoveMember(member.id, member.user_id)}
                                                    >
                                                        Retirer de l'équipe
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : null}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        {getRoleBadge(member.role)}
                                        {member.user_id === user?.id && (
                                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                                Vous
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </>
        )}
    </div>
  );
}
