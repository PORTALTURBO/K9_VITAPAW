import React from 'react';
import { ArrowLeft, Download, Share2, FileText, Activity, Pill, Stethoscope, MoreVertical } from 'lucide-react';
import { Pet, MedicalEvent } from '../types';
import { cn } from '../lib/utils';

interface DigitalReportScreenProps {
  pet: Pet;
  events: MedicalEvent[];
  onClose: () => void;
}

export const DigitalReportScreen: React.FC<DigitalReportScreenProps> = ({ pet, events, onClose }) => {
  const recentEvents = events.slice(0, 3);
  const medications = events.filter(e => e.medication?.name).slice(0, 2);

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9F6E8] flex flex-col font-sans print:bg-white print:relative print:z-auto">
      <header className="bg-[#F9F6E8] text-[#1B3A34] px-6 py-4 flex items-center justify-between border-b border-black/5 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Reporte Digital</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32 print:p-0 print:overflow-visible">
        <div className="max-w-2xl mx-auto bg-white rounded-none sm:rounded-[2rem] shadow-sm border border-black/5 overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none">
          
          {/* Report Header */}
          <div className="p-8 border-b-2 border-black/90">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#03241F] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🐾</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#0A2F25] leading-none mb-1">K9 VitalPaw</h1>
                  <p className="text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest">CLINICAL HEALTH SYSTEMS</p>
                  <p className="text-xs text-[#5C5C5C] mt-1">Sede Central: Av. Veterinaria 123, Madrid</p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">ID DEL REPORTE</p>
                <p className="text-lg font-black text-[#0A2F25]">#VP-MED-{new Date().getFullYear()}-{pet.id.substring(0, 4).toUpperCase()}</p>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mt-2 mb-1">FECHA DE EMISIÓN</p>
                <p className="text-sm font-bold text-[#0A2F25]">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-[#EAE8D5] rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#0A2F25]" />
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#A7E8D7] overflow-hidden bg-gray-100">
                  <img src={pet.photo || `https://picsum.photos/seed/${pet.name}/800/600`} alt={pet.name} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#146A5D] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F3EFE0] rounded-3xl p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">PACIENTE</p>
                <p className="font-bold text-[#0A2F25] text-lg">{pet.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">ESPECIE/RAZA</p>
                <p className="font-medium text-[#0A2F25] text-sm">Canino / {pet.breed || 'Mestizo'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">EDAD</p>
                <p className="font-medium text-[#0A2F25] text-sm">
                  {pet.birthDate ? `${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} años` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">PESO ACTUAL</p>
                <p className="font-medium text-[#0A2F25] text-sm">{pet.weight} kg</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">SEXO</p>
                <p className="font-medium text-[#0A2F25] text-sm">{pet.sex === 'male' ? 'Macho' : 'Hembra'} {pet.neutered ? '(Castrado)' : ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">MICROCHIP</p>
                <p className="font-medium text-[#0A2F25] text-sm">Pendiente de registro</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-1">PROPIETARIO</p>
                <p className="font-medium text-[#0A2F25] text-sm">En aplicación local</p>
              </div>
            </div>
          </div>

          {/* Vitals Summary */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-[#146A5D] rounded-md">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2F25] uppercase tracking-widest">RESUMEN DE SIGNOS VITALES<br/>(HISTÓRICO 30 DÍAS)</h3>
            </div>

            <div className="space-y-4">
              <div className="border border-black/10 rounded-3xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-[#0A2F25]">Frecuencia Cardíaca (LPM)</p>
                  <span className="text-[10px] font-bold text-[#2E7D6F] bg-[#E2F0D9] px-2 py-1 rounded-full">Normal: 70-120</span>
                </div>
                <div className="flex items-end justify-between h-12 gap-1 mb-2">
                  {[40, 50, 60, 65, 85, 90, 50, 45].map((h, i) => (
                    <div key={i} className={cn("w-full rounded-t-sm", i === 4 ? "bg-[#146A5D]" : "bg-[#A7E8D7]/60")} style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">
                  <span>01 OCT</span>
                  <span>PROMEDIO: 85 LPM</span>
                  <span>HOY</span>
                </div>
              </div>

              <div className="border border-black/10 rounded-3xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-[#0A2F25]">Temperatura Corporal (°C)</p>
                  <span className="text-[10px] font-bold text-[#2E7D6F] bg-[#E2F0D9] px-2 py-1 rounded-full">Normal: 37.5-39.2</span>
                </div>
                <div className="flex items-end justify-between h-12 gap-1 mb-2">
                  {[30, 40, 45, 50, 80, 60, 40, 35].map((h, i) => (
                    <div key={i} className={cn("w-full rounded-t-sm", i === 4 ? "bg-[#5C2E00]" : "bg-[#D1D0BE]/60")} style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">
                  <span>01 OCT</span>
                  <span>PROMEDIO: 38.4°C</span>
                  <span>HOY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Events */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-[#146A5D] rounded-md">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2F25] uppercase tracking-widest">REGISTRO DETALLADO DE EVENTOS<br/>CLÍNICOS</h3>
            </div>

            <div className="bg-[#F3EFE0] rounded-3xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-black/5 text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">
                <div className="col-span-2">FECHA</div>
                <div className="col-span-4">CATEGORÍA</div>
                <div className="col-span-6">DESCRIPCIÓN</div>
              </div>
              
              <div className="divide-y divide-black/5 bg-white">
                {recentEvents.length > 0 ? recentEvents.map((event, i) => (
                  <div key={event.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-2 text-xs font-bold text-[#0A2F25]">
                      {new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </div>
                    <div className="col-span-4 flex items-center gap-1.5">
                      <Stethoscope className="w-3 h-3 text-[#146A5D]" />
                      <span className="text-[10px] font-bold text-[#146A5D] uppercase tracking-widest">{event.category}</span>
                    </div>
                    <div className="col-span-6 text-xs text-[#5C5C5C] line-clamp-3">
                      {event.title}. {event.description}
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-sm text-[#5C5C5C]">No hay eventos registrados.</div>
                )}
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-[#146A5D] rounded-md">
                <Pill className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2F25] uppercase tracking-widest">TRATAMIENTOS Y MEDICACIÓN<br/>VIGENTE</h3>
            </div>

            <div className="space-y-4">
              {medications.length > 0 ? medications.map((event, i) => (
                <div key={i} className="border border-black/10 rounded-full p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E2F0D9] rounded-full flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-[#146A5D]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A2F25] text-sm">{event.medication?.name}</p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">{event.medication?.dosage} {event.medication?.duration ? `por ${event.medication.duration}` : ''}</p>
                    {event.professional?.name && (
                      <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" /> {event.professional.name}
                      </p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="border border-black/10 rounded-full p-4 text-center text-sm text-[#5C5C5C]">
                  No hay medicación vigente.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 pt-4 border-t border-black/10 flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-[#0A2F25] mb-1">Generado por K9 VitalPaw Digital Health Records</p>
              <p className="text-[10px] text-[#5C5C5C] max-w-xs">Este documento es una copia digital oficial generada localmente. La autenticidad puede verificarse mediante el número de referencia del reporte.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#0A2F25]">Página<br/>1 de 1</p>
              <div className="flex gap-1 justify-end mt-1">
                <div className="w-1.5 h-1.5 bg-[#0A2F25] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#D1D0BE] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#F9F6E8] via-[#F9F6E8] to-transparent flex gap-4 max-w-2xl mx-auto w-full">
        <button className="flex-1 py-4 bg-[#EAE8D5] text-[#0A2F25] rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D1D0BE] transition-colors">
          <Download className="w-5 h-5" /> Descargar PDF
        </button>
        <button className="flex-1 py-4 bg-[#21C55D] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1CA34D] transition-colors">
          <Share2 className="w-5 h-5" /> Compartir
        </button>
      </div>
    </div>
  );
};
