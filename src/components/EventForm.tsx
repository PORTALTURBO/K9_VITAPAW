import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Calendar, Clock, Image as ImageIcon, Bell, Camera, Video, AlertCircle, Thermometer, HeartPulse, Stethoscope, Building2, Pill, Mic, FileText, Plus } from 'lucide-react';
import { MedicalEvent, MediaItem } from '../types';
import { SEVERITIES } from '../constants';
import { storageService } from '../services/storageService';
import { cn } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import * as Icons from 'lucide-react';

interface EventFormProps {
  petId: string;
  event?: MedicalEvent;
  onSave: (event: MedicalEvent) => void;
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ petId, event, onSave, onClose }) => {
  const categories = storageService.getCategories();
  const statuses = storageService.getStatuses();

  const [formData, setFormData] = useState<Partial<MedicalEvent>>(
    event || {
      petId,
      title: '',
      description: '',
      category: categories[0]?.id || 'medical',
      severity: 'medium',
      status: statuses[0]?.id || 'active',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      media: [],
      medication: { name: '', dosage: '', duration: '' },
      vitals: { temperature: undefined, heartRate: undefined },
      professional: { name: '', clinic: '' },
      reminder: { frequency: 12, unit: 'hrs', enabled: true, limitType: 'infinite', occurrences: 3 }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    onSave({
      id: event?.id || uuidv4(),
      petId,
      title: formData.title,
      description: formData.description || '',
      category: formData.category as string,
      severity: formData.severity as string,
      status: formData.status as string,
      date: formData.date,
      time: formData.time || '00:00',
      media: formData.media || [],
      medication: formData.medication,
      vitals: formData.vitals,
      professional: formData.professional,
      reminder: formData.reminder,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let type = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';

        const newMediaItem: MediaItem = {
          id: uuidv4(),
          type,
          url: reader.result as string,
          name: file.name,
          date: new Date().toISOString()
        };
        setFormData(prev => ({ ...prev, media: [...(prev.media || []), newMediaItem] }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9F6E8] flex flex-col font-sans">
      <header className="bg-[#F9F6E8] text-[#1B3A34] px-6 py-4 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Ficha Médica Definitiva</h2>
        </div>
        <button onClick={handleSubmit} className="text-sm font-bold text-[#1B3A34] uppercase tracking-wider hover:opacity-70">
          Save
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <form id="event-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto pb-32">
          
          <div className="mb-8">
            <p className="text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest mb-1">CLINICAL RECORDS</p>
            <h1 className="text-3xl font-black text-[#1B3A34] mb-2 leading-tight">Ficha Médica Definitiva</h1>
            <p className="text-gray-600 text-sm">Registra el historial médico detallado para un seguimiento veterinario profesional.</p>
          </div>

          {/* Categoría y Estado */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Icons.LayoutGrid className="w-4 h-4 text-[#1B3A34]" />
                <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Categoría y Estado</h3>
              </div>
              <button type="button" className="bg-[#E2F0D9] text-[#2E7D6F] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Plus className="w-3 h-3" /> NUEVA
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((category) => {
                const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;
                const isSelected = formData.category === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-3xl border-2 transition-all",
                      isSelected ? "border-[#1B3A34] bg-transparent" : "border-transparent bg-transparent hover:bg-black/5"
                    )}
                  >
                    <Icon className="w-6 h-6 text-[#1B3A34]" />
                    <span className="text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2">Estado de la mascota</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-transparent border border-[#1B3A34]/20 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#1B3A34] focus:ring-1 focus:ring-[#1B3A34] transition-colors appearance-none"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detalles Generales */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-[#1B3A34]" />
              <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Detalles Generales</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Título del evento</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-transparent border border-[#1B3A34]/20 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#1B3A34] focus:ring-1 focus:ring-[#1B3A34] transition-colors"
                  placeholder="Ej: Control de Gastritis"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Nivel de Gravedad / Urgencia</label>
                <div className="flex gap-2">
                  {Object.entries(SEVERITIES).map(([key, sev]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: key })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                        formData.severity === key ? "border-[#FF6B00] text-[#1B3A34] bg-white" : "border-[#1B3A34]/20 text-[#1B3A34]/60 bg-transparent"
                      )}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sev.color }}></div>
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Descripción Clínica</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-transparent border border-[#1B3A34]/20 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#1B3A34] focus:ring-1 focus:ring-[#1B3A34] transition-colors resize-none"
                  placeholder="Registrar hallazgos, observaciones o notas adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Tratamiento & Medicación */}
          <div className="bg-[#E2F0D9] p-6 rounded-[2rem] border border-[#2E7D6F]/20">
            <div className="flex items-center gap-2 mb-6">
              <Pill className="w-4 h-4 text-[#2E7D6F]" />
              <h3 className="text-sm font-bold text-[#2E7D6F] uppercase tracking-widest">Tratamiento & Medicación</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest mb-2 ml-2">Nombre del Medicamento</label>
                <input
                  type="text"
                  value={formData.medication?.name || ''}
                  onChange={(e) => setFormData({ ...formData, medication: { ...formData.medication!, name: e.target.value } })}
                  className="w-full bg-transparent border border-[#2E7D6F]/30 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#2E7D6F] focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                  placeholder="Ej: Omeprazol 20mg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest mb-2 ml-2">Dosis</label>
                  <input
                    type="text"
                    value={formData.medication?.dosage || ''}
                    onChange={(e) => setFormData({ ...formData, medication: { ...formData.medication!, dosage: e.target.value } })}
                    className="w-full bg-transparent border border-[#2E7D6F]/30 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#2E7D6F] focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                    placeholder="1 comprimido"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2E7D6F] uppercase tracking-widest mb-2 ml-2">Duración</label>
                  <input
                    type="text"
                    value={formData.medication?.duration || ''}
                    onChange={(e) => setFormData({ ...formData, medication: { ...formData.medication!, duration: e.target.value } })}
                    className="w-full bg-transparent border border-[#2E7D6F]/30 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#2E7D6F] focus:ring-1 focus:ring-[#2E7D6F] transition-colors"
                    placeholder="7 días"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mediciones / Signos Vitales */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-[#1B3A34]" />
              <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Mediciones / Signos Vitales</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-transparent border border-[#1B3A34]/20 rounded-3xl p-4 flex items-center gap-4">
                <Thermometer className="w-6 h-6 text-[#1B3A34]/60" />
                <div>
                  <label className="block text-[8px] font-bold text-[#1B3A34]/60 uppercase tracking-widest">Temperatura</label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitals?.temperature || ''}
                      onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, temperature: e.target.value ? parseFloat(e.target.value) : undefined } })}
                      className="w-16 bg-transparent border-none p-0 text-xl font-medium text-[#1B3A34] focus:ring-0"
                      placeholder="38.5"
                    />
                    <span className="text-sm font-medium text-[#1B3A34]">°C</span>
                  </div>
                </div>
              </div>
              <div className="bg-transparent border border-[#1B3A34]/20 rounded-3xl p-4 flex items-center gap-4">
                <HeartPulse className="w-6 h-6 text-[#1B3A34]/60" />
                <div>
                  <label className="block text-[8px] font-bold text-[#1B3A34]/60 uppercase tracking-widest">Ritmo Card.</label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={formData.vitals?.heartRate || ''}
                      onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, heartRate: e.target.value ? parseInt(e.target.value) : undefined } })}
                      className="w-12 bg-transparent border-none p-0 text-xl font-medium text-[#1B3A34] focus:ring-0"
                      placeholder="80"
                    />
                    <span className="text-sm font-medium text-[#1B3A34]">bpm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profesional & Clínica */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-4 h-4 text-[#1B3A34]" />
              <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Profesional & Clínica</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Veterinario Responsable</label>
                <input
                  type="text"
                  value={formData.professional?.name || ''}
                  onChange={(e) => setFormData({ ...formData, professional: { ...formData.professional!, name: e.target.value } })}
                  className="w-full bg-transparent border border-[#1B3A34]/20 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#1B3A34] focus:ring-1 focus:ring-[#1B3A34] transition-colors"
                  placeholder="Dr. Alejandro Méndez"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Centro Veterinario / Clínica</label>
                <input
                  type="text"
                  value={formData.professional?.clinic || ''}
                  onChange={(e) => setFormData({ ...formData, professional: { ...formData.professional!, clinic: e.target.value } })}
                  className="w-full bg-transparent border border-[#1B3A34]/20 rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:border-[#1B3A34] focus:ring-1 focus:ring-[#1B3A34] transition-colors"
                  placeholder="Clínica Veterinaria Animalia"
                />
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-[#1B3A34]" />
              <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Fecha y Hora</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-4 flex items-center gap-4">
                <Calendar className="w-6 h-6 text-[#1B3A34]" />
                <div className="flex-1">
                  <label className="block text-[8px] font-bold text-[#1B3A34]/60 uppercase tracking-widest">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-[#1B3A34] focus:ring-0"
                  />
                </div>
              </div>
              <div className="bg-white rounded-3xl p-4 flex items-center gap-4">
                <Clock className="w-6 h-6 text-[#1B3A34]" />
                <div className="flex-1">
                  <label className="block text-[8px] font-bold text-[#1B3A34]/60 uppercase tracking-widest">Hora</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-[#1B3A34] focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registro Multimedia */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-4 h-4 text-[#1B3A34]" />
              <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Registro Multimedia</h3>
            </div>
            
            <div className="border-2 border-dashed border-[#1B3A34]/20 rounded-[2rem] p-8 flex flex-col items-center text-center relative">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1B3A34] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 bg-[#2E7D6F] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Video className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 bg-[#4A90E2] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center text-white shadow-lg">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-[#1B3A34] font-bold mb-2">Cargar Archivos</h4>
              <p className="text-[10px] text-gray-500 max-w-[250px]">Fotos, vídeos, audios o documentos (PDF, DOCX).</p>
              
              <input 
                type="file" 
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
              />

              {formData.media && formData.media.length > 0 && (
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                  {formData.media.map((item, idx) => {
                    const isString = typeof item === 'string';
                    const url = isString ? item : item.url;
                    const type = isString ? (url.startsWith('data:video/') ? 'video' : 'image') : item.type;
                    const name = isString ? 'Archivo adjunto' : item.name;

                    return (
                      <div key={idx} className="w-20 h-20 bg-white rounded-xl overflow-hidden relative border border-black/5 flex flex-col items-center justify-center group shadow-sm">
                        {type === 'image' && <img src={url} alt={name} className="w-full h-full object-cover" />}
                        {type === 'video' && <video src={url} className="w-full h-full object-cover" />}
                        {type === 'audio' && (
                          <div className="flex flex-col items-center p-2 text-center">
                            <Mic className="w-6 h-6 text-[#4A90E2] mb-1" />
                            <span className="text-[8px] font-medium text-gray-600 truncate w-full">{name}</span>
                          </div>
                        )}
                        {type === 'document' && (
                          <div className="flex flex-col items-center p-2 text-center">
                            <FileText className="w-6 h-6 text-[#F5A623] mb-1" />
                            <span className="text-[8px] font-medium text-gray-600 truncate w-full">{name}</span>
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const newMedia = [...formData.media!];
                            newMedia.splice(idx, 1);
                            setFormData({ ...formData, media: newMedia });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Alerta de Seguimiento */}
          <div className="bg-[#F3EFE0] p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1B3A34]" />
                <h3 className="text-sm font-bold text-[#1B3A34] uppercase tracking-widest">Alerta de Seguimiento</h3>
              </div>
              <div 
                onClick={() => setFormData({ ...formData, reminder: { ...formData.reminder!, enabled: !formData.reminder?.enabled } })}
                className={cn(
                  "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                  formData.reminder?.enabled ? "bg-[#2E7D6F]" : "bg-[#1B3A34]/20"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                  formData.reminder?.enabled ? "translate-x-6" : "translate-x-0"
                )}></div>
              </div>
            </div>
            
            {formData.reminder?.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Frecuencia</label>
                    <input 
                      type="number" 
                      value={formData.reminder.frequency}
                      onChange={(e) => setFormData({ ...formData, reminder: { ...formData.reminder!, frequency: e.target.value ? parseInt(e.target.value) : 12 } })}
                      className="w-full bg-[#1B3A34]/5 border-none rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Unidad</label>
                    <select 
                      value={formData.reminder.unit}
                      onChange={(e) => setFormData({ ...formData, reminder: { ...formData.reminder!, unit: e.target.value as any } })}
                      className="w-full bg-[#1B3A34]/5 border-none rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-0 appearance-none"
                    >
                      <option value="hrs">horas</option>
                      <option value="days">días</option>
                      <option value="weeks">semanas</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Límite de recordatorios</label>
                  <select
                    value={formData.reminder.limitType || 'infinite'}
                    onChange={(e) => setFormData({ ...formData, reminder: { ...formData.reminder!, limitType: e.target.value as any } })}
                    className="w-full bg-[#1B3A34]/5 border-none rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-0 appearance-none mb-3"
                  >
                    <option value="infinite">Continuo (Sin límite)</option>
                    <option value="date">Hasta una fecha límite</option>
                    <option value="count">Cantidad exacta de veces</option>
                  </select>

                  {formData.reminder.limitType === 'date' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Fecha de finalización</label>
                      <input
                        type="date"
                        value={formData.reminder.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, reminder: { ...formData.reminder!, endDate: e.target.value } })}
                        className="w-full bg-[#1B3A34]/5 border-none rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-0"
                      />
                    </motion.div>
                  )}

                  {formData.reminder.limitType === 'count' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-[#1B3A34] uppercase tracking-widest mb-2 ml-2">Número de avisos</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.reminder.occurrences || 1}
                        onChange={(e) => setFormData({ ...formData, reminder: { ...formData.reminder!, occurrences: e.target.value ? parseInt(e.target.value) : 1 } })}
                        className="w-full bg-[#1B3A34]/5 border-none rounded-2xl px-4 py-3 text-[#1B3A34] font-medium focus:ring-0"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div className="bg-[#E2F0D9] rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#2E7D6F] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#2E7D6F] font-medium">
                    Se enviará una notificación cada <span className="font-bold">{formData.reminder.frequency} {formData.reminder.unit}</span>
                    {formData.reminder.limitType === 'date' && formData.reminder.endDate ? ` hasta el ${formData.reminder.endDate}` : ''}
                    {formData.reminder.limitType === 'count' ? ` por un total de ${formData.reminder.occurrences} veces` : ''}
                    .
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B3A34] text-white py-5 rounded-full font-bold text-lg shadow-xl shadow-[#1B3A34]/20 hover:bg-[#1B3A34]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Icons.CheckCircle2 className="w-5 h-5" />
            Guardar Ficha Médica
          </button>

        </form>
      </div>
    </div>
  );
};

