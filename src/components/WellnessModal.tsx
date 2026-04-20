import React, { useState, useEffect } from 'react';
import { X, Heart, Activity, Scale, Info, Save } from 'lucide-react';
import { Pet, MedicalEvent } from '../types';
import { cn } from '../lib/utils';

interface WellnessModalProps {
  pet: Pet;
  events: MedicalEvent[];
  onClose: () => void;
  onSavePet: (pet: Pet) => void;
}

export const WellnessModal: React.FC<WellnessModalProps> = ({ pet, events, onClose, onSavePet }) => {
  const [idealWeight, setIdealWeight] = useState<string>(pet.expectedData?.idealWeight?.toString() || pet.idealWeight?.toString() || '');
  const [checkupFreq, setCheckupFreq] = useState<string>(pet.expectedData?.checkupFrequencyMonths?.toString() || '6');
  const [minTemp, setMinTemp] = useState<string>(pet.expectedData?.minTemperature?.toString() || '37.5');
  const [maxTemp, setMaxTemp] = useState<string>(pet.expectedData?.maxTemperature?.toString() || '39.2');

  // Calculate Wellness Score
  let score = 100;
  let weightScore = 40;
  let activityScore = 30;
  let careScore = 30;

  // 1. Weight calculation
  const targetWeight = pet.expectedData?.idealWeight || pet.idealWeight;
  if (targetWeight && pet.weight) {
    const diff = Math.abs(pet.weight - targetWeight);
    const percentOff = diff / targetWeight;
    if (percentOff > 0.2) weightScore -= 20;
    else if (percentOff > 0.1) weightScore -= 10;
    else if (percentOff > 0.05) weightScore -= 5;
  } else {
    // If no ideal weight set, assume average score but encourage setting it
    weightScore = 20;
  }

  // 2. Care calculation (recent events)
  const freqMonths = pet.expectedData?.checkupFrequencyMonths || 6;
  const recentThreshold = new Date();
  recentThreshold.setMonth(recentThreshold.getMonth() - freqMonths);
  const recentEvents = events.filter(e => new Date(e.date) >= recentThreshold);
  if (recentEvents.length === 0) {
    careScore -= 15; // No recent checkups
  }

  // 3. Activity/Vitals (mock logic based on events)
  const eventsWithVitals = events.filter(e => e.vitals?.temperature || e.vitals?.heartRate);
  if (eventsWithVitals.length === 0) {
    activityScore -= 10;
  } else {
    const minT = pet.expectedData?.minTemperature || 37.5;
    const maxT = pet.expectedData?.maxTemperature || 39.2;
    // Check if latest temp is within boundaries
    const latestEventWithTemp = eventsWithVitals[0];
    if (latestEventWithTemp.vitals?.temperature) {
      if (latestEventWithTemp.vitals.temperature < minT || latestEventWithTemp.vitals.temperature > maxT) {
        activityScore -= 10;
      }
    }
  }

  score = weightScore + activityScore + careScore;

  const handleSave = () => {
    const parsedWeight = parseFloat(idealWeight);
    onSavePet({
      ...pet,
      idealWeight: isNaN(parsedWeight) ? undefined : parsedWeight,
      expectedData: {
        idealWeight: isNaN(parsedWeight) ? undefined : parsedWeight,
        checkupFrequencyMonths: parseInt(checkupFreq) || 6,
        minTemperature: parseFloat(minTemp) || 37.5,
        maxTemperature: parseFloat(maxTemp) || 39.2
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex justify-center p-4 font-sans overflow-y-auto items-start sm:items-center">
      <div className="bg-[#F9F6E8] rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl my-auto flex-shrink-0">
        <div className="bg-[#1B3A34] p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 relative">
            <Heart className="w-10 h-10 text-[#A7E8D7] fill-current" />
            <div className="absolute -bottom-2 -right-2 bg-[#21C55D] text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-[#1B3A34]">
              {score}/100
            </div>
          </div>
          <h2 className="text-2xl font-black mb-1">Índice de Bienestar</h2>
          <p className="text-white/70 text-sm">Análisis de salud de {pet.name}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Desglose del Puntaje</h3>
            
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#1B3A34]" />
                  <span className="font-bold text-sm text-[#0A2F25]">Peso Corporal</span>
                </div>
                <span className="text-sm font-bold text-[#2E7D6F]">{weightScore}/40</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-[#1B3A34] h-1.5 rounded-full" style={{ width: `${(weightScore/40)*100}%` }}></div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Peso Actual</label>
                  <div className="text-sm font-medium text-[#0A2F25]">{pet.weight} kg</div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Peso Ideal</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={idealWeight}
                      onChange={(e) => setIdealWeight(e.target.value)}
                      placeholder="Ej: 15"
                      className="w-16 text-sm bg-[#F3EFE0] border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#1B3A34]"
                    />
                    <span className="text-xs text-[#5C5C5C]">kg</span>
                  </div>
                </div>
              </div>
              {!pet.idealWeight && (
                <p className="text-xs text-[#BA1A1A] mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Configura el peso ideal para un cálculo preciso.
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1B3A34]" />
                  <span className="font-bold text-sm text-[#0A2F25]">Atención Preventiva</span>
                </div>
                <span className="text-sm font-bold text-[#2E7D6F]">{careScore}/30</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-[#1B3A34] h-1.5 rounded-full" style={{ width: `${(careScore/30)*100}%` }}></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest leading-tight">Frecuencia de Revisión Esperada</label>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={checkupFreq}
                      onChange={(e) => setCheckupFreq(e.target.value)}
                      className="w-16 text-sm bg-[#F3EFE0] border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#1B3A34]"
                    />
                    <span className="text-xs text-[#5C5C5C]">meses</span>
                  </div>
                </div>
              </div>
              {careScore < 30 && (
                <p className="text-xs text-[#BA1A1A] mt-2">Faltan registros médicos recientes ({freqMonths} meses).</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#1B3A34]" />
                  <span className="font-bold text-sm text-[#0A2F25]">Signos Vitales Esperados</span>
                </div>
                <span className="text-sm font-bold text-[#2E7D6F]">{activityScore}/30</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-[#1B3A34] h-1.5 rounded-full" style={{ width: `${(activityScore/30)*100}%` }}></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1"><label className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Temp. Mínima</label></div>
                  <div className="flex items-center gap-1">
                    <input type="number" step="0.1" value={minTemp} onChange={(e) => setMinTemp(e.target.value)} className="w-16 text-sm bg-[#F3EFE0] rounded-lg px-2 py-1" />
                    <span className="text-xs text-[#5C5C5C]">°C</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><label className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Temp. Máxima</label></div>
                  <div className="flex items-center gap-1">
                    <input type="number" step="0.1" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} className="w-16 text-sm bg-[#F3EFE0] rounded-lg px-2 py-1" />
                    <span className="text-xs text-[#5C5C5C]">°C</span>
                  </div>
                </div>
              </div>
              {activityScore < 30 && (
                <p className="text-xs text-[#BA1A1A] mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Faltan signos o están fuera de rango.
                </p>
              )}
            </div>

          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 bg-[#03241F] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#03241F]/90 transition-colors"
          >
            <Save className="w-4 h-4" /> Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
