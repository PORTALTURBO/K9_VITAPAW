import React, { useState, useEffect } from 'react';
import { SplashScreen, LockScreen } from './components/AuthScreens';
import { PetSelector } from './components/PetSelector';
import { Dashboard } from './components/Dashboard';
import { HistoryScreen } from './components/History';
import { CopilotScreen } from './components/Copilot';
import { EventForm } from './components/EventForm';
import { PetForm } from './components/PetForm';
import { SettingsScreen } from './components/Settings';
import { MedicationScreen } from './components/MedicationScreen';
import { Multimedia } from './components/Multimedia';
import { TopBar, BottomNav } from './components/Navigation';
import { ConfirmModal } from './components/ConfirmModal';
import { AIPromptModal } from './components/AIPromptModal';
import { AIDownloadProgress } from './components/AIDownloadProgress';
import { storageService } from './services/storageService';
import { Pet, MedicalEvent } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Info } from 'lucide-react';

type AppState = 'splash' | 'lock' | 'pet-selector' | 'main' | 'settings';
type MainTab = 'dashboard' | 'history' | 'multimedia' | 'copilot' | 'settings';

export default function App() {
  const [state, setState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  
  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MedicalEvent | undefined>();
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const [showMedications, setShowMedications] = useState(false);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // AI Prompt states
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [isDownloadingAI, setIsDownloadingAI] = useState(false);
  const [aiDownloadProgress, setAiDownloadProgress] = useState(0);
  const [showAIToast, setShowAIToast] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedPets = await storageService.getPets();
    const loadedEvents = await storageService.getEvents();
    setPets(loadedPets);
    setEvents(loadedEvents);
  };

  const handlePetSelect = async (pet: Pet) => {
    setSelectedPet(pet);
    setState('main');
    setActiveTab('dashboard');
    
    const settings = await storageService.getSettings();
    if (!settings.aiPromptShown) {
      setShowAIPrompt(true);
    }
  };

  const handleAcceptAI = async () => {
    setShowAIPrompt(false);
    setIsDownloadingAI(true);
    
    const settings = await storageService.getSettings();
    await storageService.saveSettings({ ...settings, aiPromptShown: true });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        clearInterval(interval);
        setAiDownloadProgress(100);
        setTimeout(async () => {
          setIsDownloadingAI(false);
          const currentSettings = await storageService.getSettings();
          await storageService.saveSettings({ ...currentSettings, aiDownloaded: true, aiProvider: 'gemma4b' });
        }, 1000);
      } else {
        setAiDownloadProgress(progress);
      }
    }, 500);
  };

  const handleDeclineAI = async () => {
    setShowAIPrompt(false);
    const settings = await storageService.getSettings();
    await storageService.saveSettings({ ...settings, aiPromptShown: true });
    setShowAIToast(true);
    setTimeout(() => setShowAIToast(false), 5000);
  };

  const handleSaveEvent = async (event: MedicalEvent) => {
    await storageService.saveEvent(event);
    await loadData();
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleDeleteEvent = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Evento',
      message: '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await storageService.deleteEvent(id);
        await loadData();
      }
    });
  };

  const handleSavePet = async (pet: Pet) => {
    await storageService.savePet(pet);
    await loadData();
    setShowPetForm(false);
    setEditingPet(undefined);
    if (selectedPet?.id === pet.id) {
      setSelectedPet(pet);
    }
  };

  const handleDeletePet = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Mascota',
      message: '¿Estás seguro de eliminar esta mascota y todo su historial? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await storageService.deletePet(id);
        await loadData();
        setShowPetForm(false);
        setEditingPet(undefined);
        if (selectedPet?.id === id) {
          setSelectedPet(null);
          setState('pet-selector');
        }
      }
    });
  };

  const renderMainContent = () => {
    if (!selectedPet) return null;

    const petEvents = events.filter(e => e.petId === selectedPet.id);

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            pet={selectedPet} 
            events={petEvents} 
            onAddEvent={() => {
              setEditingEvent(undefined);
              setShowEventForm(true);
            }}
            onEditPet={() => {
              setEditingPet(selectedPet);
              setShowPetForm(true);
            }}
            onOpenDoseCalculator={() => setShowMedications(true)}
          />
        );
      case 'history':
        return (
          <HistoryScreen 
            pet={selectedPet} 
            events={petEvents}
            onEditEvent={(e) => {
              setEditingEvent(e);
              setShowEventForm(true);
            }}
            onDeleteEvent={handleDeleteEvent}
            onAddEvent={() => {
              setEditingEvent(undefined);
              setShowEventForm(true);
            }}
          />
        );
      case 'multimedia':
        return <Multimedia pet={selectedPet} events={petEvents} />;
      case 'copilot':
        return <CopilotScreen pet={selectedPet} />;
      case 'settings':
        return (
          <SettingsScreen 
            onClose={() => setActiveTab('dashboard')}
            onChangePet={() => setState('pet-selector')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary/20 selection:text-secondary">
      <AnimatePresence mode="wait">
        {showAIToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[200] bg-surface rounded-2xl shadow-xl border border-outline-variant/20 p-4 flex items-center gap-3"
          >
            <div className="p-2 bg-primary/10 rounded-full">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-on-surface">
              Recuerda que cuando quieras puedes instalar la IA o configurar una desde los ajustes de la app.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setState('lock')} />
        )}
        
        {state === 'lock' && (
          <LockScreen key="lock" onUnlock={() => setState('pet-selector')} />
        )}

        {state === 'pet-selector' && (
          <div className="fixed inset-0 flex flex-col items-center bg-[#F9F6E8]">
            <motion.div 
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto relative flex flex-col shadow-2xl bg-[#F9F6E8] overflow-hidden"
            >
              <PetSelector 
                pets={pets} 
                events={events}
                onSelect={handlePetSelect}
                onAdd={() => {
                  setEditingPet(undefined);
                  setShowPetForm(true);
                }}
                onEdit={(pet) => {
                  setEditingPet(pet);
                  setShowPetForm(true);
                }}
                onOpenSettings={() => setState('settings')}
              />
            </motion.div>
          </div>
        )}

        {state === 'settings' && (
          <div className="fixed inset-0 flex flex-col items-center bg-[#F9F6E8]">
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full h-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto relative flex flex-col shadow-2xl bg-[#F9F6E8] overflow-hidden"
            >
              <SettingsScreen 
                onClose={() => setState('pet-selector')} 
              />
            </motion.div>
          </div>
        )}

        {state === 'main' && selectedPet && (
          <div className="fixed inset-0 flex flex-col items-center bg-surface">
            <motion.div 
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto relative flex flex-col shadow-2xl bg-surface"
            >
              <TopBar 
                title={activeTab === 'dashboard' ? selectedPet.name : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
                onBack={() => {
                  if (activeTab !== 'dashboard') {
                    setActiveTab('dashboard');
                  } else {
                    setState('pet-selector');
                  }
                }}
                rightElement={
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/20">
                    <img 
                      src={selectedPet.photo || `https://picsum.photos/seed/${selectedPet.name}/100/100`} 
                      alt={selectedPet.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                }
              />
              
              <main className="flex-1 overflow-y-auto w-full pb-24 pt-16">
                {renderMainContent()}
              </main>

              {/* FABs */}
              {activeTab === 'dashboard' && (
                <button 
                  onClick={() => {
                    setEditingEvent(undefined);
                    setShowEventForm(true);
                  }}
                  className="absolute bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-40"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              {activeTab === 'history' && (
                <button 
                  onClick={() => {
                    setEditingEvent(undefined);
                    setShowEventForm(true);
                  }}
                  className="absolute bottom-24 right-6 w-16 h-16 bg-[#03241f] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}

              <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as MainTab)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEventForm && selectedPet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120]"
          >
            <EventForm 
              pet={selectedPet} 
              event={editingEvent}
              onSave={handleSaveEvent}
              onClose={() => {
                setShowEventForm(false);
                setEditingEvent(undefined);
              }}
            />
          </motion.div>
        )}

        {showPetForm && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120]"
          >
            <PetForm 
              pet={editingPet}
              onSave={handleSavePet}
              onDelete={handleDeletePet}
              onClose={() => {
                setShowPetForm(false);
                setEditingPet(undefined);
              }}
            />
          </motion.div>
        )}

        {showMedications && selectedPet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120]"
          >
            <MedicationScreen 
              pet={selectedPet}
              onClose={() => setShowMedications(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <AnimatePresence>
        {showAIPrompt && (
          <AIPromptModal 
            onAccept={handleAcceptAI}
            onDecline={handleDeclineAI}
          />
        )}
        {isDownloadingAI && (
          <AIDownloadProgress progress={aiDownloadProgress} />
        )}
      </AnimatePresence>
    </div>
  );
}


