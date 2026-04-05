import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User, Bell, ChevronRight, Video, Download, LogOut, ArrowRight, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PatientData {
    firstName: string;
    doctor?: { firstName: string };
    tenant?: { name: string; slug: string; logo?: string };
}

interface Prescription {
    id: string;
    prescriptionDate: string;
    doctor?: { firstName?: string };
}

interface Appointment {
    id: string;
    start: string;
    status: string;
}

export default function PatientPortal() {
    const [patient, setPatient] = useState<PatientData | null>(null);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            navigate('/patient/login');
            return;
        }
        fetchData(token);
    }, []);

    const fetchData = async (token: string) => {
        setLoading(true);
        try {
            const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/patient/portal`;
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [pRes, prRes, aRes] = await Promise.all([
                fetch(`${API_BASE}/me`, { headers }).then(r => r.json()),
                fetch(`${API_BASE}/prescriptions`, { headers }).then(r => r.json()),
                fetch(`${API_BASE}/appointments`, { headers }).then(r => r.json())
            ]);
            
            setPatient(pRes.data);
            setPrescriptions(prRes.data || []);
            setAppointments(aRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('patient_token');
        localStorage.removeItem('patient_data');
        navigate('/patient/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div animate={{ scale: [0.9, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <HeartPulse className="w-16 h-16 text-primary" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <User className="w-8 h-8 text-primary shadow-glow" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Bonjour, <span className="text-primary">{patient?.firstName}</span></h1>
                            <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mt-1">
                                {patient?.tenant?.name || 'VOTRE CLINIQUE'} · ESPACE PATIENT SÉCURISÉ
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" className="text-white/40 hover:text-rose-400 hover:bg-rose-400/10 gap-2 border border-white/5" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" /> Se déconnecter
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne Gauche - Prochains RDV */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" /> Vos Rendez-vous
                                </h2>
                                <Button variant="link" className="text-primary text-xs p-0">Prendre RDV <ArrowRight className="ml-1 w-3 h-3" /></Button>
                            </div>
                            
                            {appointments.length === 0 ? (
                                <Card className="glass-card border-dashed border-white/10 bg-white/5">
                                    <CardContent className="p-8 text-center text-white/40 italic">
                                        Aucun rendez-vous à venir.
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {appointments.map((app) => (
                                        <motion.div key={app.id} whileHover={{ y: -4 }}>
                                            <Card className="glass-card bg-gradient-to-br from-white/10 to-transparent border-white/20">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase">{app.status}</Badge>
                                                        <Video className="w-5 h-5 text-primary opacity-50" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-bold">{new Date(app.start).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                        <div className="flex items-center gap-4 text-white/60 text-sm">
                                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(app.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Dr. {patient?.doctor?.firstName || 'Principal'}</span>
                                                        </div>
                                                    </div>
                                                    <Button className="w-full mt-6 bg-white text-black hover:bg-neutral-200 font-bold border-none h-10">
                                                        Rejoindre la salle d'attente
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Ordonnances */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" /> Vos Documents Médicaux
                            </h2>
                            <div className="space-y-3">
                                {prescriptions.map((pr) => (
                                    <div key={pr.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center p-2">
                                                <FileText className="w-full h-full text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary transition-colors">Ordonnance N°{pr.id.slice(0, 8)}</p>
                                                <p className="text-xs text-white/40">Émise le {new Date(pr.prescriptionDate).toLocaleDateString()} par Dr. {pr.doctor?.firstName}</p>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg">
                                            <Download className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                                {prescriptions.length === 0 && <p className="text-white/30 text-center py-8 italic border border-dashed border-white/5 rounded-xl">Aucun document disponible.</p>}
                            </div>
                        </section>
                    </div>

                    {/* Colonne Droite - Infos Clinique & Notifications */}
                    <div className="space-y-8">
                        {/* News / Infos */}
                        <Card className="glass-card bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Message de votre clinique
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-white/60 text-sm leading-relaxed">
                                    "Nous vous rappelons que le masque reste obligatoire dans l'enceinte de la clinique. Merci de votre compréhension."
                                </p>
                                <div className="pt-4 border-t border-white/5 mt-4">
                                    <p className="text-xs font-bold text-white">{patient?.tenant?.name}</p>
                                    <p className="text-[10px] text-white/40">Contact : +33 1 23 45 67 89</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health Summary Placeholder */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-transparent flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4 border border-rose-500/30">
                                <HeartPulse className="w-6 h-6 text-rose-500" />
                            </div>
                            <h3 className="text-sm font-bold mb-1">Résumé de Santé</h3>
                            <p className="text-xs text-white/40 mb-4 max-w-xs">Vos données vitaux et antécédents sont centralisés ici selon les normes HDS.</p>
                            <Button size="sm" variant="outline" className="w-full border-white/10 text-white/60 hover:text-white">Consulter mon dossier complet</Button>
                        </div>
                    </div>
                </div>

                <footer className="pt-20 pb-8 text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/10">
                        Doctic Medical Portal — Powered by Antigravity Engine
                    </p>
                </footer>
            </div>
        </div>
    );
}
