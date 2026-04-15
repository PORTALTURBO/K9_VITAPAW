import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  ListFilter, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Bell,
  Edit3
} from 'lucide-react';
import { Pet, MedicalEvent } from '../types';
import { storageService } from '../services/storageService';
import * as Icons from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

interface DashboardProps {
  pet: Pet;
  events: MedicalEvent[];
  onAddEvent: () => void;
  onEditPet: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ pet, events, onAddEvent, onEditPet }) => {
  const urgentEvents = events.filter(e => e.severity === 'high' && e.status !== 'resolved');
  const activeEvents = events.filter(e => e.status === 'active');
  const resolvedEvents = events.filter(e => e.status === 'resolved');
  
  const recentActivity = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

  const categories = storageService.getCategories();
  const getCategory = (id: string) => categories.find(c => c.id === id) || categories[0];

  // Calculate distribution data
  const distributionData = categories.map(cat => {
    const count = events.filter(e => e.category === cat.id).length;
    return {
      name: cat.label,
      value: count,
      color: cat.color
    };
  }).filter(item => item.value > 0);

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <section className="relative w-full h-[40vh] min-h-[320px] max-h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={pet.photo || `https://picsum.photos/seed/${pet.name}/800/600`} 
          alt={pet.name}
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent z-10"></div>
        
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-5 py-2.5 flex items-center gap-4 shadow-2xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none mb-1">Bienestar</span>
              <span className="text-lg font-black text-white leading-none">94/100</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-secondary-container flex items-center justify-center relative">
              <Heart className="text-white w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 px-8 w-full flex justify-between items-end z-20">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-5xl font-black text-white font-headline tracking-tight drop-shadow-lg">{pet.name}</h1>
              <button 
                onClick={onEditPet}
                className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all active:scale-90 border border-white/30 shadow-lg"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/90 font-medium text-sm drop-shadow-md">
              <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <Activity className="w-4 h-4" /> {pet.breed}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <TrendingUp className="w-4 h-4" /> {pet.weight}kg
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 -mt-6 relative z-30 space-y-6">
        {/* Grid de Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Eventos */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ListFilter className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total</span>
            </div>
            <div>
              <span className="text-3xl font-black font-headline text-primary">{events.length}</span>
              <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Eventos registrados</p>
            </div>
          </motion.div>

          {/* Activos */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="relative p-2 bg-error/10 rounded-xl">
                <AlertCircle className="w-5 h-5 text-error" />
                {activeEvents.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-error">Activos</span>
            </div>
            <div className="relative z-10">
              <span className="text-3xl font-black font-headline text-error">
                {activeEvents.length}
              </span>
              <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Requieren atención</p>
            </div>
          </motion.div>

          {/* Resueltos */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Resueltos</span>
            </div>
            <div>
              <span className="text-3xl font-black font-headline text-secondary">{resolvedEvents.length}</span>
              <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Eventos finalizados</p>
            </div>
          </motion.div>

          {/* Próxima Alerta */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-tertiary/10 rounded-xl">
                <Bell className="w-5 h-5 text-tertiary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Alerta</span>
            </div>
            <div>
              <span className="text-lg font-black font-headline text-primary leading-tight">
                {activeEvents.length > 0 ? activeEvents[0].date : 'Ninguna'}
              </span>
              <p className="text-[10px] text-on-surface-variant mt-1 font-medium line-clamp-1">
                {activeEvents.length > 0 ? activeEvents[0].title : 'Todo al día'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Evolución de Peso */}
        <section className="bg-white rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold font-headline text-primary">Evolución de Peso</h2>
              <p className="text-xs text-on-surface-variant mt-1">Últimos registros</p>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pet.weightHistory}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D6F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2E7D6F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666' }}
                  dy={10}
                />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1B3A34' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2E7D6F" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Distribución */}
        {distributionData.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
            <h2 className="text-lg font-bold font-headline text-primary mb-4">Distribución</h2>
            <div className="flex items-center justify-between">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 pl-6 space-y-2">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-medium text-on-surface-variant">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Actividad Reciente */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold font-headline text-primary">Actividad Reciente</h3>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((event) => {
              const category = getCategory(event.category);
              // @ts-ignore
              const Icon = Icons[category.icon] || Icons.HelpCircle;
              return (
                <motion.div 
                  key={event.id}
                  whileHover={{ x: 2 }}
                  className="bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: category.bgColor }}>
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-primary truncate">{event.title}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium flex-shrink-0">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {recentActivity.length === 0 && (
              <div className="text-center py-6 text-on-surface-variant text-sm">
                No hay actividad reciente.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
