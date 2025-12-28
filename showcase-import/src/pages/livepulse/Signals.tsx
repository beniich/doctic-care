import { motion } from 'framer-motion';
import { Radio, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const signals = [
  {
    id: 1,
    title: 'Stress détecté équipe support',
    description: 'Augmentation du stress observée suite aux pics d\'appels',
    status: 'active',
    priority: 'high',
    date: '2025-12-26'
  },
  {
    id: 2,
    title: 'Baisse engagement équipe dev',
    description: 'Moins de participation aux stand-ups quotidiens',
    status: 'pending',
    priority: 'medium',
    date: '2025-12-25'
  },
  {
    id: 3,
    title: 'Amélioration satisfaction client',
    description: 'NPS en hausse de 15 points ce mois',
    status: 'resolved',
    priority: 'low',
    date: '2025-12-24'
  },
  {
    id: 4,
    title: 'Tension inter-équipes',
    description: 'Communication difficile entre marketing et ventes',
    status: 'active',
    priority: 'high',
    date: '2025-12-23'
  },
];

const statusConfig = {
  active: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Actif' },
  pending: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'En attente' },
  resolved: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Résolu' },
};

const priorityConfig = {
  high: { color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', label: 'Haute' },
  medium: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Moyenne' },
  low: { color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', label: 'Basse' },
};

export default function Signals() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Radio className="w-8 h-8 text-violet-500" />
          Signaux
        </h1>
        <p className="text-muted-foreground">
          Tous les signaux détectés dans votre organisation
        </p>
      </motion.div>

      <div className="grid gap-4">
        {signals.map((signal, index) => {
          const status = statusConfig[signal.status as keyof typeof statusConfig];
          const priority = priorityConfig[signal.priority as keyof typeof priorityConfig];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="glass-card card-hover border-border cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`p-3 rounded-xl ${status.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={priority.color}>
                      {priority.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{signal.date}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
