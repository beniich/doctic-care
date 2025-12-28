import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const insights = [
  {
    id: 1,
    title: 'Corrélation stress-productivité',
    description: 'Les équipes avec un niveau de stress élevé montrent une baisse de 23% de productivité sur les 2 dernières semaines.',
    recommendation: 'Implémenter des pauses structurées',
    impact: 'Fort'
  },
  {
    id: 2,
    title: 'Pic d\'engagement matinal',
    description: 'L\'engagement est 40% plus élevé entre 9h et 11h. Les réunions importantes devraient être planifiées dans ce créneau.',
    recommendation: 'Restructurer planning réunions',
    impact: 'Moyen'
  },
  {
    id: 3,
    title: 'Communication asynchrone efficace',
    description: 'Les équipes utilisant plus de communication asynchrone ont 15% moins de signaux de stress.',
    recommendation: 'Former aux outils async',
    impact: 'Moyen'
  },
];

export default function Insights() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-blue-500" />
          Insights
        </h1>
        <p className="text-muted-foreground">
          Analyses et recommandations basées sur vos données
        </p>
      </motion.div>

      <div className="grid gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{insight.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'Fort' 
                          ? 'bg-rose-500/10 text-rose-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        Impact {insight.impact}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Recommandation:</strong> {insight.recommendation}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        Voir détails
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
