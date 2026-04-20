import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Clock,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Plus,
  Mic,
  FileText
} from 'lucide-react';
import { Pet, MedicalEvent, CustomCategory, CustomStatus } from '../types';
import { storageService } from '../services/storageService';
import * as Icons from 'lucide-react';

interface HistoryScreenProps {
  pet: Pet;
  events: MedicalEvent[];
  onEditEvent: (event: MedicalEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddEvent?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ pet, events, onEditEvent, onDeleteEvent, onAddEvent }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [statuses, setStatuses] = useState<CustomStatus[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      setCategories(await storageService.getCategories());
      setStatuses(await storageService.getStatuses());
    };
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter(e => filter === 'all' || e.category === filter)
      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, filter, search]);

  const getCategoryCount = useCallback((catId: string) => {
    if (catId === 'all') return events.length;
    return events.filter(e => e.category === catId).length;
  }, [events]);

  const getCategory = useCallback((id: string) => categories.find(c => c.id === id) || categories[0], [categories]);
  const getStatus = useCallback((id: string) => statuses.find(s => s.id === id) || statuses[0], [statuses]);

  return (
    <div className="h-full overflow-y-auto pb-32 pt-6 px-6 bg-[#F9F6E8] relative">
      <div className="space-y-6 mb-8">
        <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm border border-black/5">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-gray-400 text-gray-800 font-medium"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              filter === 'all' ? "bg-[#03241f] text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Todos ({getCategoryCount('all')})
          </button>
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            if (count === 0 && filter !== cat.id) return null;
            return (
              <button 
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap`}
                style={{ 
                  backgroundColor: filter === cat.id ? cat.color : cat.bgColor, 
                  color: filter === cat.id ? '#fff' : cat.color,
                  border: filter === cat.id ? 'none' : `1px solid ${cat.color}20`
                }}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => {
            const category = getCategory(event.category);
            const status = getStatus(event.status);
            // @ts-ignore
            const Icon = Icons[category.icon] || Icons.HelpCircle;
            
            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden flex relative group"
              >
                {/* Thick curved left border */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2 rounded-l-[2.5rem]" 
                  style={{ backgroundColor: category.color }}
                ></div>
                
                <div className="p-6 pl-8 flex-1 w-full flex items-center gap-5">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.bgColor }}
                  >
                    <Icon className="w-8 h-8" style={{ color: category.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight truncate pr-2">{event.title}</h3>
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.bgColor }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 font-medium text-sm mb-3 line-clamp-1">
                      {event.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Clock className="w-4 h-4" /> 
                        {/* Format date nicely, e.g. "Hoy, 10:00 AM" or "Ayer, 08:30 PM" */}
                        {event.date} {event.time && `, ${event.time}`}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {event.media && event.media.length > 0 && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 relative">
                            {(() => {
                              const firstMedia = event.media[0];
                              const isString = typeof firstMedia === 'string';
                              const url = isString ? firstMedia : firstMedia.url;
                              const type = isString ? (url.startsWith('data:video/') ? 'video' : 'image') : firstMedia.type;
                              
                              if (type === 'image') return <img src={url} alt="Adjunto" loading="lazy" className="w-full h-full object-cover" />;
                              if (type === 'video') return <video src={url} className="w-full h-full object-cover" />;
                              if (type === 'audio') return <div className="w-full h-full bg-blue-50 flex items-center justify-center"><Mic className="w-4 h-4 text-blue-500" /></div>;
                              return <div className="w-full h-full bg-orange-50 flex items-center justify-center"><FileText className="w-4 h-4 text-orange-500" /></div>;
                            })()}
                          </div>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button onClick={() => onEditEvent(event)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-full">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDeleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sin resultados</h3>
            <p className="text-gray-500 text-sm">No encontramos eventos que coincidan.</p>
          </div>
        )}
      </div>
    </div>
  );
};


