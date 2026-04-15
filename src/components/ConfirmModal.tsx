import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 font-medium">{message}</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={onCancel}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className={`flex-1 py-4 font-bold transition-colors ${
                  isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
