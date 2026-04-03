import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, Plus, UserPlus, Shield, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { UpgradeGate } from '@/components/common/UpgradeGate';

interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  lastLogin: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
}

export const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DOCTOR');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        api.get<TeamMember[]>('/users'),
        api.get<Invitation[]>('/users/invitations')
      ]);
      setMembers(membersRes.data);
      setInvitations(invitesRes.data);
    } catch (error) {
      console.error('Fetch team error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/invite', { email: inviteEmail, role: inviteRole });
      toast({
        title: "Invitation envoyée",
        description: `Un email a été envoyé à ${inviteEmail}`,
      });
      setInviteEmail('');
      fetchData();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erreur",
        description: apiError.response?.data?.message || "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      fetchData();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Member Section */}
      <Card className="glass-card border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Inviter un nouveau membre
          </CardTitle>
          <CardDescription>
            Ajoutez des médecins ou des assistants à votre clinique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nom@clinique.com" 
                  className="pl-9 bg-background/50"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <select 
                id="role"
                className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="DOCTOR">Médecin</option>
                <option value="ADMIN">Administrateur</option>
                <option value="ASSISTANT">Assistant/Secrétaire</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto gap-2">
                <Plus className="h-4 w-4" />
                Inviter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Équipe de la clinique
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead>Membre</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Chargement...</TableCell></TableRow>
              ) : members.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun membre trouvé.</TableCell></TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="font-medium text-white">
                        {member.firstName} {member.lastName || ''}
                      </div>
                      <div className="text-xs text-white/40">{member.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] uppercase font-bold">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.active ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs text-white/40">
                          Suspendu
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={member.active ? "text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"}
                        onClick={() => toggleActive(member.id)}
                      >
                        {member.active ? "Désactiver" : "Réactiver"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}

              {/* Invitations en attente */}
              {invitations.map((invite) => (
                <TableRow key={invite.id} className="border-white/5 bg-primary/5 opacity-80">
                  <TableCell>
                    <div className="font-medium text-white/60 italic">{invite.email}</div>
                    <div className="text-[10px] text-primary flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> Invitation en attente
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px] uppercase">
                      {invite.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-white/30 italic">Expire le {new Date(invite.expiresAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-white/20 hover:text-white">
                      Relancer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Quota Info */}
      <UpgradeGate feature="Gestion d'équipe illimitée" allowedPlans={['PRO', 'BUSINESS', 'ENTERPRISE']}>
         <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" />
            Votre plan PRO vous permet d'ajouter jusqu'à 15 membres. Vous en avez actuellement {members.length + invitations.length}.
         </div>
      </UpgradeGate>
    </div>
  );
};
