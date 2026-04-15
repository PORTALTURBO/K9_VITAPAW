import React from 'react';
import { motion } from 'motion/react';
import { Brain, Loader2 } from 'lucide-react';

interface AIDownloadProgressProps {
  progress: number;
}

export const AIDownloadProgress: React.FC<AIDownloadProgressProps> = ({ progress }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[150] bg-surface rounded-2xl shadow-xl border border-outline-variant/20 p-4 flex items-center gap-4"
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin absolute" />
        <Brain className="w-4 h-4 text-primary relative z-10" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-primary mb-1">Descargando IA...</p>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-1 text-right">{Math.round(progress)}%</p>
      </div>
    </motion.div>
  );
};
