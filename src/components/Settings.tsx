import React, { useState } from 'react';
import { 
  Palette, 
  Wand2, 
  Fingerprint, 
  Server, 
  Brain, 
  FileText, 
  Table, 
  CloudUpload, 
  Info,
  ChevronRight,
  Tags
} from 'lucide-react';
import { cn } from '../lib/utils';
import { storageService } from '../services/storageService';
import { TagsManager } from './TagsManager';
import { AnimatePresence, motion } from 'motion/react';

interface SettingsProps {
  onClose: () => void;
  onChangePet?: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ onClose, onChangePet }) => {
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [settings, setSettings] = useState({ biometricEnabled: false, aiProvider: 'gemma4b' });

  React.useEffect(() => {
    storageService.getSettings().then(setSettings);
  }, []);

  const handleToggleBiometric = async () => {
    const newSettings = { ...settings, biometricEnabled: !settings.biometricEnabled };
    setSettings(newSettings);
    await storageService.saveSettings(newSettings);
  };

  const handleProviderChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSettings = { ...settings, aiProvider: e.target.value };
    setSettings(newSettings);
    await storageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-32 bg-[#F9F6E8] overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onClose}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-[#1B3A34]" />
        </button>
        <h1 className="text-3xl font-black font-headline text-primary tracking-tight">Ajustes</h1>
      </div>
      
      <div className="space-y-8">
        {/* Apariencia */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Apariencia</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Tema de la App</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Clinical Sanctuary</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Wand2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Theme Builder Studio</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
          </div>
        </section>

        {/* Personalización */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Personalización</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowTagsManager(true)}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Tags className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Gestor de Etiquetas</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Categorías y Estados</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
          </div>
        </section>

        {/* Seguridad */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Seguridad</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="w-full p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Fingerprint className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Bloqueo Biométrico</p>
                </div>
              </div>
              <div 
                onClick={handleToggleBiometric}
                className={cn(
                  "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                  settings.biometricEnabled ? "bg-secondary" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                  settings.biometricEnabled ? "translate-x-6" : "translate-x-0"
                )}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Conexión IA */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Inteligencia Artificial</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="w-full p-5 flex flex-col gap-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-primary text-sm">Modelo IA Activo</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
                    {settings.aiProvider === 'gemma4b' ? 'Gemma 4 E2B (Local)' : 'Groq (Cloud)'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={async () => {
                    const newSettings = { ...settings, aiProvider: 'gemma4b' };
                    await storageService.saveSettings(newSettings);
                    setSettings(newSettings);
                  }}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors",
                    settings.aiProvider === 'gemma4b' 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-surface border-outline-variant/20 text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  <div>
                    <p className="font-bold text-sm">Gemma 4 E2B</p>
                    <p className="text-xs opacity-80">IA Local, sin conexión a internet</p>
                  </div>
                  {settings.aiProvider === 'gemma4b' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </button>
                
                <button 
                  onClick={async () => {
                    const newSettings = { ...settings, aiProvider: 'groq' };
                    await storageService.saveSettings(newSettings);
                    setSettings(newSettings);
                  }}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors",
                    settings.aiProvider === 'groq' 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-surface border-outline-variant/20 text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  <div>
                    <p className="font-bold text-sm">Groq (Llama 3)</p>
                    <p className="text-xs opacity-80">IA en la nube, ultra rápida</p>
                  </div>
                  {settings.aiProvider === 'groq' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </button>
              </div>
            </div>
            
            {settings.aiProvider === 'groq' && (
              <div className="w-full p-5 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-2 bg-surface-container-low rounded-xl flex-shrink-0">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-primary text-sm mb-1">API Key (Opcional)</p>
                    <input 
                      type="password" 
                      placeholder="gsk_..." 
                      className="w-full text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            <button className="w-full p-5 text-center hover:bg-surface-container-lowest transition-colors">
              <span className="font-bold text-secondary text-sm">Probar conexión IA</span>
            </button>
          </div>
        </section>

        {/* Datos */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Datos</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Exportar a PDF</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Table className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Exportar a CSV</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <CloudUpload className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Backup JSON</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
          </div>
        </section>

        {/* Info */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Info</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Acerca de K9 VitalPaw</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Versión 1.0.0</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
          </div>
        </section>

        <button 
          onClick={onChangePet || onClose}
          className="w-full bg-surface-container-low p-5 rounded-3xl border border-outline-variant/20 text-center font-bold text-primary hover:bg-surface-container-high transition-colors"
        >
          {onChangePet ? 'Cambiar Mascota' : 'Volver'}
        </button>
      </div>

      <AnimatePresence>
        {showTagsManager && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[150]"
          >
            <TagsManager onClose={() => setShowTagsManager(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
