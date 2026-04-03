import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpgradeGateProps {
  feature: string;
  allowedPlans: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UpgradeGate: React.FC<UpgradeGateProps> = ({ 
  feature, 
  allowedPlans, 
  children, 
  fallback 
}) => {
  const { currentTenant } = useTenant();
  const navigate = useNavigate();

  const plan = currentTenant?.plan || 'STARTER';
  const hasAccess = allowedPlans.includes(plan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col items-center text-center group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary shadow-glow" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{feature}</h3>
        <p className="text-white/60 mb-6 max-w-md mx-auto">
          Cette fonctionnalité est réservée aux membres des plans {allowedPlans.join(', ')}. 
          Upgradez votre clinique pour y accéder immédiatement.
        </p>

        <Button 
          onClick={() => navigate('/saas-billing')}
          className="bg-primary text-white hover:shadow-glow-primary transition-all rounded-xl px-8"
        >
          Voir les Plans Premium
        </Button>
      </div>
    </motion.div>
  );
};
