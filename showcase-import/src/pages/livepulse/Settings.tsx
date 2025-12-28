import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Users, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const settingsSections = [
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Gérez vos préférences de notification',
    settings: [
      { id: 'email', label: 'Notifications par email', enabled: true },
      { id: 'push', label: 'Notifications push', enabled: true },
      { id: 'digest', label: 'Résumé hebdomadaire', enabled: false },
    ]
  },
  {
    icon: Shield,
    title: 'Confidentialité',
    description: 'Contrôlez la visibilité de vos données',
    settings: [
      { id: 'anonymous', label: 'Signaux anonymes', enabled: true },
      { id: 'share', label: 'Partage avec l\'équipe', enabled: true },
    ]
  },
  {
    icon: Users,
    title: 'Équipe',
    description: 'Paramètres de collaboration',
    settings: [
      { id: 'invite', label: 'Autoriser les invitations', enabled: true },
      { id: 'visible', label: 'Profil visible', enabled: true },
    ]
  },
];

export default function Settings() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-muted-foreground" />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Configurez votre expérience Live Pulse
        </p>
      </motion.div>

      <div className="grid gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-foreground">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <Label htmlFor={setting.id} className="text-foreground">
                      {setting.label}
                    </Label>
                    <Switch id={setting.id} defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
