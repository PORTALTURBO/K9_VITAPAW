import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { Pet } from '../types';

interface DoseCalculatorProps {
  pet: Pet;
  onClose: () => void;
}

const MEDICATIONS = [
  { id: 'amoxicilina', name: 'Amoxicilina', doseMgPerKg: 15, frequency: 'cada 12 horas por 7 días' },
  { id: 'metronidazol', name: 'Metronidazol', doseMgPerKg: 15, frequency: 'cada 12 horas por 5 días' },
  { id: 'dipirona', name: 'Dipirona', doseMgPerKg: 25, frequency: 'cada 8 horas' },
  { id: 'meloxicam', name: 'Meloxicam', doseMgPerKg: 0.1, frequency: 'cada 24 horas' },
  { id: 'cefalexina', name: 'Cefalexina', doseMgPerKg: 22, frequency: 'cada 12 horas por 7 días' },
];

export const DoseCalculator: React.FC<DoseCalculatorProps> = ({ pet, onClose }) => {
  const [weight, setWeight] = useState<number>(pet.weight);
  const [selectedMed, setSelectedMed] = useState<string>('');

  const medication = MEDICATIONS.find(m => m.id === selectedMed);
  const calculatedDose = medication ? (weight * medication.doseMgPerKg).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 relative z-10 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black font-headline text-primary mb-6 flex items-center gap-3">
          <span className="text-3xl">💊</span> Calculadora de Dosis
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Peso del perro (kg)
            </label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-5 py-4 text-primary font-bold focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Medicamento
            </label>
            <select 
              value={selectedMed}
              onChange={(e) => setSelectedMed(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-5 py-4 text-primary font-bold focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors appearance-none"
            >
              <option value="">Selecciona un medicamento...</option>
              {MEDICATIONS.map(med => (
                <option key={med.id} value={med.id}>{med.name}</option>
              ))}
            </select>
          </div>

          {medication && calculatedDose && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary-container/30 border border-secondary/20 rounded-3xl p-6 text-center"
            >
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Dosis Calculada</p>
              <p className="text-4xl font-black text-primary mb-1">{calculatedDose} <span className="text-xl text-on-surface-variant">mg</span></p>
              <p className="text-sm font-bold text-on-surface-variant">{medication.frequency}</p>
            </motion.div>
          )}

          <div className="bg-[#fff0f0] border border-[#ffdad6] rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ba1a1a] flex-shrink-0" />
            <p className="text-xs font-medium text-[#410002] leading-relaxed">
              <strong>Información orientativa.</strong> Consulta siempre a tu veterinario antes de administrar cualquier medicamento a tu mascota.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
