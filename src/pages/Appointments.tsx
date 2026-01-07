import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { EventClickArg } from '@fullcalendar/core';
import { Search, Plus, Edit, Trash2, Video, Calendar as CalendarIcon, Clock, MapPin, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

interface Appointment {
  id: number;
  time: string; // "HH:mm"
  duration: string;
  patient: string;
  type: string;
  status: 'confirmé' | 'en_attente' | 'urgent' | 'annulé';
  location?: string;
  date: string; // "YYYY-MM-DD"
  notes?: string;
}

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const calendarRef = useRef<FullCalendar>(null);

  const API_URL = 'http://localhost:5000/api/appointments';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError('Impossible de charger les RDV. Backend actif ?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format pour FullCalendar
  const calendarEvents = appointments.map(apt => {
    const start = `${apt.date}T${apt.time}:00`;
    return {
      id: apt.id.toString(),
      title: `${apt.patient} - ${apt.type}`,
      start: start,
      backgroundColor: apt.status === 'confirmé' ? '#10b981' : apt.status === 'urgent' ? '#ef4444' : '#8b5cf6',
      borderColor: 'transparent',
      extendedProps: { ...apt }
    };
  });

  const filteredAppointments = appointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmé': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'en_attente': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'urgent': return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'annulé': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('télé')) return <Video className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  const handleEventClick = (info: EventClickArg) => {
    const apt = appointments.find(a => a.id === parseInt(info.event.id));
    if (apt) {
      setSelectedAppointment(apt);
      setViewMode('list'); // Switch to list view to show details
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    // Info contains dateStr
    handleNewAppointment(info.dateStr);
  };

  const handleNewAppointment = (datePreselect?: string) => {
    setEditingAppointment(null);
    setFormData({
      patient: '',
      type: 'Consultation',
      time: '09:00',
      duration: '30m',
      status: 'en_attente',
      location: 'Cabinet Principal',
      date: datePreselect || new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsNewModalOpen(true);
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormData(apt);
    setIsNewModalOpen(true);
  };

  const handleSaveAppointment = async () => {
    try {
      const method = editingAppointment ? 'PUT' : 'POST';
      const url = editingAppointment ? `${API_URL}/${editingAppointment.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur sauvegarde');

      await fetchAppointments();
      setIsNewModalOpen(false);
    } catch (err) {
      alert('Échec sauvegarde');
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur suppression');

      await fetchAppointments();
      if (selectedAppointment?.id === id) setSelectedAppointment(null);
    } catch (err) {
      alert('Échec suppression');
    }
  };

  const handleStartVisit = (apt: Appointment) => {
    alert(`Démarrage ${apt.type.includes('télé') ? 'téléconsultation' : 'consultation'} avec ${apt.patient}`);
  };

  const updateForm = (key: keyof Appointment, value: Appointment[keyof Appointment]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <OutlookLayout
      singlePane={
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Rendez-vous
                <Badge variant="secondary" className="ml-2">{appointments.length}</Badge>
              </h1>

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
                <TabsList>
                  <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                  <TabsTrigger value="list">Liste</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-3 items-center">
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              <Button onClick={() => handleNewAppointment()}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </div>

          {error && (
            <div className="m-4 p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
              {error}
            </div>
          )}

          <div className="flex-1 p-6">
            <Tabs value={viewMode} className="h-full">
              {/* VUE LISTE */}
              <TabsContent value="list" className="h-full mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Liste gauche */}
                  <div className="flex flex-col h-[calc(100vh-140px)] border border-border rounded-xl bg-card overflow-hidden">
                    {/* Recherche */}
                    <div className="p-4 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Rechercher (patient, type)..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                      ) : filteredAppointments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Aucun RDV trouvé.</p>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedAppointment?.id === apt.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-transparent hover:bg-accent hover:border-border'
                              }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-lg">{apt.time}</span>
                              <Badge className={getStatusBadge(apt.status)} variant="outline">{apt.status}</Badge>
                            </div>
                            <div className="font-medium text-foreground">{apt.patient}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <span>{apt.type}</span>
                              <span>•</span>
                              <span>{apt.duration}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Détails droite */}
                  <div className="h-[calc(100vh-140px)] border border-border rounded-xl bg-card overflow-hidden flex flex-col">
                    {selectedAppointment ? (
                      <>
                        <div className="p-6 border-b border-border flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold mb-1">{selectedAppointment.patient}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(selectedAppointment.date).toLocaleDateString()} à {selectedAppointment.time}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditAppointment(selectedAppointment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteAppointment(selectedAppointment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-muted/30">
                              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Durée</p>
                              <p className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {selectedAppointment.duration}
                              </p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Type</p>
                              <p className="font-medium flex items-center gap-2">
                                {getTypeIcon(selectedAppointment.type)} {selectedAppointment.type}
                              </p>
                            </Card>
                            <Card className="p-4 bg-muted/30 col-span-2">
                              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Lieu</p>
                              <p className="font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> {selectedAppointment.location || 'Non spécifié'}
                              </p>
                            </Card>
                          </div>

                          {selectedAppointment.notes && (
                            <Card className="p-4 bg-amber-500/10 border-amber-500/20">
                              <p className="text-xs text-amber-600 dark:text-amber-400 uppercase font-bold mb-2">Notes</p>
                              <p className="text-sm text-foreground/80">{selectedAppointment.notes}</p>
                            </Card>
                          )}

                          <div className="pt-4">
                            <Button className="w-full" size="lg" onClick={() => handleStartVisit(selectedAppointment)}>
                              <Video className="h-5 w-5 mr-2" />
                              Démarrer la consultation
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <CalendarIcon className="h-8 w-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Aucun rendez-vous sélectionné</h3>
                        <p className="max-w-xs mx-auto">Sélectionnez un rendez-vous dans la liste ou le calendrier pour voir les détails et actions.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* VUE CALENDRIER */}
              <TabsContent value="calendar" className="h-[calc(100vh-140px)] mt-0">
                <Card className="h-full p-6 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-auto calendar-container">
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                      }}
                      events={calendarEvents}
                      eventClick={handleEventClick}
                      dateClick={handleDateClick}
                      height="100%"
                      locale={frLocale}
                      buttonText={{
                        today: "Aujourd'hui",
                        month: 'Mois',
                        week: 'Semaine',
                        day: 'Jour'
                      }}
                      dayMaxEvents={3}
                      moreLinkText="plus"
                      slotMinTime="08:00:00"
                      slotMaxTime="20:00:00"
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Modal création/édition */}
          {isNewModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg bg-background border-border p-0 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {editingAppointment ? 'Modifier le RDV' : 'Nouveau rendez-vous'}
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
                      onChange={(e) => updateForm('patient', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={formData.date ? formData.date.split('T')[0] : ''}
                        onChange={(e) => updateForm('date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Heure</label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => updateForm('time', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Durée</label>
                      <Input
                        placeholder="ex: 30m"
                        value={formData.duration}
                        onChange={(e) => updateForm('duration', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.type}
                        onChange={(e) => updateForm('type', e.target.value)}
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Suivi">Suivi</option>
                        <option value="Téléconsultation">Téléconsultation</option>
                        <option value="Urgence">Urgence</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Statut</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.status}
                      onChange={(e) => updateForm('status', e.target.value)}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmé">Confirmé</option>
                      <option value="urgent">Urgent</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <textarea
                      placeholder="Notes (optionnel)"
                      rows={3}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      value={formData.notes}
                      onChange={(e) => updateForm('notes', e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                  <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Annuler</Button>
                  <Button onClick={handleSaveAppointment}>
                    {editingAppointment ? 'Enregistrer' : 'Créer'}
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </div>
      }
    />
  );
}
