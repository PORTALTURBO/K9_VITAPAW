import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { CustomCategory, CustomStatus } from '../types';
import { storageService } from '../services/storageService';
import * as Icons from 'lucide-react';

interface TagsManagerProps {
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  'Activity', 'AlertTriangle', 'Heart', 'Pill', 'Stethoscope', 'Syringe', 'Thermometer', 'Utensils',
  'Bone', 'Dog', 'Cat', 'Scissors', 'Bath', 'Brush', 'Droplet', 'Sun', 'Moon', 'Cloud', 'Wind',
  'Zap', 'Shield', 'ShieldAlert', 'ShieldCheck', 'Crosshair', 'Target', 'Flag', 'Star', 'Award',
  'Smile', 'Frown', 'Meh', 'Coffee', 'Apple', 'Carrot', 'Fish', 'Bird', 'Bug', 'Camera', 'Video',
  'Music', 'Bell', 'Calendar', 'Clock', 'FileText', 'Folder', 'Home', 'MapPin', 'Navigation',
  'BriefcaseMedical', 'Sparkles', 'Brain', 'Eye', 'Ear', 'Footprints'
];

const PRESET_COLORS = [
  { color: '#B22222', bgColor: '#FFD6D6' }, // Red
  { color: '#1B3A34', bgColor: '#A6E8D7' }, // Teal
  { color: '#B25A00', bgColor: '#FFDDB8' }, // Orange
  { color: '#4A148C', bgColor: '#E1BEE7' }, // Purple
  { color: '#0D47A1', bgColor: '#BBDEFB' }, // Blue
  { color: '#1B5E20', bgColor: '#C8E6C9' }, // Green
  { color: '#E65100', bgColor: '#FFE0B2' }, // Deep Orange
  { color: '#3E2723', bgColor: '#D7CCC8' }, // Brown
  { color: '#263238', bgColor: '#CFD8DC' }, // Blue Grey
  { color: '#880E4F', bgColor: '#F8BBD0' }, // Pink
];

export const TagsManager: React.FC<TagsManagerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'statuses'>('categories');
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [statuses, setStatuses] = useState<CustomStatus[]>([]);
  
  React.useEffect(() => {
    const loadData = async () => {
      setCategories(await storageService.getCategories());
      setStatuses(await storageService.getStatuses());
    };
    loadData();
  }, []);

  const [showForm, setShowForm] = useState(false);
  
  // Category Form State
  const [catLabel, setCatLabel] = useState('');
  const [catIcon, setCatIcon] = useState(AVAILABLE_ICONS[0]);
  const [catColorIdx, setCatColorIdx] = useState(0);

  // Status Form State
  const [statLabel, setStatLabel] = useState('');
  const [statColorIdx, setStatColorIdx] = useState(0);

  const handleSaveCategory = async () => {
    if (!catLabel) return;
    const newCat: CustomCategory = {
      id: `cat_${Date.now()}`,
      label: catLabel,
      icon: catIcon,
      color: PRESET_COLORS[catColorIdx].color,
      bgColor: PRESET_COLORS[catColorIdx].bgColor,
    };
    await storageService.saveCategory(newCat);
    setCategories(await storageService.getCategories());
    setShowForm(false);
    setCatLabel('');
  };

  const handleDeleteCategory = async (id: string) => {
    await storageService.deleteCategory(id);
    setCategories(await storageService.getCategories());
  };

  const handleSaveStatus = async () => {
    if (!statLabel) return;
    const newStat: CustomStatus = {
      id: `stat_${Date.now()}`,
      label: statLabel.toUpperCase(),
      color: PRESET_COLORS[statColorIdx].color,
      bgColor: PRESET_COLORS[statColorIdx].bgColor,
    };
    await storageService.saveStatus(newStat);
    setStatuses(await storageService.getStatuses());
    setShowForm(false);
    setStatLabel('');
  };

  const handleDeleteStatus = async (id: string) => {
    await storageService.deleteStatus(id);
    setStatuses(await storageService.getStatuses());
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#F9F6E8] flex flex-col">
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm z-10 border-b border-black/5">
        <h2 className="text-xl font-black text-gray-900">Gestor de Etiquetas</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      <div className="flex px-6 pt-4 gap-4 bg-white border-b border-black/5">
        <button
          onClick={() => { setActiveTab('categories'); setShowForm(false); }}
          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'categories' ? 'border-[#03241f] text-[#03241f]' : 'border-transparent text-gray-400'
          }`}
        >
          Categorías
        </button>
        <button
          onClick={() => { setActiveTab('statuses'); setShowForm(false); }}
          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'statuses' ? 'border-[#03241f] text-[#03241f]' : 'border-transparent text-gray-400'
          }`}
        >
          Estados
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!showForm ? (
          <div className="space-y-4">
            {activeTab === 'categories' ? (
              <>
                {categories.map(cat => {
                  // @ts-ignore
                  const Icon = Icons[cat.icon] || Icons.HelpCircle;
                  return (
                    <div key={cat.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.bgColor }}>
                          <Icon className="w-6 h-6" style={{ color: cat.color }} />
                        </div>
                        <span className="font-bold text-gray-900">{cat.label}</span>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {statuses.map(stat => (
                  <div key={stat.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-black/5">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{ backgroundColor: stat.bgColor }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                      <span className="font-bold text-xs tracking-wider" style={{ color: stat.color }}>{stat.label}</span>
                    </div>
                    <button onClick={() => handleDeleteStatus(stat.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </>
            )}

            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-[#03241f] hover:border-[#03241f] transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Añadir {activeTab === 'categories' ? 'Categoría' : 'Estado'}
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-6">
            <h3 className="font-black text-lg text-gray-900">
              Nueva {activeTab === 'categories' ? 'Categoría' : 'Estado'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
              <input
                type="text"
                value={activeTab === 'categories' ? catLabel : statLabel}
                onChange={(e) => activeTab === 'categories' ? setCatLabel(e.target.value) : setStatLabel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:border-[#03241f] focus:ring-1 focus:ring-[#03241f] transition-colors"
                placeholder={activeTab === 'categories' ? "Ej. Vacunas" : "Ej. PENDIENTE"}
              />
            </div>

            {activeTab === 'categories' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Icono</label>
                <div className="grid grid-cols-6 gap-2 h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {AVAILABLE_ICONS.map(iconName => {
                    // @ts-ignore
                    const Icon = Icons[iconName];
                    if (!Icon) return null;
                    const isSelected = catIcon === iconName;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setCatIcon(iconName)}
                        className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#03241f] text-white shadow-md scale-110' : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Color</label>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((colorSet, idx) => {
                  const isSelected = activeTab === 'categories' ? catColorIdx === idx : statColorIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => activeTab === 'categories' ? setCatColorIdx(idx) : setStatColorIdx(idx)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      style={{ backgroundColor: colorSet.color }}
                    >
                      {isSelected && <Check className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={activeTab === 'categories' ? handleSaveCategory : handleSaveStatus}
                className="flex-1 py-3 font-bold text-white bg-[#03241f] rounded-xl hover:bg-[#03241f]/90 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
