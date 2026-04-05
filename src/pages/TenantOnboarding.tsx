import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ArrowRight, ShieldCheck, Mail, User, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TenantOnboarding = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: ''
    });

    const handleGenerateSlug = (name: string) => {
        const generatedSlug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData({ ...formData, name, slug: generatedSlug });
    };

    const handleCreateTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Dans cette architecture SaaS, le Super Admin ou l'utilisateur public crée le locataire.
            // S'il est créé, l'utilisateur d'onboarding gagne accès à son espace
            await api.post('/tenants', {
                ...formData,
                plan: 'STARTER' // Plan par défaut
            });
            toast.success("Clinique créée avec succès !");
            setStep(3);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Erreur lors de la création.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl backdrop-blur-xl">
                    <Building2 className="w-8 h-8 text-rose-500" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Création de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Organisation</span></h1>
                <p className="text-white/50 max-w-md mx-auto text-lg leading-relaxed">Instanciez un espace dédié pour votre clinique en quelques instants.</p>
            </div>

            <Card className="w-full max-w-lg bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                
                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/5 absolute top-0 left-0">
                    <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <CardHeader className="pt-8 text-center border-b border-white/5">
                    {step === 1 && (
                        <>
                            <CardTitle className="text-xl font-medium text-white">Identité de l'établissement</CardTitle>
                            <CardDescription className="text-white/40">Définissez le nom public et l'URL d'accès de votre clinique.</CardDescription>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <CardTitle className="text-xl font-medium text-white">Compte Administrateur</CardTitle>
                            <CardDescription className="text-white/40">Qui sera le directeur ou gestionnaire de ce réseau ?</CardDescription>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <CardTitle className="text-xl font-medium text-emerald-400">Prêt à démarrer</CardTitle>
                            <CardDescription className="text-white/40">Le réseau de votre clinique est maintenant opérationnel.</CardDescription>
                        </>
                    )}
                </CardHeader>

                <CardContent className="pt-8 pb-10 px-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white/70">Nom officiel de la Clinique / Réseau</Label>
                                <div className="relative">
                                    <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <Input 
                                        id="name" 
                                        autoFocus
                                        className="pl-10 bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-rose-500 transition-colors"
                                        placeholder="Ex: Clinique des Lilas"
                                        value={formData.name}
                                        onChange={(e) => handleGenerateSlug(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-white/70">Domaine d'accès global (URL)</Label>
                                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
                                    <Input 
                                        id="slug" 
                                        className="bg-white/5 border-none text-white h-12 rounded-none flex-1 font-mono placeholder:text-white/20"
                                        placeholder="clinique-lilas"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                    <div className="bg-white/5 px-4 flex items-center text-white/40 font-mono border-l border-white/10 select-none">
                                        .doctic.com
                                    </div>
                                </div>
                                <p className="text-xs text-white/40 mt-2">Ce sera l'URL unique pour tous vos médecins et vos patients.</p>
                            </div>
                            <Button 
                                onClick={() => {
                                    if(formData.name.trim().length > 2 && formData.slug.trim().length > 2) {
                                        setStep(2);
                                    } else {
                                        toast.error("Veuillez remplir correctement les champs.");
                                    }
                                }} 
                                disabled={formData.name.trim().length <= 2}
                                className="w-full h-12 bg-white text-black hover:bg-neutral-200 mt-4 rounded-xl text-base font-medium"
                            >
                                Continuer <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleCreateTenant} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminFirstName" className="text-white/70">Prénom</Label>
                                    <div className="relative">
                                        <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                        <Input 
                                            id="adminFirstName"
                                            required
                                            autoFocus
                                            className="pl-10 bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-rose-500"
                                            placeholder="Jean"
                                            value={formData.adminFirstName}
                                            onChange={e => setFormData({ ...formData, adminFirstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminLastName" className="text-white/70">Nom</Label>
                                    <Input 
                                        id="adminLastName"
                                        required
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-rose-500"
                                        placeholder="Dupont"
                                        value={formData.adminLastName}
                                        onChange={e => setFormData({ ...formData, adminLastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="adminEmail" className="text-white/70">Email professionnel (Propriétaire)</Label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <Input 
                                        id="adminEmail"
                                        type="email"
                                        required
                                        className="pl-10 bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-rose-500"
                                        placeholder="direction@clinique-lilas.fr"
                                        value={formData.adminEmail}
                                        onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                                <div className="text-sm text-white/70">
                                    Cet utilisateur sera assigné en tant que <strong className="text-white">Tenant Admin</strong> et aura tous les droits sur ce nouveau réseau médical.
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="h-12 border border-white/10 text-white/70 hover:text-white rounded-xl">Retour</Button>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="flex-1 h-12 bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white shadow-lg shadow-rose-500/20 rounded-xl"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Générer l\'Infrastructure'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6 animate-in zoom-in duration-500 fill-mode-both">
                            <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-black ring-2 ring-emerald-500/30">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Infrastructure Initialisée</h3>
                                <p className="text-white/50 px-4">La base de données locataire, les clés de chiffrement et l'espace de stockage ont été alloués.</p>
                            </div>
                            
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left space-y-2 max-w-sm mx-auto">
                                <div className="text-sm text-white/40">URL du Portail :</div>
                                <div className="font-mono text-emerald-400 break-all bg-black/40 p-2 rounded">https://{formData.slug}.doctic.com</div>
                            </div>

                            <Button onClick={() => navigate('/dashboard')} className="w-full h-12 bg-white text-black hover:bg-neutral-200 mt-2 rounded-xl text-base font-medium transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Accéder au Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TenantOnboarding;
