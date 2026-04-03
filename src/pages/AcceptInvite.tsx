import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, CheckCircle2, ShieldCheck, HeartPulse } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/accept-invite', {
        token,
        firstName,
        lastName,
        password
      });
      setSuccess(true);
      toast({
        title: "Bienvenue sur Doctic !",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Erreur",
        description: apiError.response?.data?.error || "Le lien est invalide ou a expiré.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Inscription Réussie !</h1>
          <p className="text-white/60 mb-8">Redirection vers la page de connexion...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <HeartPulse className="absolute -top-20 -left-20 w-96 h-96 text-primary rotate-12" />
      </div>

      <Card className="w-full max-w-md glass-card z-10 border-primary/20">
        <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <ShieldCheck className="w-8 h-8 text-primary shadow-glow" />
            </div>
          <CardTitle className="text-2xl font-bold text-white">Rejoindre la Clinique</CardTitle>
          <CardDescription>
            Complétez votre profil pour activer votre accès.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                    id="firstName" 
                    placeholder="Jean" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                    className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                    id="lastName" 
                    placeholder="Dupont" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                    className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/5 border-white/10"
              />
            </div>

            <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold shadow-glow-primary"
                disabled={loading}
            >
              {loading ? "Création..." : "Activer mon compte"}
            </Button>
          </form>

          <p className="text-[10px] text-center text-white/40 mt-6 uppercase tracking-widest font-bold">
            Doctic Secure Medical Portal · RGPD Compliant
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
