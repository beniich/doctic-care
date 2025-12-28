import { motion } from 'framer-motion';
import { Heart, Star, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const metrics = [
  { label: 'Score confiance', value: 82, change: '+5%', icon: Heart },
  { label: 'Engagement global', value: 89, change: '+3%', icon: Star },
  { label: 'Satisfaction équipe', value: 76, change: '+8%', icon: TrendingUp },
  { label: 'Culture d\'innovation', value: 71, change: '+2%', icon: Award },
];

const values = [
  { name: 'Transparence', score: 85 },
  { name: 'Collaboration', score: 78 },
  { name: 'Innovation', score: 71 },
  { name: 'Bien-être', score: 82 },
  { name: 'Excellence', score: 74 },
];

export default function Culture() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500" />
          Culture & Confiance
        </h1>
        <p className="text-muted-foreground">
          Mesurez et renforcez votre culture d'entreprise
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <metric.icon className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                <div className="text-3xl font-bold text-foreground">{metric.value}%</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-emerald-400 mt-1">{metric.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Valeurs d'entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {values.map((value, index) => (
              <div key={value.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{value.name}</span>
                  <span className="text-muted-foreground">{value.score}%</span>
                </div>
                <Progress value={value.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
