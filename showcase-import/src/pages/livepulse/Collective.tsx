import { motion } from 'framer-motion';
import { Users, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const discussions = [
  {
    id: 1,
    title: 'Comment améliorer la communication inter-équipes?',
    author: 'Marie D.',
    replies: 12,
    likes: 24,
    trending: true
  },
  {
    id: 2,
    title: 'Propositions pour les pauses bien-être',
    author: 'Jean P.',
    replies: 8,
    likes: 15,
    trending: false
  },
  {
    id: 3,
    title: 'Retours sur le nouveau planning de réunions',
    author: 'Sophie L.',
    replies: 5,
    likes: 10,
    trending: false
  },
];

export default function Collective() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-500" />
          Intelligence collective
        </h1>
        <p className="text-muted-foreground">
          Échangez et collaborez avec votre équipe
        </p>
      </motion.div>

      <div className="grid gap-4">
        {discussions.map((discussion, index) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass-card card-hover border-border cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {discussion.trending && (
                        <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          Tendance
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{discussion.title}</h3>
                    <p className="text-sm text-muted-foreground">par {discussion.author}</p>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      {discussion.replies}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      {discussion.likes}
                    </span>
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
