import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Printer, Archive, MessageSquare, User, Mail, Phone, AlertCircle, Users, Loader2, X } from 'lucide-react'; // Added X icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
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
  const API_URL = 'http://localhost:5000/api/patients';

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
  const updateForm = (key: keyof Patient, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <OutlookLayout
        listPane={
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
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
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher (nom, ID, email)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Liste patients */}
            <div className="flex-1 overflow-y-auto">
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
                    className={`p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition ${selectedPatient?.id === patient.id ? 'bg-accent' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-medium">
                          {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{patient.name}</p>
                          <Badge variant={patient.status === 'Actif' ? 'default' : 'secondary'} className="text-xs">
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{patient.patientId || 'N/A'} • {patient.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Dernière visite : {patient.lastVisit}
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
            <div className="h-full flex flex-col bg-background">
              {/* Header détails */}
              <div className="border-b border-border px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <User className="h-6 w-6 text-primary" />
                    {selectedPatient.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {selectedPatient.patientId} • Dernière visite : {selectedPatient.lastVisit}
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Infos personnelles */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Âge</p>
                      <p className="font-medium">{selectedPatient.age} ans</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Genre</p>
                      <p className="font-medium">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selectedPatient.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                      <p className="font-medium flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selectedPatient.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Adresse</p>
                      <p className="font-medium">{selectedPatient.address}</p>
                    </div>
                  </div>
                </Card>

                {/* Historique médical */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-3">Historique médical</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{selectedPatient.medicalHistory}</p>
                </Card>

                {/* Allergies */}
                <Card className={`p-6 ${selectedPatient.allergies && selectedPatient.allergies !== 'Aucune connue' ? 'border-destructive/50 bg-destructive/10' : ''}`}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Allergies connues
                  </h3>
                  <p className={`text-sm ${selectedPatient.allergies && selectedPatient.allergies !== 'Aucune connue' ? 'text-destructive' : ''}`}>
                    {selectedPatient.allergies}
                  </p>
                </Card>

                {/* Médicaments actuels */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-3">Médicaments actuels</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{selectedPatient.currentMedications}</p>
                </Card>

                {/* Notes médecin */}
                <Card className="p-6 bg-amber-500/10 border-amber-500/50">
                  <h3 className="font-semibold mb-3">Notes du médecin</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 whitespace-pre-line">{selectedPatient.notes}</p>
                </Card>
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
