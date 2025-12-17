import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Shield, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

interface TeamWorkspaceProps {
  userData: UserData | null;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  lastActive: string;
  joinedAt: string;
}

export function TeamWorkspace({ userData }: TeamWorkspaceProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: userData?.name || 'Demo User',
      email: userData?.email || 'demo@openup.com',
      role: 'admin',
      status: 'active',
      lastActive: 'Now',
      joinedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'editor',
      status: 'active',
      lastActive: '2 hours ago',
      joinedAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'viewer',
      status: 'pending',
      lastActive: 'Never',
      joinedAt: '2024-01-20'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'editor',
      status: 'inactive',
      lastActive: '1 week ago',
      joinedAt: '2024-01-10'
    }
  ];

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to all features and team management',
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can create, edit, and publish content',
      icon: Edit,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to analytics and content',
      icon: Eye,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    if (!roleData) return null;
    
    return (
      <Badge className={roleData.color}>
        <roleData.icon className="w-3 h-3 mr-1" />
        {roleData.name}
      </Badge>
    );
  };

  const handleInvite = () => {
    // Handle team member invitation
    console.log('Inviting:', inviteEmail, 'as:', selectedRole);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Team Workspace
          </h2>
          <p className="text-slate-600 mt-1">
            Collaborate with your team and manage permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white">
            NEW
          </Badge>
          <Button 
            onClick={() => setShowInviteForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <div className="text-2xl font-bold text-indigo-600">{teamMembers.length}</div>
            <div className="text-sm text-slate-600">Total Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-slate-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-slate-600">Team Activity</div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <span>Invite Team Member</span>
            </CardTitle>
            <CardDescription>
              Send an invitation to collaborate on your OpenUp workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inviteEmail">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`
                          p-2 rounded-lg border text-center transition-all duration-200
                          ${selectedRole === role.id 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <role.icon className={`w-4 h-4 mx-auto mb-1 ${
                          selectedRole === role.id ? 'text-indigo-600' : 'text-slate-400'
                        }`} />
                        <div className="text-xs font-medium">{role.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button 
                  onClick={handleInvite}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understand what each role can do in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{role.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{role.description}</p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-500">Permissions:</div>
                  <div className="space-y-1">
                    {role.id === 'admin' && (
                      <>
                        <div className="text-xs text-slate-600">• Full workspace access</div>
                        <div className="text-xs text-slate-600">• Invite/remove members</div>
                        <div className="text-xs text-slate-600">• Billing & subscription</div>
                        <div className="text-xs text-slate-600">• All editor permissions</div>
                      </>
                    )}
                    {role.id === 'editor' && (
                      <>
                        <div className="text-xs text-slate-600">• Create & edit links</div>
                        <div className="text-xs text-slate-600">• Customize design</div>
                        <div className="text-xs text-slate-600">• View analytics</div>
                        <div className="text-xs text-slate-600">• Manage profile settings</div>
                      </>
                    )}
                    {role.id === 'viewer' && (
                      <>
                        <div className="text-xs text-slate-600">• View profile & links</div>
                        <div className="text-xs text-slate-600">• Access analytics</div>
                        <div className="text-xs text-slate-600">• Export reports</div>
                        <div className="text-xs text-slate-600">• Comment on changes</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their access levels
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      {member.id === '1' && (
                        <Badge className="text-xs bg-blue-100 text-blue-700">You</Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">{member.email}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Last active</div>
                    <div className="text-xs text-slate-500">{member.lastActive}</div>
                  </div>
                  
                  {member.id !== '1' && (
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Team Activity</span>
          </CardTitle>
          <CardDescription>
            Recent actions by your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-xs">SC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">Sarah Chen updated the Instagram link</div>
                <div className="text-xs text-slate-500">2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-500 text-white text-xs">
                  {userData?.name?.split(' ').map(n => n[0]).join('') || 'DU'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">You changed the profile theme to "Neon"</div>
                <div className="text-xs text-slate-500">1 day ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-500 text-white text-xs">SC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">Sarah Chen added 3 new links</div>
                <div className="text-xs text-slate-500">2 days ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}