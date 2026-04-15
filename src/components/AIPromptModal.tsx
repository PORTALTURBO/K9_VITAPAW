import React from 'react';
import { motion } from 'motion/react';
import { Brain, Download, X } from 'lucide-react';

interface AIPromptModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-xl font-bold text-center text-primary mb-2">IA Gratuita Disponible</h2>
        <p className="text-center text-on-surface-variant text-sm mb-6">
          ¿Quieres descargar la IA gratuita (Gemma 4 E2B) para usar el Copilot sin conexión?
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onAccept}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar IA
          </button>
          <button 
            onClick={onDecline}
            className="w-full bg-surface-container-low text-primary py-3 rounded-xl font-bold"
          >
            Quizás más tarde
          </button>
        </div>
      </motion.div>
    </div>
  );
};
