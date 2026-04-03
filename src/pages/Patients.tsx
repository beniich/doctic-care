import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Printer, Archive, MessageSquare, User, Mail, Phone, AlertCircle, Users, Loader2, X, FileText, Pill } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
import DiagnosisPanel from '@/components/ai/DiagnosisPanel';
// import { useToast } from '@/components/ui/use-toast'; // Commented out to avoid errors if not configured, using console/alert fallback

// Type Patient
export interface Patient {
  id: number;
  name: string;
  patientId?: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  lastVisit: string;
  status: 'Actif' | 'Inactif';
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  notes?: string;
}

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  // const { toast } = useToast();
  const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/patients`;

  // Charger les patients au montage
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors du chargement des patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError('Impossible de charger les patients. Vérifiez que le backend est lancé.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPatient = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: 0,
      gender: 'Femme',
      address: '',
      lastVisit: new Date().toLocaleDateString('fr-FR'),
      status: 'Actif',
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
      notes: ''
    });
    setIsNewModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setIsNewModalOpen(true);
  };

  const handleSavePatient = async () => {
    try {
      const method = editingPatient ? 'PUT' : 'POST';
      const url = editingPatient ? `${API_URL}/${editingPatient.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      const savedPatient = await response.json();
      if (editingPatient) {
        setPatients(prev => prev.map(p => p.id === editingPatient.id ? savedPatient : p));
        // Update selected if needed
        if (selectedPatient?.id === editingPatient.id) {
          setSelectedPatient(savedPatient);
        }
      } else {
        setPatients(prev => [...prev, savedPatient]);
      }

      // toast?.({ title: 'Succès', description: 'Patient sauvegardé avec succès' });
      setIsNewModalOpen(false);
    } catch (err) {
      console.error(err);
      // toast?.({ title: 'Erreur', description: 'Échec de la sauvegarde', variant: 'destructive' });
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!window.confirm('Supprimer définitivement ce patient ?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur suppression');

      setPatients(prev => prev.filter(p => p.id !== id));
      if (selectedPatient?.id === id) setSelectedPatient(null);
      // toast?.({ title: 'Succès', description: 'Patient supprimé' });
    } catch (err) {
      console.error(err);
      // toast?.({ title: 'Erreur', description: 'Échec suppression', variant: 'destructive' });
      alert('Erreur lors de la suppression');
    }
  };

  const handleArchivePatient = async (id: number) => {
    alert('Fonctionnalité archivage à implémenter (API /api/archives)');
  };

  const handlePrintFiche = () => {
    alert('Fiche patient imprimée (simulation)');
  };

  const handleSendMessage = () => {
    alert('Message envoyé au patient');
  };

  // Helper to update form data
  const updateForm = (key: keyof Patient, value: Patient[keyof Patient]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <OutlookLayout
        title="BASE PATIENTS"
        listPane={
          <div className="flex flex-col h-full bg-transparent">
            {/* Header */}
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2 text-white/80">
                <Users className="h-5 w-5 text-primary" />
                Patients ({patients.length})
              </h2>
              <Button size="sm" onClick={handleNewPatient}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm px-6">
                {error}
              </div>
            )}

            {/* Recherche */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="text"
                  placeholder="Rechercher (nom, ID, email)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 rounded-xl"
                />
              </div>
            </div>

            {/* Liste patients */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Chargement...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  Aucun patient trouvé
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all ${selectedPatient?.id === patient.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-white font-mono-tech">
                          {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium truncate ${selectedPatient?.id === patient.id ? 'text-primary' : 'text-white'}`}>{patient.name}</p>
                          <Badge className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/70 hover:bg-white/20 border-white/10">
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/50 truncate font-mono-tech mt-1">{patient.patientId || 'N/A'} • <span className="font-sans">{patient.email}</span></p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                          Dernière visite : <span className="font-mono-tech">{patient.lastVisit}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        }
        detailPane={
          selectedPatient ? (
            <div className="h-full flex flex-col bg-transparent">
              {/* Header détails */}
              <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between bg-black/20">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    {selectedPatient.name}
                  </h2>
                  <p className="text-white/50 text-xs mt-2 font-mono-tech uppercase tracking-widest">
                    ID: {selectedPatient.patientId} <span className="mx-2">•</span> VISITE: {selectedPatient.lastVisit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditPatient(selectedPatient)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePrintFiche}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleArchivePatient(selectedPatient.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeletePatient(selectedPatient.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contenu détails */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
                {/* Infos personnelles */}
                <Card className="glass-card !bg-card border-white/10 p-6">
                  <h3 className="font-bold text-sm tracking-widest text-primary mb-5 uppercase flex items-center gap-2">
                    <User className="w-4 h-4" /> Informations personnelles
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Âge</p>
                      <p className="font-mono-tech text-lg text-white">{selectedPatient.age} ans</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Genre</p>
                      <p className="font-medium text-white">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-medium text-white flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        {selectedPatient.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Téléphone</p>
                      <p className="font-mono-tech text-white flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        {selectedPatient.phone}
                      </p>
                    </div>
                    <div className="col-span-2 mt-2">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Adresse</p>
                      <p className="font-medium text-white">{selectedPatient.address}</p>
                    </div>
                  </div>
                </Card>

                {/* Historique médical */}
                <Card className="glass-card !bg-card border-white/10 p-6">
                  <h3 className="font-bold text-sm tracking-widest text-primary mb-3 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Historique médical
                  </h3>
                  <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{selectedPatient.medicalHistory}</p>
                </Card>

                {/* Allergies */}
                <Card className={`glass-card p-6 ${selectedPatient.allergies && selectedPatient.allergies !== 'Aucune connue' ? 'border-destructive/30 !bg-destructive/10' : '!bg-card border-white/10'}`}>
                  <h3 className="font-bold text-sm tracking-widest uppercase mb-3 flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Allergies connues
                  </h3>
                  <p className={`text-sm ${selectedPatient.allergies && selectedPatient.allergies !== 'Aucune connue' ? 'text-destructive' : 'text-white/80'}`}>
                    {selectedPatient.allergies}
                  </p>
                </Card>

                {/* Médicaments actuels */}
                <Card className="glass-card !bg-card border-white/10 p-6">
                  <h3 className="font-bold text-sm tracking-widest text-primary mb-3 uppercase flex items-center gap-2">
                    <Pill className="w-4 h-4" /> Médicaments actuels
                  </h3>
                  <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{selectedPatient.currentMedications}</p>
                </Card>

                {/* Notes médecin */}
                <Card className="glass-card !bg-card border-accent/30 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/5" />
                  <h3 className="font-bold text-sm tracking-widest text-accent mb-3 uppercase flex items-center gap-2 relative z-10">
                    <Edit className="w-4 h-4" /> Notes du médecin
                  </h3>
                  <p className="text-sm text-white/90 whitespace-pre-line relative z-10 italic">"{selectedPatient.notes}"</p>
                </Card>

                {/* Agent IA - Aide au Diagnostic */}
                <DiagnosisPanel 
                  patientId={selectedPatient.patientId || selectedPatient.id.toString()}
                  patientAge={selectedPatient.age}
                  patientSex={selectedPatient.gender === 'Homme' ? 'M' : 'F'}
                  existingConditions={selectedPatient.medicalHistory.split(',')}
                  currentMedications={selectedPatient.currentMedications.split(',')}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-background">
              <div className="text-center text-muted-foreground">
                <User className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Sélectionnez un patient pour voir les détails</p>
              </div>
            </div>
          )
        }
      />

      {/* Modal création/édition */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-3xl bg-background border-border p-0 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingPatient ? 'Modifier le patient' : 'Nouveau patient'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsNewModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
                <Input
                  placeholder="Âge"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateForm('age', parseInt(e.target.value))}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                />
                <Input
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                />
                <Input
                  placeholder="Adresse complète"
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className="col-span-2"
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={(e) => updateForm('gender', e.target.value)}
                >
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                  <option value="Autre">Autre</option>
                </select>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => updateForm('status', e.target.value)}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div className="mt-6 space-y-4">
                <textarea
                  placeholder="Historique médical"
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-nbone"
                  value={formData.medicalHistory}
                  onChange={(e) => updateForm('medicalHistory', e.target.value)}
                />
                <textarea
                  placeholder="Allergies"
                  rows={2}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={formData.allergies}
                  onChange={(e) => updateForm('allergies', e.target.value)}
                />
                <textarea
                  placeholder="Médicaments actuels"
                  rows={3}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={formData.currentMedications}
                  onChange={(e) => updateForm('currentMedications', e.target.value)}
                />
                <textarea
                  placeholder="Notes du médecin"
                  rows={3}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={formData.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-4 bg-muted/20">
              <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Annuler</Button>
              <Button onClick={handleSavePatient}>
                {editingPatient ? 'Enregistrer les modifications' : 'Créer le patient'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
