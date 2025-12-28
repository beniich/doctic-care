import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const actions = [
  {
    id: 1,
    title: 'Session team building équipe support',
    description: 'Organiser une activité de cohésion pour réduire le stress',
    progress: 60,
    status: 'in_progress',
    dueDate: '2025-12-30'
  },
  {
    id: 2,
    title: 'Formation communication asynchrone',
    description: 'Former les équipes aux outils de communication async',
    progress: 25,
    status: 'in_progress',
    dueDate: '2026-01-15'
  },
  {
    id: 3,
    title: 'Révision horaires réunions',
    description: 'Restructurer le planning des réunions selon les pics d\'engagement',
    progress: 100,
    status: 'completed',
    dueDate: '2025-12-20'
  },
  {
    id: 4,
    title: 'Mise en place pauses structurées',
    description: 'Implémenter des pauses régulières dans la journée de travail',
    progress: 0,
    status: 'pending',
    dueDate: '2026-01-20'
  },
];

export default function Actions() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-amber-500" />
          Actions
        </h1>
        <p className="text-muted-foreground">
          Suivez et gérez les actions recommandées
        </p>
      </motion.div>

      <div className="grid gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${
                    action.status === 'completed' ? 'text-emerald-500' :
                    action.status === 'in_progress' ? 'text-blue-500' : 'text-muted-foreground'
                  }`}>
                    {action.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : action.status === 'in_progress' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className={`font-semibold ${
                        action.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={action.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{action.progress}%</span>
                      <span className="text-xs text-muted-foreground">
                        Échéance: {action.dueDate}
                      </span>
                    </div>
                  </div>
                  {action.status !== 'completed' && (
                    <Button variant="outline" size="sm">
                      {action.status === 'pending' ? 'Démarrer' : 'Mettre à jour'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
