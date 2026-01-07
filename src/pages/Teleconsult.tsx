import React, { useState, useEffect } from 'react';
import { Search, Plus, Video, Phone, Clock, User, Calendar, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

interface TeleconsultSession {
    id: number;
    patient: string;
    date: string;
    time: string;
    duration: string;
    status: 'prévue' | 'en_cours' | 'terminée' | 'annulée';
    roomUrl?: string; // Lien vidéo
    notes?: string;
}

export default function Teleconsult() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sessions, setSessions] = useState<TeleconsultSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<TeleconsultSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<TeleconsultSession>>({});

    const API_URL = 'http://localhost:5000/api/teleconsult';

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erreur chargement');
            const data = await response.json();
            setSessions(data);
        } catch (err) {
            setError('Impossible de charger les téléconsultations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(session =>
        session.patient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'en_cours': return 'success';
            case 'prévue': return 'default'; // Blueish in default theme usually or primary
            case 'terminée': return 'secondary';
            case 'annulée': return 'destructive';
            default: return 'outline';
        }
    };

    const handleNewSession = () => {
        setFormData({
            patient: '',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            duration: '30m',
            status: 'prévue',
            notes: ''
        });
        setIsNewModalOpen(true);
    };

    const handleSaveSession = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, roomUrl: `https://meet.jit.si/Doctic-${Date.now()}` })
            });

            if (!response.ok) throw new Error('Erreur création');

            await fetchSessions();
            setIsNewModalOpen(false);
            // alert('Téléconsultation planifiée !');
        } catch (err) {
            alert('Échec création');
        }
    };

    const handleStartTeleconsult = (session: TeleconsultSession) => {
        const url = session.roomUrl || `https://meet.jit.si/Doctic-${session.patient.replace(/\s+/g, '-')}-${session.id}`;
        window.open(url, '_blank', 'width=1200,height=800');
        // alert('Téléconsultation démarrée dans une nouvelle fenêtre (Jitsi Meet)');
    };

    const handleEndSession = async (id: number) => {
        if (confirm("Terminer la session ?")) {
            // Idéalement on met à jour le statut via API
            setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'terminée' } : s));
            if (selectedSession?.id === id) setSelectedSession(prev => prev ? { ...prev, status: 'terminée' } : null);
        }
    };

    return (
        <OutlookLayout
            listPane={
                <div className="flex flex-col h-full bg-background">
                    {/* Header List */}
                    <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Video className="h-5 w-5 text-green-500" />
                            Téléconsultations
                        </h2>
                        <Button size="sm" onClick={handleNewSession} className="bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Planifier
                        </Button>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm px-6">
                            {error}
                        </div>
                    )}

                    {/* Recherche */}
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Liste */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p>Chargement...</p>
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                Aucune téléconsultation prévue
                            </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(session)}
                                    className={`p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition ${selectedSession?.id === session.id ? 'bg-accent' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium truncate">{session.patient}</span>
                                        <Badge variant={getStatusBadgeVariant(session.status) as "default" | "secondary" | "destructive" | "outline" | null | undefined} className="text-[10px] h-5 px-1.5">{session.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {session.date} {session.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {session.duration}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            }
            detailPane={
                selectedSession ? (
                    <div className="h-full flex flex-col bg-background">
                        {/* Header Detail */}
                        <div className="border-b border-border px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold flex items-center gap-2">
                                    {selectedSession.patient}
                                </h2>
                                <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                                    <Video className="h-4 w-4" />
                                    Session {selectedSession.status}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleStartTeleconsult(selectedSession)}
                                    disabled={selectedSession.status === 'terminée' || selectedSession.status === 'annulée'}
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    {selectedSession.status === 'en_cours' ? 'Rejoindre' : 'Démarrer'}
                                </Button>
                                {selectedSession.status === 'en_cours' && (
                                    <Button variant="destructive" onClick={() => handleEndSession(selectedSession.id)}>
                                        Terminer
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Vidéo placeholder */}
                            <div className="aspect-video bg-black/90 rounded-xl flex flex-col items-center justify-center border border-border shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <Video className="h-16 w-16 text-muted-foreground mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-muted-foreground z-10 font-medium">Salle d'attente virtuelle</p>
                                <p className="text-xs text-muted-foreground/60 mt-2 z-10 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Jitsi Meet Secure Encrypted
                                </p>
                                <Button
                                    variant="secondary"
                                    className="mt-6 z-10 bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm"
                                    onClick={() => handleStartTeleconsult(selectedSession)}
                                >
                                    Ouvrir la salle maintenant
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 bg-muted/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Horaire</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {selectedSession.date} à {selectedSession.time}
                                    </p>
                                </Card>
                                <Card className="p-4 bg-muted/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Durée estimée</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {selectedSession.duration}
                                    </p>
                                </Card>
                            </div>

                            {selectedSession.notes && (
                                <Card className="p-4 bg-muted/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Notes & Motif</p>
                                    <p className="text-sm leading-relaxed">{selectedSession.notes}</p>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-background">
                        <div className="text-center text-muted-foreground">
                            <Video className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p>Sélectionnez une session pour voir les détails</p>
                        </div>
                    </div>
                )
            }
        >
            {/* Modal est rendu via Portal ou au niveau root normalement, mais ici on peut le laisser dans le render tree si position:fixed */}
            {isNewModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg bg-background border-border p-0 shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Video className="h-5 w-5 text-green-500" />
                                Nouvelle téléconsultation
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsNewModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Patient</label>
                                <Input
                                    placeholder="Nom du patient"
                                    value={formData.patient}
                                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Date</label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Heure</label>
                                    <Input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Durée</label>
                                <Input
                                    placeholder="ex: 30m"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Notes</label>
                                <Textarea
                                    rows={3}
                                    placeholder="Motif de la consultation..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                            <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Annuler</Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveSession}>
                                Planifier
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </OutlookLayout>
    );
}
