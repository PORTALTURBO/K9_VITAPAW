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
  Tags,
  Download,
  Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { TagsManager } from './TagsManager';
import { AnimatePresence, motion } from 'motion/react';

interface SettingsProps {
  onClose: () => void;
  onChangePet?: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ onClose, onChangePet }) => {
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [settings, setSettings] = useState<any>({ 
    biometricEnabled: false, 
    aiProvider: 'gemma4b',
    theme: 'clinical',
    notifications: { enabled: false, sound: true, vibration: true, advanceMinutes: 15 }
  });

  React.useEffect(() => {
    storageService.getSettings().then(s => setSettings(s));
  }, []);

  const updateSetting = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await storageService.saveSettings(newSettings);
  };

  const updateNotificationSetting = async (key: string, value: any) => {
    const newSettings = { 
      ...settings, 
      notifications: { ...settings.notifications, [key]: value } 
    };
    setSettings(newSettings);
    await storageService.saveSettings(newSettings);
  };

  const handleToggleBiometric = () => updateSetting('biometricEnabled', !settings.biometricEnabled);
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => updateSetting('aiProvider', e.target.value);

  return (
    <div className="h-full overflow-y-auto pt-20 px-6 pb-32 bg-[#F9F6E8]">
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

        {/* Seguridad y Notificaciones */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Seguridad y Alertas</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="w-full p-5 flex items-center justify-between border-b border-outline-variant/10">
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

            <div className="w-full p-5 flex flex-col gap-4 border-b border-outline-variant/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-surface-container-low rounded-xl">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary text-sm">Alertas y Avisos</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Permisos del navegador</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    const granted = await notificationService.requestPermission();
                    if (granted) {
                      updateNotificationSetting('enabled', true);
                      notificationService.sendNotification('¡Notificaciones Activadas!', {
                        body: 'K9 VitalPaw te enviará recordatorios médicos importantes.',
                      });
                    } else {
                      updateNotificationSetting('enabled', true);
                      notificationService.sendNotification('Aviso', {
                        body: 'Las notificaciones nativas están bloqueadas. Se usarán notificaciones internas de la app.',
                      });
                    }
                  }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full font-bold transition-colors",
                    settings.notifications?.enabled ? "bg-secondary text-white" : "bg-primary text-white"
                  )}
                >
                  {settings.notifications?.enabled ? 'Activado' : 'Activar'}
                </button>
              </div>

              {settings.notifications?.enabled && (
                <div className="pl-12 flex flex-col gap-3 mt-2 border-t border-outline-variant/10 pt-4">
                  
                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary text-opacity-80">Sonido de Notificación</span>
                    <div 
                      onClick={() => updateNotificationSetting('sound', !settings.notifications.sound)}
                      className={cn(
                        "w-10 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors",
                        settings.notifications.sound ? "bg-secondary" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                        settings.notifications.sound ? "translate-x-5" : "translate-x-0"
                      )}></div>
                    </div>
                  </div>

                  {/* Vibration Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary text-opacity-80">Vibración</span>
                    <div 
                      onClick={() => updateNotificationSetting('vibration', !settings.notifications.vibration)}
                      className={cn(
                        "w-10 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors",
                        settings.notifications.vibration ? "bg-secondary" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                        settings.notifications.vibration ? "translate-x-5" : "translate-x-0"
                      )}></div>
                    </div>
                  </div>

                  {/* Advance Time Select */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary text-opacity-80">Recordatorio Previo Adicional</span>
                    <select
                      value={settings.notifications.advanceMinutes}
                      onChange={(e) => updateNotificationSetting('advanceMinutes', Number(e.target.value))}
                      className="text-sm font-bold bg-surface-container-low text-primary rounded-lg px-2 py-1 outline-none border border-outline-variant/20"
                    >
                      <option value={0}>Solo al momento exacto (0 min)</option>
                      <option value={15}>Avisar 15 minutos antes</option>
                      <option value={60}>Avisar 1 hora antes</option>
                      <option value={1440}>Avisar 1 día antes</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                notificationService.sendNotification('Prueba de Sistema', {
                  body: 'Esta es una prueba de los recordatorios de K9 VitalPaw.'
                });
              }}
              className="w-full p-5 flex items-center justify-between border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-transparent rounded-xl">
                  <div className="w-5 h-5"></div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Enviar Notificación de Prueba</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Test Inmediato</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>

            <button 
              onClick={() => {
                notificationService.clearHistory();
                notificationService.sendNotification('Caché Limpiado', {
                  body: 'El historial de envíos se ha borrado.'
                });
              }}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-transparent rounded-xl">
                  <div className="w-5 h-5"></div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary text-sm">Limpiar Historial de Alertas</p>
                  <p className="text-[10px] font-bold text-error uppercase tracking-widest mt-0.5">Para volver a probar alarmas pasadas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>
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
