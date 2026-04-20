import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, Activity, CheckCircle2, ChevronRight, AlertCircle, Heart } from 'lucide-react';
import { MedicalEvent, Pet } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface NotificationCenterProps {
  events: MedicalEvent[];
  pets: Pet[];
  onClose: () => void;
  onNavigateToEvent?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ events, pets, onClose, onNavigateToEvent }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'alerts'>('all');
  
  const now = new Date();
  
  // Calculate upcoming events with enabled reminders
  const reminders = events
    .filter(e => e.reminder && e.reminder.enabled && new Date(`${e.date}T${e.time || '00:00'}`) >= now)
    .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());
    
  // Calculate past/active events needing attention (e.g., missed)
  const missedEvents = events
    .filter(e => e.status === 'active' && new Date(`${e.date}T${e.time || '00:00'}`) < now)
    .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());

  // Generate generic insights or AI warnings for the center
  const insights = [];
  const petsNeedVitals = pets.filter(p => !events.find(e => e.petId === p.id && e.vitals));
  if (petsNeedVitals.length > 0) {
    insights.push({
      id: 'vital-missing',
      title: 'Faltan registros vitales',
      description: `Recomendamos registrar el peso y temperatura de ${petsNeedVitals.map(p=>p.name).join(', ')} pronto.`,
      icon: Activity,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10'
    });
  }

  const ListEvent = ({ event, isMissed }: { event: MedicalEvent, isMissed?: boolean }) => {
    const d = new Date(`${event.date}T${event.time || '00:00'}`);
    const isToday = d.toDateString() === now.toDateString();
    
    return (
      <div 
        onClick={() => onNavigateToEvent && onNavigateToEvent(event.id)}
        className="bg-white p-4 rounded-3xl border border-outline-variant/10 shadow-sm flex gap-4 items-start active:scale-95 transition-transform"
      >
        <div className={cn("p-2 rounded-xl shrink-0", isMissed ? "bg-error/10" : "bg-primary/10")}>
          {isMissed ? <AlertCircle className="w-5 h-5 text-error" /> : <Calendar className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className={cn("font-bold text-sm", isMissed ? "text-error" : "text-primary")}>{event.title}</p>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
              {isToday ? 'HOY' : format(d, 'MMM dd')}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{event.description}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-outline-variant/10">
             <span className="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
               <Activity className="w-3 h-3" /> {pets.find(p=>p.id===event.petId)?.name}
             </span>
             <span className="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
               <Bell className="w-3 h-3" /> {event.time || 'Todo el día'}
             </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface h-full flex flex-col font-sans">
      <header className="bg-surface text-primary px-6 py-4 flex flex-col justify-end h-24 shrink-0 border-b border-outline-variant/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black font-headline">Centro de Alertas</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Notificaciones y recordatorios</p>
          </div>
          <button onClick={onClose} className="p-2 bg-surface-container-low text-on-surface-variant rounded-full active:scale-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex gap-2 p-4 bg-surface pb-2 border-b border-outline-variant/10">
        <button 
          onClick={() => setActiveTab('all')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
            activeTab === 'all' ? "bg-primary text-white shadow-md" : "text-on-surface-variant bg-surface-container-low"
          )}
        >
          Próximos ({reminders.length})
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all relative",
            activeTab === 'alerts' ? "bg-error text-white shadow-md" : "text-error bg-error/10"
          )}
        >
          Atrasados ({missedEvents.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {insights.length > 0 && activeTab === 'all' && (
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">Sugerencias Inteligentes</h3>
            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.id} className="bg-white p-4 rounded-3xl border border-outline-variant/10 shadow-sm flex gap-4 items-center">
                  <div className={cn("p-2 rounded-xl shrink-0", ins.bg)}>
                    <ins.icon className={cn("w-5 h-5", ins.color)} />
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm", ins.color)}>{ins.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{ins.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 ml-2">
            {activeTab === 'all' ? 'Recordatorios Programados' : 'Eventos Atrasados'}
          </h3>
          <div className="space-y-3">
            {activeTab === 'all' && reminders.map(e => <ListEvent key={e.id} event={e} />)}
            {activeTab === 'alerts' && missedEvents.map(e => <ListEvent key={e.id} event={e} isMissed />)}
            
            {(activeTab === 'all' ? reminders : missedEvents).length === 0 && (
              <div className="text-center py-10 px-4 bg-white rounded-3xl border border-outline-variant/10 border-dashed">
                <CheckCircle2 className="w-8 h-8 text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-sm font-bold text-primary">Todo está al día</p>
                <p className="text-xs text-on-surface-variant mt-1">No tienes {activeTab === 'all' ? 'recordatorios próximos' : 'eventos atrasados'}.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
