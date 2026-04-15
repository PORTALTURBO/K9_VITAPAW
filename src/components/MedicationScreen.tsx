import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle, Pill, Syringe, Activity, ChevronRight, ArrowLeft } from 'lucide-react';
import { Pet } from '../types';
import { cn } from '../lib/utils';

interface MedicationScreenProps {
  pet: Pet;
  onClose: () => void;
}

const MEDICATIONS = [
  { id: 'amoxicilina', name: 'Amoxicilina', doseMgPerKg: 15, frequency: 'cada 12 horas por 7 días', type: 'Antibiótico' },
  { id: 'metronidazol', name: 'Metronidazol', doseMgPerKg: 15, frequency: 'cada 12 horas por 5 días', type: 'Antibiótico/Antiparasitario' },
  { id: 'dipirona', name: 'Dipirona', doseMgPerKg: 25, frequency: 'cada 8 horas', type: 'Analgésico/Antipirético' },
  { id: 'meloxicam', name: 'Meloxicam', doseMgPerKg: 0.1, frequency: 'cada 24 horas', type: 'Antiinflamatorio (AINE)' },
  { id: 'cefalexina', name: 'Cefalexina', doseMgPerKg: 22, frequency: 'cada 12 horas por 7 días', type: 'Antibiótico' },
];

export const MedicationScreen: React.FC<MedicationScreenProps> = ({ pet, onClose }) => {
  const [weight, setWeight] = useState<number>(pet.weight);
  const [selectedMed, setSelectedMed] = useState<string>('');

  const medication = MEDICATIONS.find(m => m.id === selectedMed);
  const calculatedDose = medication ? (weight * medication.doseMgPerKg).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9F6E8] flex flex-col font-sans">
      <header className="bg-[#1B3A34] text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Medicamentos</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
          
          <div className="mb-2">
            <p className="text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest mb-1">CENTRO MÉDICO</p>
            <h1 className="text-3xl font-black text-[#1B3A34] mb-2 leading-tight">Farmacia y Dosis</h1>
            <p className="text-gray-600 text-sm">Gestiona la medicación de {pet.name} y calcula dosis estimadas basadas en su peso actual.</p>
          </div>

          {/* Current Medications */}
          <section className="bg-[#EAE8D5] p-6 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#D1D0BE] rounded-full">
                <Activity className="w-5 h-5 text-[#0A2F25]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0A2F25] text-sm">Medicación Actual</h3>
                <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest">Registrada en su perfil</p>
              </div>
            </div>

            {pet.currentMedications ? (
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-[#E2F0D9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-[#2E7D6F]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A2F25] whitespace-pre-wrap">{pet.currentMedications}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 p-6 rounded-2xl border border-black/5 text-center border-dashed">
                <p className="text-sm text-[#5C5C5C] font-medium">No hay medicamentos registrados actualmente.</p>
              </div>
            )}
          </section>

          {/* Dose Calculator */}
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#E2F0D9] rounded-full">
                <Syringe className="w-5 h-5 text-[#2E7D6F]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0A2F25] text-sm">Calculadora de Dosis</h3>
                <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest">Estimación por peso</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#0A2F25] mb-2">Peso actual (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#F9F6E8] border-none rounded-2xl px-4 py-3 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C5C5C] font-bold text-sm">
                    kg
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F25] mb-2">Medicamento</label>
                <div className="relative">
                  <select 
                    value={selectedMed}
                    onChange={(e) => setSelectedMed(e.target.value)}
                    className="w-full bg-[#F9F6E8] border-none rounded-2xl px-4 py-3 pr-10 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow appearance-none"
                  >
                    <option value="">Selecciona un medicamento...</option>
                    {MEDICATIONS.map(med => (
                      <option key={med.id} value={med.id}>{med.name} ({med.type})</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C5C5C] pointer-events-none rotate-90" />
                </div>
              </div>

              {medication && calculatedDose && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#1B3A34] rounded-3xl p-6 text-center shadow-lg relative overflow-hidden"
                >
                  <div className="absolute -right-6 -top-6 opacity-10">
                    <Pill className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-[#E2F0D9] uppercase tracking-widest mb-2">Dosis Estimada</p>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <p className="text-5xl font-black text-white">{calculatedDose}</p>
                      <span className="text-xl text-white/80 font-medium">mg</span>
                    </div>
                    <div className="inline-block bg-white/10 rounded-full px-4 py-1.5 mt-2">
                      <p className="text-sm font-medium text-white">{medication.frequency}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="bg-[#FFF4E5] border border-[#FFE0B2] rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-[#E65100] flex-shrink-0" />
                <p className="text-xs font-medium text-[#E65100] leading-relaxed">
                  <strong>Información puramente orientativa.</strong> Esta calculadora no sustituye el criterio profesional. Consulta siempre a tu veterinario antes de administrar cualquier medicamento.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
