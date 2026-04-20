import React, { useState, useEffect, useRef } from 'react';
import { Palette, Upload, Plus, Check, Moon, Sun, Monitor, Download, RefreshCw, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { AppSettings, CustomThemeData } from '../types';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeStudio: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeThemeMode, setActiveThemeMode] = useState<'light' | 'dark' | 'oled'>('light');
  const [activeRadius, setActiveRadius] = useState<number>(16);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editingTheme, setEditingTheme] = useState<Partial<CustomThemeData>>({
    id: `custom_${Date.now()}`,
    name: 'Clinical Priority',
    cssVariables: {
      '--color-primary': '#03241F',
      '--color-secondary': '#146A5D',
      '--color-surface': '#F4F5E7',
      '--color-on-surface': '#1B1D0E',
      '--color-accent': '#BA1A1A'
    },
    borderRadius: '16px',
    baseTheme: 'light'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await storageService.getSettings();
    setSettings(s);
  };

  const saveSettings = async (newSettings: AppSettings) => {
    await storageService.saveSettings(newSettings);
    setSettings(newSettings);
    applyTheme(newSettings.theme, newSettings);
  };

  const applyTheme = (themeId: string, currentSettings: AppSettings) => {
    const root = document.documentElement;
    if (themeId === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.style.cssText = ''; 
    } else if (themeId === 'soft') {
      root.setAttribute('data-theme', 'soft');
      root.style.cssText = '';
    } else if (themeId.startsWith('custom_')) {
      const customTheme = currentSettings.customThemes?.find(t => t.id === themeId);
      if (customTheme) {
        root.setAttribute('data-theme', customTheme.baseTheme || 'light');
        let cssText = '';
        for (const [key, value] of Object.entries(customTheme.cssVariables)) {
          cssText += `${key}: ${value}; `;
        }
        if (customTheme.backgroundImage) {
          document.body.style.backgroundImage = `url(${customTheme.backgroundImage})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundAttachment = 'fixed';
        } else {
          document.body.style.backgroundImage = 'none';
        }
        
        if (customTheme.borderRadius) {
          cssText += `--radius: ${customTheme.borderRadius};`;
        }

        root.style.cssText = cssText;

        // Apply font
        if (customTheme.fontFamily) {
          let link = document.getElementById('custom-google-font') as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.id = 'custom-google-font';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
          }
          link.href = `https://fonts.googleapis.com/css2?family=${customTheme.fontFamily.replace(/ /g, '+')}:wght@400;500;700;900&display=swap`;
          document.body.style.fontFamily = `"${customTheme.fontFamily}", sans-serif`;
        }
      }
    } else {
      root.removeAttribute('data-theme');
      root.style.cssText = '';
      document.body.style.backgroundImage = 'none';
      document.body.style.fontFamily = '';
    }
  };

  const handleColorChange = (key: string, value: string) => {
    setEditingTheme(prev => ({
      ...prev,
      cssVariables: {
        ...prev.cssVariables!,
        [key]: value
      }
    }));
  };

  const handleCreateTheme = async () => {
    if (!settings) return;
    const existingThemes = settings.customThemes || [];
    
    // Create new theme object
    const newTheme: CustomThemeData = {
      ...(editingTheme as CustomThemeData),
      borderRadius: `${activeRadius}px`,
      baseTheme: activeThemeMode
    };

    const existingIndex = existingThemes.findIndex(t => t.id === editingTheme.id);
    let updatedThemes;
    
    if (existingIndex >= 0) {
      updatedThemes = [...existingThemes];
      updatedThemes[existingIndex] = newTheme;
    } else {
      updatedThemes = [...existingThemes, newTheme];
    }
    
    const newSettings = { ...settings, theme: newTheme.id, customThemes: updatedThemes };
    await saveSettings(newSettings);
    alert('Tema Guardado y Aplicado!');
  };

  const handleGenerate = () => {
    // Export theme JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      ...editingTheme,
      borderRadius: `${activeRadius}px`,
      baseTheme: activeThemeMode
    }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `K9_Theme_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        if (importedTheme && importedTheme.cssVariables) {
          setEditingTheme({
            ...importedTheme,
            id: `custom_${Date.now()}` // assign new ID to imported theme
          });
          if(importedTheme.borderRadius) {
             setActiveRadius(parseInt(importedTheme.borderRadius));
          }
          if(importedTheme.baseTheme) {
             setActiveThemeMode(importedTheme.baseTheme);
          }
        } else {
          alert('Archivo de tema inválido.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen no puede exceder 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditingTheme(prev => ({
        ...prev,
        backgroundImage: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  if (!settings) return null;

  return (
    <div className="min-h-full pb-24 px-4 sm:px-6 bg-[#F4F5E7]">
      {/* Title */}
      <h2 className="text-3xl font-black text-[#1B1D0E] mb-6 tracking-tight leading-none mt-2">
        Theme Builder<br/>Ultimate
      </h2>

      {/* Interface Preview Card */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm mb-10 overflow-hidden relative border border-black/5">
        <div className="flex items-center gap-3 mb-8">
           <span className="text-[10px] font-bold tracking-widest text-[#5C5C5C] uppercase">Canvas Live</span>
        </div>
        
        <h3 className="text-2xl font-bold text-[#1B1D0E] mb-6">Interface Preview</h3>
        
        <div className="flex gap-2 bg-[#F4F5E7] p-1 rounded-full w-max mb-10">
          <button 
            onClick={() => setActiveThemeMode('light')}
            className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all", activeThemeMode === 'light' ? "bg-[#03241F] text-white shadow" : "text-[#5C5C5C]")}
          >
            Light
          </button>
          <button 
             onClick={() => setActiveThemeMode('dark')}
             className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all", activeThemeMode === 'dark' ? "bg-[#03241F] text-white shadow" : "text-[#5C5C5C]")}
          >
            Dark
          </button>
          <button 
             onClick={() => setActiveThemeMode('oled')}
             className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all", activeThemeMode === 'oled' ? "bg-[#03241F] text-white shadow" : "text-[#5C5C5C]")}
          >
             OLED
          </button>
        </div>

        {/* Fake Card */}
        <div 
           className="bg-[#F4F5E7] p-8"
           style={{ borderRadius: `${activeRadius}px`, background: editingTheme.cssVariables?.['--color-surface'] || '#F4F5E7' }}
        >
          <div className="flex gap-2 mb-6">
            <span className="bg-[#A7E8D7] text-[#146A5D] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: editingTheme.cssVariables?.['--color-primary-container'], color: editingTheme.cssVariables?.['--color-primary']}}>Clinical Priority</span>
            <span className="bg-[#EAE8D5] text-[#5C5C5C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active Lab</span>
          </div>
          <h4 className="text-3xl font-black text-[#1B1D0E] mb-4 leading-tight" style={{ color: editingTheme.cssVariables?.['--color-on-surface']}}>
            Empower<br/>Your Pet's<br/>Wellness<br/>Journey
          </h4>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-8">
            Customize the architectural bones of your K9 VitalPaw experience. These changes propagate instantly to your clinical dashboard.
          </p>
          <div className="flex flex-col gap-3">
             <button className="bg-[#03241F] text-white px-6 py-4 rounded-full font-bold shadow-md w-full" style={{ background: editingTheme.cssVariables?.['--color-primary']}}>Primary Action</button>
             <button className="bg-[#EAE8D5] text-[#1B1D0E] px-6 py-4 rounded-full font-bold w-full">Secondary Action</button>
          </div>
        </div>
      </div>

      {/* Background Engine */}
      <h3 className="text-xl font-bold text-[#1B1D0E] mb-4 flex items-center justify-between">
        <span>Background<br/>Engine</span>
        <div className="flex gap-4 text-sm">
           <span className="font-bold border-b-2 border-[#1B1D0E] pb-1">Color</span>
           <span className="text-[#5C5C5C]">Image</span>
           <span className="text-[#5C5C5C]">Video</span>
        </div>
      </h3>
      <div className="bg-[#FCFCF9] border-2 border-dashed border-[#CFD0C1] rounded-[3rem] p-10 mb-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {editingTheme.backgroundImage ? (
           <>
              <img src={editingTheme.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <button onClick={() => setEditingTheme({...editingTheme, backgroundImage: ''})} className="relative z-10 bg-white p-3 rounded-full shadow-lg text-error"><X className="w-5 h-5"/></button>
           </>
        ) : (
           <>
            <input type="file" accept="image/*" onChange={handleBgUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="p-4 bg-[#EAE8D5] rounded-2xl mb-4">
              <Upload className="w-6 h-6 text-[#5C5C5C]" />
            </div>
            <p className="font-bold text-[#1B1D0E] text-sm mb-1">Drag & Drop Custom<br/>Asset</p>
            <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest font-bold">SVG, WEBP, OR MP4 (MAX 10MB)</p>
           </>
        )}
      </div>

      {/* Tonal Architecture */}
      <h3 className="text-xl font-bold text-[#1B1D0E] mb-4">Tonal Architecture</h3>
      <div className="space-y-3 mb-10">
        {[
          { key: '--color-primary', label: 'Primary' },
          { key: '--color-secondary', label: 'Secondary' },
          { key: '--color-surface', label: 'Surface' },
          { key: '--color-on-surface', label: 'Text' },
          { key: '--color-accent', label: 'Accent' }
        ].map((colorItem) => (
          <div key={colorItem.key} className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-sm border border-black/5">
            <div className="flex items-center gap-4 relative">
              <input 
                type="color" 
                value={editingTheme.cssVariables?.[colorItem.key] || '#000000'}
                onChange={(e) => handleColorChange(colorItem.key, e.target.value)}
                className="opacity-0 absolute inset-0 w-12 h-12 cursor-pointer z-10" 
              />
              <div className="w-12 h-12 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: editingTheme.cssVariables?.[colorItem.key] || '#000000' }}></div>
              <div>
                <p className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-widest mb-0.5">{colorItem.label}</p>
                <p className="font-mono text-sm font-bold text-[#1B1D0E] uppercase">{editingTheme.cssVariables?.[colorItem.key]}</p>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full bg-white border-2 border-dashed border-[#CFD0C1] rounded-3xl p-4 flex items-center justify-center text-[#5C5C5C] hover:bg-[#F4F5E7] transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Curated Themes */}
      <div className="mb-10">
         <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-[#1B1D0E]">Curated Themes</h3>
            <button className="text-sm font-bold text-[#146A5D] flex items-center gap-1">View Library &rarr;</button>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
            <button 
               onClick={() => {
                  setEditingTheme({
                     ...editingTheme,
                     name: 'Clinical Heritage',
                     cssVariables: {
                        '--color-primary': '#03241F',
                        '--color-secondary': '#146A5D',
                        '--color-surface': '#F4F5E7',
                        '--color-on-surface': '#1B1D0E',
                        '--color-accent': '#BA1A1A'
                     }
                  })
               }}
               className="min-w-[240px] text-left snap-center"
            >
               <div className="w-full h-32 rounded-3xl overflow-hidden mb-3 shadow-md relative">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
               <p className="font-bold text-[#1B1D0E]">Clinical Heritage</p>
               <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-bold">Default Sanctuary</p>
            </button>

            <button 
               onClick={() => {
                  setEditingTheme({
                     ...editingTheme,
                     name: 'Nocturnal',
                     baseTheme: 'dark',
                     cssVariables: {
                        '--color-primary': '#A7E8D7',
                        '--color-secondary': '#8CD8C5',
                        '--color-surface': '#111111',
                        '--color-on-surface': '#FFFFFF',
                        '--color-accent': '#FF5A5A'
                     }
                  })
                  setActiveThemeMode('dark');
               }}
               className="min-w-[240px] text-left snap-center"
            >
               <div className="w-full h-32 rounded-3xl overflow-hidden mb-3 shadow-md relative">
                  <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
               <p className="font-bold text-[#1B1D0E]">Nocturnal</p>
               <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-bold">Midnight Path</p>
            </button>
         </div>
      </div>

      {/* Organic Precision */}
      <div className="bg-[#EAE8D5] rounded-[3rem] p-8 mb-10 border border-[#D1D0BE]">
         <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-[#1B1D0E]">Organic Precision</h4>
            <span className="bg-[#1B1D0E] text-white px-3 py-1 rounded-full text-xs font-bold">{activeRadius}dp</span>
         </div>
         <input 
           type="range" 
           min="0" max="40" 
           value={activeRadius} 
           onChange={(e) => setActiveRadius(parseInt(e.target.value))}
           className="w-full mb-2 accent-[#1B1D0E] h-2 bg-[#D1D0BE] rounded-lg appearance-none cursor-pointer"
         />
         <div className="flex justify-between text-[10px] text-[#5C5C5C] font-bold uppercase tracking-widest">
            <span>0DP</span>
            <span>40DP</span>
         </div>

         <div className="mt-8">
            <h4 className="font-bold text-[#1B1D0E] mb-4">Atmosphere</h4>
            <div className="space-y-2">
               {['light', 'dark', 'oled'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setActiveThemeMode(mode as any)}
                    className={cn(
                      "w-full bg-white p-4 rounded-2xl flex items-center justify-between border",
                      activeThemeMode === mode ? "border-[#1B1D0E] shadow-sm" : "border-transparent text-[#5C5C5C]"
                    )}
                  >
                     <div className="flex items-center gap-3">
                        {mode === 'light' ? <Sun className="w-5 h-5" /> : mode === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                        <span className="font-bold text-sm capitalize">{mode === 'light' ? 'Light Sanctuary' : mode === 'dark' ? 'Deep Obsidian' : 'True OLED Black'}</span>
                     </div>
                     {activeThemeMode === mode && <Check className="w-5 h-5 text-[#1B1D0E]" />}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Action Area */}
      <div className="space-y-4 mb-12">
         <button onClick={handleCreateTheme} className="w-full bg-[#03241F] text-white py-5 rounded-full font-bold flex justify-center items-center gap-2 shadow-lg hover:scale-[0.98] transition-transform">
            <Download className="w-5 h-5" /> Guardar Tema a JSON
         </button>
         <div className="flex gap-4">
            <button onClick={handleGenerate} className="flex-1 bg-[#A7E8D7] text-[#146A5D] py-4 rounded-full font-bold flex justify-center items-center gap-2 hover:bg-[#8CD8C5] transition-colors">
               <RefreshCw className="w-4 h-4" /> Randomizar
            </button>
            <div className="flex-1 relative">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <button className="w-full bg-[#EAE8D5] text-[#1B1D0E] py-4 rounded-full font-bold flex justify-center items-center gap-2 pointer-events-none">
                 <Upload className="w-4 h-4" /> Importar JSON
              </button>
            </div>
         </div>
      </div>

      {/* Saved Themes Library */}
      <div className="mb-10">
         <h3 className="text-xl font-bold text-[#1B1D0E] mb-6">Mis Temas Guardados</h3>
         {(!settings.customThemes || settings.customThemes.length === 0) ? (
            <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-[#CFD0C1]">
               <Palette className="w-8 h-8 text-[#CFD0C1] mx-auto mb-2" />
               <p className="text-sm font-bold text-[#5C5C5C]">Aún no tienes temas guardados.</p>
               <p className="text-xs text-[#5C5C5C]/70">Los temas que guardes o importes aparecerán aquí.</p>
            </div>
         ) : (
            <div className="space-y-3">
               {settings.customThemes.map((theme: any) => (
                  <div key={theme.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-black/5 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div 
                           className="w-10 h-10 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                           style={{ backgroundColor: theme.cssVariables['--color-primary'] }}
                        />
                        <div>
                           <p className="font-bold text-sm text-[#1B1D0E] mb-0.5">{theme.name}</p>
                           <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest font-bold">
                              {theme.baseTheme || 'Light'} Mode
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                           onClick={() => {
                              saveSettings({ ...settings, theme: theme.id });
                           }}
                           className={cn(
                              "px-4 py-2 rounded-full text-xs font-bold transition-all",
                              settings.theme === theme.id ? "bg-[#1B1D0E] text-white" : "bg-[#F4F5E7] text-[#5C5C5C] hover:bg-[#EAE8D5]"
                           )}
                        >
                           {settings.theme === theme.id ? 'Activo' : 'Aplicar'}
                        </button>
                        <button 
                           onClick={() => {
                              const newCustomThemes = settings.customThemes!.filter((t: any) => t.id !== theme.id);
                              saveSettings({ ...settings, customThemes: newCustomThemes, theme: settings.theme === theme.id ? 'clinical' : settings.theme });
                           }}
                           className="p-2 text-[#BA1A1A] bg-[#F4F5E7] rounded-full hover:bg-[#BA1A1A]/10 transition-colors"
                        >
                           <X className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
      
    </div>
  );
};
