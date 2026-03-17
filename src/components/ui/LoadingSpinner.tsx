'use client';

import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
    <motion.div
        className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    />
);
