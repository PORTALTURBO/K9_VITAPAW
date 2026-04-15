import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Activity, Search, BriefcaseMedical, Utensils, Heart, AlertCircle, Settings } from 'lucide-react';
import { Pet, MedicalEvent, OwnerProfile, CustomCategory } from '../types';
import { storageService } from '../services/storageService';
import { OwnerProfileForm } from './OwnerProfileForm';
import * as Icons from 'lucide-react';

interface PetSelectorProps {
  pets: Pet[];
  events: MedicalEvent[];
  onSelect: (pet: Pet) => void;
  onAdd: () => void;
  onEdit: (pet: Pet) => void;
  onOpenSettings: () => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ pets, events, onSelect, onAdd, onEdit, onOpenSettings }) => {
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>({ name: 'Dueño', photo: '' });
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<MedicalEvent[]>([]);
  const [categories, setCategories] = useState<CustomCategory[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const profile = await storageService.getOwnerProfile();
      setOwnerProfile(profile);
      const cats = await storageService.getCategories();
      setCategories(cats);
    };
    loadData();
  }, []);

  useEffect(() => {
    // Get all events and sort by date to find upcoming ones
    const futureEvents = events
      .filter(e => e.status === 'active' || new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3); // Get top 3 upcoming
    setUpcomingEvents(futureEvents);
  }, [events]);

  const getActiveEventsCount = (petId: string) => {
    return events.filter(e => e.petId === petId && e.status === 'active').length;
  };

  const calculateAge = (birthDate: string) => {
    const diff = new Date().getTime() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSaveOwnerProfile = async (profile: OwnerProfile) => {
    await storageService.saveOwnerProfile(profile);
    setOwnerProfile(profile);
    setShowOwnerForm(false);
  };

  const getCategory = (id: string) => categories.find(c => c.id === id) || categories[0];

  return (
    <div className="h-full overflow-y-auto bg-[#F9F6E8] flex flex-col relative pb-32">
      {/* Top App Bar */}
      <div className="bg-[#2E7D6F] pt-12 pb-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">K9 VitalPaw</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowOwnerForm(true)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/60 transition-colors"
          >
            <img src={ownerProfile.photo || "https://i.pravatar.cc/150?img=11"} alt={ownerProfile.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <header className="bg-gradient-to-b from-[#2E7D6F] to-[#1B3A34] pt-6 pb-20 px-8 rounded-b-[3rem] z-10 relative">
        <h2 className="text-4xl font-black font-headline text-white tracking-tight mb-2">Hola, {ownerProfile.name.split(' ')[0]}</h2>
        <p className="text-white/80 text-lg">Selecciona a tu compañero</p>
      </header>

      {/* Search Bar (Overlapping) */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-[#F3EFE0] rounded-full p-4 flex items-center gap-3 shadow-sm border border-black/5">
          <Search className="w-5 h-5 text-black/40 ml-2" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o raza..."
            className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-black/40 text-black font-medium"
          />
        </div>
      </div>

      <div className="mt-8 relative z-20">
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 pt-10 text-center">
            <div className="w-48 h-48 mb-8 relative">
              <div className="absolute inset-0 bg-[#1B3A34]/5 rounded-full animate-pulse"></div>
              <img src="https://assets10.lottiefiles.com/packages/lf20_syqnfe7c.json" alt="Dog Animation" className="w-full h-full object-contain opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center text-[#1B3A34]/20">
                <Activity className="w-24 h-24" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#1B3A34] mb-3">¡Registra a tu primer compañero!</h2>
            <button 
              onClick={onAdd}
              className="bg-[#1B3A34] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#1B3A34]/30 hover:scale-105 transition-transform"
            >
              Agregar Perro
            </button>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory px-6 pb-8 gap-6 no-scrollbar items-center">
            {pets.map((pet, index) => {
              const activeCount = getActiveEventsCount(pet.id);
              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[75vw] max-w-xs"
                >
                  <div 
                    onClick={() => onSelect(pet)}
                    className="bg-white rounded-[3rem] p-6 shadow-xl shadow-black/5 relative cursor-pointer group hover:shadow-2xl transition-all"
                  >
                    {/* Edit Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(pet); }}
                      className="absolute top-6 left-6 w-10 h-10 bg-[#A6E8D7] rounded-full flex items-center justify-center text-[#1B3A34] hover:bg-[#8CDAC5] transition-colors z-10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Badge */}
                    {activeCount > 0 && (
                      <div className="absolute top-6 right-6 bg-[#B22222] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-20 shadow-md">
                        {activeCount}
                      </div>
                    )}

                    <div className="flex flex-col items-center text-center mt-4">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-[#1B3A34] shadow-lg relative z-10 bg-surface-container-low">
                          <img 
                            src={pet.photo || `https://picsum.photos/seed/${pet.name}/200/200`} 
                            alt={pet.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <h2 className="text-3xl font-black text-[#1B3A34] mb-1">{pet.name}</h2>
                      <p className="text-gray-500 font-medium mb-4 text-sm tracking-wider uppercase">{pet.breed}</p>
                      
                      <div className="bg-[#E2F0D9] px-5 py-1.5 rounded-full">
                        <span className="text-sm font-bold text-[#2E7D6F]">{calculateAge(pet.birthDate)} años</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      {pets.length > 0 && (
        <section className="px-8 mt-4">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-[#1B3A34]">Próximos Eventos</h3>
            {upcomingEvents.length > 0 && (
              <button className="text-[#2E7D6F] font-bold text-sm hover:underline">Ver todos</button>
            )}
          </div>

          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm bg-white/50 rounded-[2rem] border border-black/5">
                No hay eventos próximos.
              </div>
            ) : (
              upcomingEvents.map(event => {
                const category = getCategory(event.category);
                // @ts-ignore
                const Icon = Icons[category.icon] || Icons.HelpCircle;
                const pet = pets.find(p => p.id === event.petId);
                
                return (
                  <div key={event.id} className="bg-[#F3EFE0] rounded-[2rem] p-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: category.bgColor }}>
                      <Icon className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#1B3A34] font-bold text-lg truncate">{event.title} {pet ? `- ${pet.name}` : ''}</h4>
                      <p className="text-gray-600 text-sm">{event.date} {event.time ? `, ${event.time}` : ''}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* FAB */}
      {pets.length > 0 && (
        <div className="sticky bottom-12 right-8 self-end mr-8 mt-auto z-50">
          <button 
            onClick={onAdd}
            className="w-16 h-16 bg-[#1B3A34] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Owner Profile Modal */}
      {showOwnerForm && (
        <OwnerProfileForm 
          profile={ownerProfile} 
          onSave={handleSaveOwnerProfile} 
          onClose={() => setShowOwnerForm(false)} 
        />
      )}
    </div>
  );
};

