import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Camera, Trash2, ArrowLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-[110] bg-surface flex flex-col">
      <header className="bg-gradient-to-r from-[#1B3A34] to-[#2E7D6F] text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-headline font-bold">
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

      <form className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest" onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
          
          <section className="flex flex-col items-center pt-4">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-surface-container-low border-4 border-white shadow-xl">
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform border-4 border-white">
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Nombre del perro *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Max"
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-primary font-medium focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Raza</label>
              <input 
                type="text" 
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Ej: Golden Retriever"
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-primary font-medium focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Nacimiento</label>
                <input 
                  type="date" 
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-primary font-medium focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Peso actual (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-primary font-medium focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Sexo</label>
              <div className="flex gap-3">
                {['male', 'female'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, sex: s as 'male' | 'female' })}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                      formData.sex === s 
                        ? "bg-primary border-primary text-white shadow-md" 
                        : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
                    )}
                  >
                    {s === 'male' ? 'Macho' : 'Hembra'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold text-primary">Esterilizado / Castrado</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, neutered: !formData.neutered })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative p-1",
                  formData.neutered ? "bg-secondary" : "bg-surface-container-highest"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                  formData.neutered ? "translate-x-6" : "translate-x-0"
                )}></div>
              </button>
            </div>
          </section>

        </div>
      </form>

      <div className="bg-white p-6 border-t border-outline-variant/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Guardar
        </button>
      </div>
    </div>
  );
};
