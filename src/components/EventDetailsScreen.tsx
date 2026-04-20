import React from 'react';
import { ArrowLeft, MoreVertical, Brain, Edit2, RefreshCw, Trash2, Search } from 'lucide-react';
import { MedicalEvent, Pet } from '../types';
import { cn } from '../lib/utils';

interface EventDetailsScreenProps {
  event: MedicalEvent;
  pet: Pet;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ event, pet, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-[110] bg-[#F9F6E8] flex flex-col font-sans">
      <header className="bg-[#BA1A1A] text-white px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Event Details</h2>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="bg-[#146A5D] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> RESUELTO
            </div>
            <p className="text-sm text-[#0A2F25] font-medium">
              {new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })} - {event.time}
            </p>
          </div>

          <h1 className="text-4xl font-black text-[#0A2F25] leading-tight">{event.title}</h1>

          <div className="bg-[#F3EFE0] rounded-[2rem] p-8 relative overflow-hidden">
            <p className="text-lg text-[#0A2F25] leading-relaxed relative z-10">
              {event.description || 'Sin descripción detallada.'}
            </p>
            <div className="absolute right-4 top-4 opacity-10">
              <span className="text-6xl">💉</span>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-gray-200">
            <img src={pet.photo || `https://picsum.photos/seed/${pet.name}/800/600`} alt={pet.name} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            <button className="absolute bottom-4 right-4 w-12 h-12 bg-[#F3EFE0] rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Search className="w-5 h-5 text-[#0A2F25]" />
            </button>
          </div>

          <button className="w-full bg-[#1B3A34] text-white rounded-[2rem] p-6 flex items-center justify-between hover:bg-[#1B3A34]/90 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#03241F] rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Analizar con IA</h3>
                <p className="text-sm text-white/70">Predicciones de salud basadas en historial</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 rotate-180 text-white/50" />
          </button>

          <button onClick={onEdit} className="w-full bg-[#EAE8D5] text-[#0A2F25] rounded-full py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#D1D0BE] transition-colors">
            <Edit2 className="w-5 h-5" /> Editar
          </button>

          <div className="flex gap-4">
            <button className="flex-1 bg-[#EAE8D5] text-[#0A2F25] rounded-full py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D1D0BE] transition-colors">
              <RefreshCw className="w-4 h-4" /> Cambiar Estado
            </button>
            <button onClick={onDelete} className="flex-1 bg-[#FFD9D9] text-[#BA1A1A] rounded-full py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FFC2C2] transition-colors">
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
