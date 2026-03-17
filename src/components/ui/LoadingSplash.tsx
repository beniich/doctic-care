import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

export function LoadingSplash({ message = "Initialisation de votre espace sécurisé..." }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0a25] overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,200,255,0.4)] border border-white/20"
          >
            <Stethoscope className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 animate-ping opacity-20 scale-150" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white tracking-tight mb-2 text-center"
        >
          Doctic <span className="text-primary italic">Care</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-blue-200/60 text-sm font-medium tracking-wide mb-8"
        >
          {message}
        </motion.p>

        {/* Custom Progress Bar */}
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(0,200,255,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex gap-1 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </motion.div>

      {/* Grid Overlay for Tech Look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
    </div>
  );
}
