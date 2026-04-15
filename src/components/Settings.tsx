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
import { TagsManager } from './TagsManager';
import { AnimatePresence, motion } from 'motion/react';

interface SettingsProps {
  onChangePet: () => void;
  onOpenDoseCalculator?: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ onChangePet, onOpenDoseCalculator }) => {
  const [showTagsManager, setShowTagsManager] = useState(false);

  return (
    <div className="min-h-screen pt-20 px-6 pb-32">
      <h1 className="text-3xl font-black font-headline text-primary mb-8 tracking-tight">Ajustes</h1>
      
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
              <div className="w-12 h-6 bg-secondary rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-6"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Conexión IA */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Conexión IA</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="w-full p-5 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 bg-surface-container-low rounded-xl flex-shrink-0">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm mb-1">URL del servidor</p>
                  <input type="text" value="https://api.gemini.google.com" readOnly className="w-full text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border-none focus:ring-0" />
                </div>
              </div>
            </div>
            <button className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Modelo IA</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">gemini-2.0-flash</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
            <button className="w-full p-5 text-center hover:bg-surface-container-lowest transition-colors">
              <span className="font-bold text-secondary text-sm">Probar conexión</span>
            </button>
          </div>
        </section>

        {/* Herramientas Clínicas */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Herramientas Clínicas</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <button 
              onClick={onOpenDoseCalculator}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                  <span className="text-xl leading-none">💊</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Calculadora de Dosis</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
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
          onClick={onChangePet}
          className="w-full bg-surface-container-low p-5 rounded-3xl border border-outline-variant/20 text-center font-bold text-primary hover:bg-surface-container-high transition-colors"
        >
          Cambiar Mascota
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
