import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Activity, Radio, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLivePulse } from '@/contexts/LivePulseContext';

const statCards = [
  {
    title: 'Signaux actifs',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Radio,
    color: 'from-violet-500 to-purple-600'
  },
  {
    title: 'Insights générés',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Lightbulb,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    title: 'Engagement équipe',
    value: '89%',
    change: '-2%',
    trend: 'down',
    icon: Users,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'Score bien-être',
    value: '7.8',
    change: '+0.5',
    trend: 'up',
    icon: Activity,
    color: 'from-amber-500 to-orange-600'
  }
];

export default function Dashboard() {
  const { currentSpace, currentPeriod } = useLivePulse();

  const spaceLabels = {
    personal: 'Personnel',
    team: 'Équipe',
    organization: 'Organisation'
  };

  const periodLabels = {
    '7d': '7 derniers jours',
    '30d': '30 derniers jours',
    '90d': '90 derniers jours'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Live Pulse
        </h1>
        <p className="text-muted-foreground">
          Vue {spaceLabels[currentSpace]} • {periodLabels[currentPeriod]}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card card-hover border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'Nouveau signal détecté: Stress équipe support', time: 'Il y a 2h', type: 'signal' },
                { text: 'Insight généré: Baisse motivation post-réunion', time: 'Il y a 4h', type: 'insight' },
                { text: 'Action recommandée: Session team building', time: 'Il y a 6h', type: 'action' },
                { text: 'Score confiance amélioré de 5%', time: 'Il y a 1j', type: 'culture' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'signal' ? 'bg-violet-500' :
                    item.type === 'insight' ? 'bg-blue-500' :
                    item.type === 'action' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
