import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Camera, Trash2, ArrowLeft, Shield, Search, ShieldPlus, BriefcaseMedical } from 'lucide-react';
import { Pet } from '../types';
import { cn } from '../lib/utils';

interface PetFormProps {
  pet?: Pet;
  onSave: (pet: Pet) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ pet, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Partial<Pet>>(
    pet || {
      name: '',
      breed: '',
      birthDate: new Date().toISOString().split('T')[0],
      weight: 0,
      sex: 'male',
      neutered: false,
      photo: '',
      weightHistory: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPet = {
      ...formData,
      weightHistory: pet ? pet.weightHistory : [{ date: new Date().toISOString().split('T')[0], value: Number(formData.weight) }]
    } as Pet;
    onSave(finalPet);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9F6E8] flex flex-col">
      <header className="bg-[#1B3A34] text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">
            {pet ? 'Editar Perfil' : 'Nuevo Perro'}
          </h2>
        </div>
        {pet && onDelete && (
          <button 
            onClick={() => onDelete(pet.id)}
            className="p-2 text-error-container hover:bg-white/10 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      <form className="flex-1 overflow-y-auto p-6 bg-[#F9F6E8]" onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
          
          <section className="flex flex-col items-center pt-4">
            <div className="relative group mb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#5C5C5C] border-4 border-[#F9F6E8] shadow-xl flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/80">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      <circle cx="12" cy="9.5" r="1.5" fill="#F9F6E8" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#0A2F25] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform border-2 border-[#F9F6E8]">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest">Foto de perfil</p>
          </section>

          <div className="bg-[#EAE8D5] rounded-3xl p-5 flex gap-4 items-start">
            <div className="p-2 bg-[#D1D0BE] rounded-full flex-shrink-0">
              <Shield className="w-5 h-5 text-[#0A2F25]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0A2F25] text-sm mb-1">Información Veterinaria</h3>
              <p className="text-xs text-[#5C5C5C] leading-relaxed">
                Completar estos datos nos ayuda a personalizar las alertas de salud y las recomendaciones de dieta clínica para tu mascota.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h3 className="font-bold text-[#0A2F25] text-lg">Información Básica</h3>
            
            <div>
              <label className="block text-xs font-bold text-[#0A2F25] mb-2">Nombre del perro *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Max"
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2F25] mb-2">Raza</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Busca una raza..."
                  className="w-full bg-white border-none rounded-2xl pl-4 pr-10 py-3 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C5C5C]" />
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {['Golden Retriever', 'Poodle', 'Bulldog'].map(breed => (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => setFormData({ ...formData, breed })}
                    className="whitespace-nowrap px-4 py-1.5 bg-[#EAE8D5] text-[#2E7D6F] text-xs font-medium rounded-full hover:bg-[#D1D0BE] transition-colors"
                  >
                    {breed}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2F25] mb-2">Fecha de nacimiento</label>
              <input 
                type="date" 
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2F25] mb-2">Peso actual (kg)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  placeholder="0.0"
                  className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] font-medium focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#5C5C5C] rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2F25] mb-2">Sexo</label>
              <div className="flex bg-[#EAE8D5] rounded-2xl p-1">
                {['male', 'female'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, sex: s as 'male' | 'female' })}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                      formData.sex === s 
                        ? "bg-white text-[#0A2F25] shadow-sm" 
                        : "text-[#5C5C5C] hover:bg-white/50"
                    )}
                  >
                    {s === 'male' ? 'Macho' : 'Hembra'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3">
              <span className="text-sm font-medium text-[#0A2F25]">Esterilizado / Capado</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, neutered: !formData.neutered })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative p-1",
                  formData.neutered ? "bg-[#5C5C5C]" : "bg-[#EAE8D5]"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                  formData.neutered ? "translate-x-6" : "translate-x-0"
                )}></div>
              </button>
            </div>
          </section>

          <section className="bg-[#EAE8D5] p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldPlus className="w-5 h-5 text-[#0A2F25]" />
              <h3 className="font-bold text-[#0A2F25] text-sm">Salud y Nutrición</h3>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Alergias</label>
              <input 
                type="text" 
                value={formData.allergies || ''}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="Ej. Pollo, Gramíneas..."
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Medicamentos actuales</label>
              <input 
                type="text" 
                value={formData.currentMedications || ''}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                placeholder="Nombre y dosis..."
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Tipo de sangre</label>
              <select 
                value={formData.bloodType || ''}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow appearance-none"
              >
                <option value="">Seleccionar tipo</option>
                <option value="DEA 1.1">DEA 1.1</option>
                <option value="DEA 1.2">DEA 1.2</option>
                <option value="DEA 3">DEA 3</option>
                <option value="DEA 4">DEA 4</option>
                <option value="DEA 5">DEA 5</option>
                <option value="DEA 7">DEA 7</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>
          </section>

          <section className="bg-[#EAE8D5] p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <BriefcaseMedical className="w-5 h-5 text-[#0A2F25]" />
              <h3 className="font-bold text-[#0A2F25] text-sm">Tu Veterinario</h3>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Nombre del veterinario</label>
              <input 
                type="text" 
                value={formData.vetName || ''}
                onChange={(e) => setFormData({ ...formData, vetName: e.target.value })}
                placeholder="Dr. Pérez"
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Clínica / Hospital</label>
              <input 
                type="text" 
                value={formData.vetClinic || ''}
                onChange={(e) => setFormData({ ...formData, vetClinic: e.target.value })}
                placeholder="Clínica Veterinaria Central"
                className="w-full bg-white border-none rounded-2xl px-4 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-2">Teléfono de emergencias</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={formData.vetPhone || ''}
                  onChange={(e) => setFormData({ ...formData, vetPhone: e.target.value })}
                  placeholder="+34 000 000 000"
                  className="w-full bg-white border-none rounded-2xl pl-4 pr-10 py-3 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C5C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-bold text-[#0A2F25] mb-2">Notas Especiales / Observaciones</label>
            <textarea 
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Comportamiento, gustos, o cualquier detalle importante..."
              rows={4}
              className="w-full bg-white border-none rounded-3xl px-4 py-4 text-[#0A2F25] text-sm focus:ring-2 focus:ring-[#2E7D6F] transition-shadow resize-none"
            />
          </section>

        </div>
      </form>

      <div className="bg-[#F9F6E8] p-6 pb-8">
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#2E7D6F] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#1B3A34] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Guardar
        </button>
      </div>
    </div>
  );
};
