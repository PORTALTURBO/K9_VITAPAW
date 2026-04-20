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
import { DigitalReportScreen } from './components/DigitalReportScreen';
import { EventDetailsScreen } from './components/EventDetailsScreen';
import { WellnessModal } from './components/WellnessModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Multimedia } from './components/Multimedia';
import { ThemeStudio } from './components/ThemeStudio';
import { TopBar, BottomNav } from './components/Navigation';
import { ConfirmModal } from './components/ConfirmModal';
import { AIPromptModal } from './components/AIPromptModal';
import { AIDownloadProgress } from './components/AIDownloadProgress';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { Pet, MedicalEvent } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Info, Bell } from 'lucide-react';

type AppState = 'splash' | 'lock' | 'pet-selector' | 'main' | 'settings';
type MainTab = 'dashboard' | 'history' | 'multimedia' | 'copilot' | 'settings' | 'studio';

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
  const [showDigitalReport, setShowDigitalReport] = useState(false);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<MedicalEvent | null>(null);

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
  const [notificationToast, setNotificationToast] = useState<{title: string, body: string} | null>(null);

  // Background notification engine
  useEffect(() => {
    notificationService.setFallback((title: string, body: string) => {
      setNotificationToast({ title, body });
      setTimeout(() => setNotificationToast(null), 8000);
    });

    notificationService.startPolling(
      () => events, // provide latest events
      () => pets    // provide latest pets
    );

    return () => notificationService.stopPolling();
  }, [events, pets]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    storageService.getSettings().then(settings => {
      if (settings?.theme) {
        if (settings.theme.startsWith('custom_')) {
          document.documentElement.setAttribute('data-theme', 'custom');
          const customTheme = settings.customThemes?.find((t: any) => t.id === settings.theme);
          if (customTheme) {
            Object.entries(customTheme.cssVariables).forEach(([key, value]) => {
               document.documentElement.style.setProperty(key, value as string);
            });
            
            if (customTheme.fontFamily) {
               const fontUrl = `https://fonts.googleapis.com/css2?family=${customTheme.fontFamily.replace(/ /g, '+')}:wght@400;500;700&display=swap`;
               let link = document.getElementById('dynamic-font') as HTMLLinkElement;
               if (!link) {
                 link = document.createElement('link');
                 link.id = 'dynamic-font';
                 link.rel = 'stylesheet';
                 document.head.appendChild(link);
               }
               link.href = fontUrl;
               document.documentElement.style.setProperty('--font-custom', `"${customTheme.fontFamily}", sans-serif`);
               document.body.style.fontFamily = `"${customTheme.fontFamily}", sans-serif`;
            }

            if (customTheme.backgroundImage) {
               document.body.style.backgroundImage = `url(${customTheme.backgroundImage})`;
               document.body.style.backgroundSize = 'cover';
               document.body.style.backgroundPosition = 'center';
               document.body.style.backgroundAttachment = 'fixed';
            } else {
               document.body.style.backgroundImage = '';
            }
          }
        } else {
          document.documentElement.removeAttribute('style'); // Clear custom styles
          document.body.style.fontFamily = '';
          document.body.style.backgroundImage = '';
          document.documentElement.setAttribute('data-theme', settings.theme);
        }
      }
    });
  }, [state, activeTab]); // Refresh on navigation

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
            onOpenDigitalReport={() => setShowDigitalReport(true)}
            onOpenWellness={() => setShowWellnessModal(true)}
            onEventClick={(action) => {
              if (action === 'copilot-trigger') {
                 setShowAIPrompt(true);
              }
            }}
          />
        );
      case 'history':
        return (
          <HistoryScreen 
            pet={selectedPet} 
            events={petEvents}
            onEditEvent={(e) => {
              setSelectedEventDetails(e);
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
      case 'studio':
        return <ThemeStudio />;
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
    <div className="h-full w-full bg-surface selection:bg-secondary/20 selection:text-secondary relative overflow-hidden">
      <AnimatePresence mode="wait">
        {notificationToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[250] bg-white rounded-2xl shadow-2xl border-l-4 border-[#146a5d] p-4 flex items-center gap-3 cursor-pointer"
            onClick={() => setNotificationToast(null)}
          >
            <div className="p-2 bg-[#146a5d]/10 rounded-full flex-shrink-0">
              <Bell className="w-5 h-5 text-[#146a5d]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#03241f]">{notificationToast.title}</p>
              <p className="text-xs text-gray-600 mt-0.5">{notificationToast.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="w-full h-full relative flex flex-col bg-[#F9F6E8]"
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
              className="w-full h-full relative flex flex-col bg-[#F9F6E8]"
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
              className="w-full h-full relative flex flex-col shadow-none bg-surface overflow-x-hidden"
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
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowNotifications(true)} className="relative p-2 bg-surface-container-low rounded-full active:scale-90 transition-transform">
                      <Bell className="w-5 h-5 text-primary" />
                      {events.filter(e => e.status === 'active' && new Date(`${e.date}T${e.time || '00:00'}`) < new Date()).length > 0 && (
                        <span className="absolute 0 top-0 right-0 w-3 h-3 bg-error rounded-full outline outline-2 outline-surface"></span>
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/20">
                      <img 
                        src={selectedPet.photo || `https://picsum.photos/seed/${selectedPet.name}/100/100`} 
                        alt={selectedPet.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
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

        {showDigitalReport && selectedPet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120]"
          >
            <DigitalReportScreen 
              pet={selectedPet}
              events={events.filter(e => e.petId === selectedPet.id)}
              onClose={() => setShowDigitalReport(false)}
            />
          </motion.div>
        )}

        {showWellnessModal && selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150]"
          >
            <WellnessModal 
              pet={selectedPet}
              events={events.filter(e => e.petId === selectedPet.id)}
              onClose={() => setShowWellnessModal(false)}
              onSavePet={handleSavePet}
            />
          </motion.div>
        )}

        {showNotifications && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[160]"
          >
            <NotificationCenter 
              events={events}
              pets={pets}
              onClose={() => setShowNotifications(false)}
              onNavigateToEvent={(id) => {
                const event = events.find(e => e.id === id);
                if (event) {
                  setSelectedEventDetails(event);
                  setShowNotifications(false);
                }
              }}
            />
          </motion.div>
        )}

        {selectedEventDetails && selectedPet && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120]"
          >
            <EventDetailsScreen 
              event={selectedEventDetails}
              pet={selectedPet}
              onClose={() => setSelectedEventDetails(null)}
              onEdit={() => {
                setEditingEvent(selectedEventDetails);
                setSelectedEventDetails(null);
                setShowEventForm(true);
              }}
              onDelete={() => {
                handleDeleteEvent(selectedEventDetails.id);
                setSelectedEventDetails(null);
              }}
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


