import { useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { teamsAPI } from '../../utils/supabase/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2, Mail, Plus, Trash2, UserPlus, Shield, User, Eye, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

export function TeamManagement() {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (user) {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    try {
      setIsLoading(true);
      // 1. Get User's Team
      const { data: teams, error: teamsError } = await teamsAPI.getUserTeams(user!.id);
      
      if (teamsError) throw teamsError;
      
      if (teams && teams.length > 0) {
        const currentTeamId = teams[0].id;
        setTeamId(currentTeamId);
        
        // 2. Get Members
        const { data: membersData, error: membersError } = await teamsAPI.getTeamMembers(currentTeamId);
        if (membersError) throw membersError;
        setMembers(membersData as any[] || []);

        // 3. Get Invites
        const { data: invitesData, error: invitesError } = await teamsAPI.getPendingInvites(currentTeamId);
        if (invitesError) console.warn("Could not fetch invites", invitesError); // Invites might be optional or table missing
        setInvites(invitesData as any[] || []);
      }
    } catch (e) {
      console.error("Error loading team:", e);
      toast.error("Impossible de charger les données de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@') || !teamId) return;

    setIsInviting(true);
    try {
      const { error } = await teamsAPI.inviteMember(teamId, inviteEmail, inviteRole);
      if (error) throw error;
      
      toast.success(`Invitation envoyée à ${inviteEmail}`);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'editor': return <Edit2Icon />; 
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const Edit2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2 w-4 h-4 text-blue-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  );

  const getRoleBadge = (role: string) => {
     const styles = {
        owner: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
        editor: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
        viewer: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
     };
     // @ts-ignore
     return <Badge variant="outline" className={styles[role] || ""}>{role === 'owner' ? 'Propriétaire' : role === 'editor' ? 'Éditeur' : 'Lecteur'}</Badge>;
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  // If no team found, show specific empty state? 
  // Or if team exists but no members (rare since current user should be there).
  // Prompt says: "If no rows exist [in team_members], show an empty state". 
  // This implies if the array is empty.
  const isEmptyState = members.length === 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion de l'équipe</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les membres qui ont accès à votre espace de travail.
          </p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un nouveau membre</DialogTitle>
              <DialogDescription>
                Envoyez une invitation par email pour rejoindre votre équipe.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  placeholder="collegue@entreprise.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Propriétaire (Accès total)</SelectItem>
                    <SelectItem value="editor">Éditeur (Peut modifier)</SelectItem>
                    <SelectItem value="viewer">Lecteur (Lecture seule)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Annuler</Button>
              <Button onClick={handleInvite} disabled={isInviting || !inviteEmail}>
                {isInviting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Envoyer l'invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isEmptyState ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucun membre pour le moment</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Vous êtes seul dans cette équipe. Invitez des collaborateurs pour travailler ensemble.
            </p>
            <Button onClick={() => setIsInviteOpen(true)} variant="outline">
              Inviter un membre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
            {/* Active Members */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Membres actifs</CardTitle>
                    <CardDescription>{members.length} utilisateur{members.length > 1 ? 's' : ''} dans l'équipe</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={member.profile?.avatar_url} />
                                        <AvatarFallback>{member.profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{member.profile?.full_name || 'Utilisateur inconnu'}</span>
                                        {user?.id === member.user_id && <span className="text-[10px] text-blue-600 font-medium">(Vous)</span>}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-gray-500">{member.profile?.email}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getRoleBadge(member.role)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {/* Cannot remove yourself, and maybe only owners can remove? */}
                                {user?.id !== member.user_id && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-orange-600 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Invitations en attente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Email invité</TableHead>
                            <TableHead>Rôle proposé</TableHead>
                            <TableHead>Envoyée le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invites.map((invite) => (
                            <TableRow key={invite.id}>
                                <TableCell className="font-medium">{invite.email}</TableCell>
                                <TableCell>{getRoleBadge(invite.role)}</TableCell>
                                <TableCell className="text-gray-500 text-sm">
                                    {new Date(invite.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => handleDeleteInvite(invite.id)}
                                    >
                                        Annuler
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}
