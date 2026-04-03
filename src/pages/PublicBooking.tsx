import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, CheckCircle2, ChevronRight, Stethoscope, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicBooking() {
    const { slug } = useParams<{ slug: string }>();
    const [step, setStep] = useState(1);
    const [tenant, setTenant] = useState<{name: string} | null>(null);
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        reason: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tenant info by slug
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/tenants/by-slug/${slug}`)
            .then(res => res.json())
            .then(data => setTenant(data.data))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3); // Success step
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary"><Stethoscope className="w-12 h-12 animate-pulse" /></div>;

    if (!tenant) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cette clinique n'existe pas.</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary/30">
            {/* Header / Hero */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-primary/20 to-neutral-950 border-b border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">{tenant.name}</h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-white/40 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Paris, France</span>
                        <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +33 1 00 00 00 00</span>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-2xl mx-auto -mt-12 px-4 pb-20">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <Card className="glass-card border-white/10 shadow-3xl bg-neutral-900/80 backdrop-blur-3xl overflow-hidden">
                                <CardHeader className="border-b border-white/5">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="flex items-center gap-2 italic">01. Choix du créneau</CardTitle>
                                        <CustomBadge className="text-[10px] text-primary border-primary/20 bg-primary/10">DISPONIBILITÉS LIVE</CustomBadge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Sélectionner une date</Label>
                                            <Input type="date" className="bg-white/5 border-white/10 h-12 text-lg" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Heure souhaitée</Label>
                                            <select 
                                                className="w-full h-12 bg-white/5 border border-white/10 rounded-md px-4 text-lg focus:ring-primary focus:border-primary" 
                                                aria-label="Sélectionner l'heure du rendez-vous"
                                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                            >
                                                <option value="">Choisir...</option>
                                                <option>09:00</option>
                                                <option>10:30</option>
                                                <option>14:15</option>
                                                <option>16:00</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button onClick={() => setStep(2)} className="w-full h-14 text-xl font-black bg-white text-black hover:bg-neutral-200 transition-all rounded-2xl group">
                                        CONTINUER <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="glass-card border-primary/20 bg-neutral-900/80">
                                <CardHeader className="border-b border-white/5">
                                    <Button variant="ghost" className="text-white/40 mb-4 p-0" onClick={() => setStep(1)}>← Retour au calendrier</Button>
                                    <CardTitle>02. Vos informations</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Nom complet</Label>
                                            <Input placeholder="Jean Dupont" className="bg-white/5 h-12 focus:border-primary transition-all" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="jean@email.com" className="bg-white/5" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Téléphone</Label>
                                                <Input placeholder="06 12 34 56 78" className="bg-white/5" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Motif de la consultation</Label>
                                            <Input placeholder="Maux de tête, suivi annuel..." className="bg-white/5" />
                                        </div>
                                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary leading-relaxed">
                                            En confirmant ce rendez-vous, vous recevrez un email de confirmation avec les instructions de connexion pour la téléconsultation.
                                        </div>
                                        <Button type="submit" className="w-full h-14 text-xl font-black bg-primary text-white hover:shadow-glow-primary transition-all rounded-2xl">
                                            CONFIRMER LE RENDEZ-VOUS
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="text-center space-y-8 pt-12">
                                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-black uppercase">C'est confirmé !</h2>
                                    <p className="text-white/40 max-w-sm mx-auto">Votre rendez-vous a été enregistré. Un email de confirmation vous a été envoyé.</p>
                                </div>
                                <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-white/40 hover:text-white">REPRENDRE UN RDV</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function CustomBadge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${className}`}>{children}</span>;
}
