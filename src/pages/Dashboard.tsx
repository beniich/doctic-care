import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { Users, Calendar, DollarSign, Activity, TrendingUp, Clock, FileText, Video, Stethoscope, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from "framer-motion";

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const kpis = [
    { title: 'Patients actifs', value: '1 245', change: '+12%', icon: Users, color: 'from-blue-600 to-cyan-500' },
    { title: 'RDV aujourd\'hui', value: '24', change: '+5', icon: Calendar, color: 'from-violet-600 to-purple-500' },
    { title: 'Revenus mensuels', value: '€25 767', change: '+18%', icon: DollarSign, color: 'from-emerald-500 to-green-600' },
    { title: 'Satisfaction', value: '98%', change: '+2%', icon: Activity, color: 'from-amber-500 to-orange-600' }
  ];

  const recentActivities = [
    { icon: FileText, text: 'Consultation terminée - Sarah Johnson', time: 'Il y a 5 min', color: 'bg-green-500 text-white' },
    { icon: FileText, text: 'Nouvelle ordonnance - Michael Chen', time: 'Il y a 15 min', color: 'bg-blue-500 text-white' },
    { icon: Video, text: 'Téléconsultation prévue à 14h', time: 'Dans 2h', color: 'bg-violet-500 text-white' },
    { icon: Video, text: 'Vidéo publiée sur TikTok', time: 'Il y a 1h', color: 'bg-pink-500 text-white' }
  ];

  const upcomingAppointments = [
    { patient: 'Sarah Johnson', time: '09:00', type: 'Consultation', status: 'confirmed' },
    { patient: 'Emma Williams', time: '11:45', type: 'Téléconsultation', status: 'confirmed' },
    { patient: 'James Brown', time: '14:00', type: 'Suivi', status: 'pending' },
    { patient: 'Olivia Davis', time: '15:30', type: 'Consultation', status: 'confirmed' }
  ];

  return (
    <OutlookLayout
      singlePane={
        <div className="min-h-full bg-background/50">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-b-3xl">
            <div className="absolute inset-0 hero-gradient opacity-10" />

            <div className="relative px-8 pt-10 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-2">
                  <span className="gradient-text">Bienvenue,</span>{" "}
                  <span className="text-foreground">Dr. Anderson</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Voici un aperçu de votre cabinet aujourd'hui
                </p>
              </motion.div>
            </div>
          </div>

          {/* Dashboard Content */}
          <motion.div
            className="p-8 space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <motion.div key={kpi.title} variants={item}>
                  <Card className="glass-card card-hover border-border overflow-hidden relative group">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                      <kpi.icon className="w-24 h-24" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                      <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <kpi.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium mb-1">{kpi.title}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold">{kpi.value}</p>
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">
                          <TrendingUp className="h-3 w-3" />
                          {kpi.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column (2/3) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Graphique placeholder */}
                <motion.div variants={item}>
                  <Card className="glass-card border-border h-[400px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Aperçu de l'activité
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 hero-gradient opacity-5" />
                      <div className="text-center z-10">
                        <TrendingUp className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4 animate-float" />
                        <p className="text-lg font-medium text-foreground">Analyse des tendances</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                          Vos données de consultation et de revenus seront affichées ici avec des graphiques interactifs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Prochains RDV */}
                <motion.div variants={item}>
                  <Card className="glass-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Rendez-vous à venir
                      </CardTitle>
                      <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                        Voir tout <ArrowRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingAppointments.map((apt, index) => (
                          <div key={index} className="group flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/50 hover:bg-card/80 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-background shadow-sm border border-border group-hover:border-primary/30 transition-colors">
                                <span className="text-sm font-bold text-foreground">{apt.time}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">AM</span>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{apt.patient}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${apt.type === 'Consultation' ? 'bg-blue-500' : 'bg-violet-500'}`} />
                                  <p className="text-xs text-muted-foreground">{apt.type}</p>
                                </div>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${apt.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              }`}>
                              {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column (1/3) */}
              <div className="space-y-8">
                {/* Activité récente */}
                <motion.div variants={item}>
                  <Card className="glass-card border-border h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-accent" />
                        Activité récente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative pl-4 border-l border-border/50 space-y-8 py-2">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="relative group">
                            <div className={`absolute -left-[21px] p-1.5 rounded-full ${activity.color} shadow-sm group-hover:scale-110 transition-transform`}>
                              <activity.icon className="h-3 w-3" />
                            </div>
                            <div className="pl-2">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{activity.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions / Tips */}
                <motion.div variants={item}>
                  <Card className="glass-card border-border bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 gradient-text">Astuce du jour</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Utilisez l'assistant IA pour analyser rapidement les derniers résultats d'analyse de vos patients.
                      </p>
                      <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                        Ouvrir l'Assistant IA
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>

            </div>
          </motion.div>
        </div>
      }
    />
  );
}
