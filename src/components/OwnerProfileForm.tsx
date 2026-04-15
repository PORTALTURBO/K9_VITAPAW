import React, { useState } from 'react';
import { X, Save, Camera, Phone, MapPin, HeartPulse } from 'lucide-react';
import { OwnerProfile } from '../types';

interface OwnerProfileFormProps {
  profile: OwnerProfile;
  onSave: (profile: OwnerProfile) => void;
  onClose: () => void;
}

export const OwnerProfileForm: React.FC<OwnerProfileFormProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<OwnerProfile>(
    profile || { name: '', emergencyContact: { name: '', phone: '' } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
    <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#F9F6E8] rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <header className="bg-[#2E7D6F] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold">Perfil del Dueño</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="owner-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-[#2E7D6F] shadow-lg">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1B3A34]/30">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#1B3A34] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform border-2 border-white">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                <h3 className="text-xs font-bold text-[#2E7D6F] uppercase tracking-widest mb-4">Datos Personales</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F9F6E8] border-none rounded-xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F9F6E8] border-none rounded-xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B3A34]/40" />
                      <input 
                        type="tel" 
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#F9F6E8] border-none rounded-xl pl-10 pr-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Dirección</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#1B3A34]/40" />
                      <textarea 
                        rows={2}
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-[#F9F6E8] border-none rounded-xl pl-10 pr-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors resize-none"
                        placeholder="Calle Principal 123..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#E2F0D9] p-4 rounded-2xl border border-[#2E7D6F]/20 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <HeartPulse className="w-4 h-4 text-[#2E7D6F]" />
                  <h3 className="text-xs font-bold text-[#2E7D6F] uppercase tracking-widest">Contacto de Emergencia</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Nombre del Contacto</label>
                    <input 
                      type="text" 
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact!, name: e.target.value } })}
                      className="w-full bg-white border-none rounded-xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                      placeholder="Ej: María Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-1 ml-2">Teléfono de Emergencia</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B3A34]/40" />
                      <input 
                        type="tel" 
                        value={formData.emergencyContact?.phone || ''}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact!, phone: e.target.value } })}
                        className="w-full bg-white border-none rounded-xl pl-10 pr-4 py-3 text-[#1B3A34] font-medium focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                        placeholder="+1 987 654 321"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 bg-white border-t border-black/5 shrink-0">
          <button 
            type="submit"
            form="owner-form"
            className="w-full bg-[#1B3A34] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#1B3A34]/20 hover:bg-[#2E7D6F] transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> Guardar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};
