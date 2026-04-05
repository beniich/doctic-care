import { useState, useEffect } from "react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Wifi,
  UserPlus,
  Loader2,
  Save,
} from "lucide-react";
import { TeamManagement } from "@/components/settings/TeamManagement";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.patch<{ data: { id: string } }>('/users/me', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone
      });
      if (res.data) {
        toast.success("Profil mis à jour avec succès");
        refresh?.();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OutlookLayout
      singlePane={
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Paramètres</h1>
            <p className="text-white/40 mt-1">
              Gérez les préférences de votre clinique et la configuration système
            </p>
          </div>

          {/* User Profile - REAL DATA */}
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-primary" />
                Mon Profil
              </CardTitle>
              <CardDescription className="text-white/40">
                Vos informations personnelles et coordonnées professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/60">Prénom</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName} 
                    onChange={e => setProfile({...profile, firstName: e.target.value})}
                    className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/60">Nom</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName} 
                    onChange={e => setProfile({...profile, lastName: e.target.value})}
                    className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    disabled 
                    className="bg-white/[0.02] border-white/10 text-white/40 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-white/20">L'email ne peut pas être modifié par l'utilisateur.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/60">Téléphone</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-white px-6">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Management - Only for ADMIN or SUPER_ADMIN */}
          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Gestion d'Équipe</h2>
              </div>
              <TeamManagement />
            </section>
          )}

          <Separator className="bg-white/5" />

          {/* Clinic Information */}
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-primary" />
                Information de la Clinique
              </CardTitle>
              <CardDescription className="text-white/40">
                Coordonnées de l'établissement (géré par l'administrateur)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/60">Nom de la clinique</Label>
                  <Input disabled value={user?.tenant?.name || "Clinique Doctic"} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Sous-domaine</Label>
                  <Input disabled value={`${user?.tenant?.slug || "demo"}.doctic.com`} className="bg-white/5 border-white/10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications config */}
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5 text-primary" />
                Alertes & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Rappels de rendez-vous", sub: "Recevoir une alerte avant chaque patient", default: true },
                { label: "Nouveaux patients", sub: "Notification à chaque nouveau dossier créé", default: true },
                { label: "Alertes facturation", sub: "Alertes pour les impayés et factures en retard", default: false },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">{item.label}</Label>
                      <p className="text-sm text-white/30">{item.sub}</p>
                    </div>
                    <Switch defaultChecked={item.default} className="data-[state=checked]:bg-primary" />
                  </div>
                  {i < 2 && <Separator className="my-4 bg-white/5" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-primary" />
                Sécurité & Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Authentification à deux facteurs</Label>
                  <p className="text-sm text-white/30">Sécurisez votre compte avec une vérification supplémentaire</p>
                </div>
                <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">Activer</Button>
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Audit System</Label>
                  <p className="text-sm text-white/30">Traçage de toutes les actions conforme RGPD</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Activé</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="flex items-center justify-center gap-6 py-6 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              Système En Ligne
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3" /> Base de données synchronisée
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3" /> Connection SSL Sécurisée
            </div>
          </div>
        </div>
      }
    />
  );
}
