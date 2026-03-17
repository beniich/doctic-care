import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { Users, Calendar, DollarSign, Activity, TrendingUp, Clock, FileText, Video, Stethoscope, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
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
    { title: t('dashboard.kpi.active_patients'), value: '1 245', change: '+12%', icon: Users, glowColor: 'cyan' as const },
    { title: t('dashboard.kpi.appointments_today'), value: '24', change: '+5', icon: Calendar, glowColor: 'purple' as const },
    { title: t('dashboard.kpi.monthly_revenue'), value: '€25 767', change: '+18%', icon: DollarSign, glowColor: 'green' as const },
    { title: t('dashboard.kpi.satisfaction'), value: '98%', change: '+2%', icon: Activity, glowColor: 'orange' as const }
  ];

  const recentActivities = [
    { icon: FileText, text: `${t('dashboard.recent_activity.consultation_finished')} - Sarah Johnson`, time: '5 min', color: 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,200,255,0.4)]' },
    { icon: FileText, text: `${t('dashboard.recent_activity.new_prescription')} - Michael Chen`, time: '15 min', color: 'bg-accent/20 text-accent shadow-[0_0_10px_rgba(155,127,255,0.4)]' },
    { icon: Video, text: t('dashboard.recent_activity.teleconsult_planned'), time: '2h', color: 'bg-warning/20 text-warning shadow-[0_0_10px_rgba(255,107,0,0.4)]' },
    { icon: Video, text: t('dashboard.recent_activity.video_published'), time: '1h', color: 'bg-success/20 text-success shadow-[0_0_10px_rgba(0,230,118,0.4)]' }
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
        <div className="min-h-full">
          {/* Dashboard Content */}
          <motion.div
            className="p-6 space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <motion.div key={kpi.title} variants={item}>
                  <KPICard 
                    title={kpi.title}
                    value={kpi.value}
                    trend={{ direction: kpi.change.startsWith('+') ? 'up' : 'down', value: parseFloat(kpi.change.replace(/[^0-9.]/g, '')) }}
                    glowColor={kpi.glowColor}
                  />
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
                        {t('dashboard.activity.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 hero-gradient opacity-5" />
                      <div className="text-center z-10">
                        <TrendingUp className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4 animate-float" />
                        <p className="text-lg font-medium text-foreground">{t('dashboard.activity.trends')}</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                          {t('dashboard.activity.description')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Prochains RDV */}
                <motion.div variants={item}>
                  <Card className="glass-card !bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm text-white/50 uppercase tracking-widest font-bold">
                        <Clock className="h-4 w-4" />
                        {t('dashboard.appointments.title')}
                      </CardTitle>
                      <button className="text-xs text-primary font-medium hover:text-white transition-colors flex items-center gap-1">
                        {t('dashboard.appointments.view_all')} <ArrowRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mt-4">
                        {upcomingAppointments.map((apt, index) => (
                          <div key={index} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-background border border-border group-hover:border-primary/30 transition-colors">
                                <span className="text-sm font-mono-tech text-white">{apt.time}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white group-hover:text-primary transition-colors">{apt.patient}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${apt.type === 'Consultation' ? 'bg-primary text-primary' : 'bg-accent text-accent'}`} />
                                  <p className="text-[11px] text-white/40 uppercase tracking-wider">{apt.type}</p>
                                </div>
                              </div>
                            </div>
                            <div className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-widest uppercase border ${apt.status === 'confirmed'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-warning/10 text-warning border-warning/20'
                              }`}>
                              {apt.status === 'confirmed' ? t('dashboard.appointments.status_confirmed') : t('dashboard.appointments.status_pending')}
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
                  <Card className="glass-card !bg-card border-border/50 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm text-white/50 uppercase tracking-widest font-bold">
                        <Stethoscope className="h-4 w-4" />
                        {t('dashboard.recent_activity.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative pl-4 border-l border-white/10 space-y-8 py-2 mt-4 cursor-default">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="relative group">
                            <div className={`absolute -left-[21px] p-[5px] rounded border border-white/10 bg-background ${activity.color} transition-all duration-300 group-hover:scale-110`}>
                              <activity.icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="pl-3">
                              <p className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors leading-tight">{activity.text}</p>
                              <p className="text-[11px] text-white/40 mt-1 font-mono-tech">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions / Tips */}
                <motion.div variants={item}>
                  <Card className="glass-card border-border/50 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.05)_25%,transparent_25%,transparent_50%,rgba(0,200,255,0.05)_50%,rgba(0,200,255,0.05)_75%,transparent_75%,transparent)] bg-[length:10px_10px] opacity-20" />
                    <CardContent className="p-6 relative z-10">
                      <h3 className="font-bold text-sm tracking-widest text-primary mb-2 uppercase">{t('dashboard.tips.title')}</h3>
                      <p className="text-xs text-white/50 mb-4 leading-relaxed">
                        {t('dashboard.tips.content')}
                      </p>
                      <button className="w-full py-2.5 rounded border border-primary/40 bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all">
                        {t('dashboard.tips.open_assistant')}
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>

            </div>
            
            <motion.div variants={item}>
              <AnalyticsDashboard />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
}
