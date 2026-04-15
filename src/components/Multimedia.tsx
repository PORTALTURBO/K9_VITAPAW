import React, { useState } from 'react';
import { Pet, MedicalEvent, MediaItem } from '../types';
import { Image as ImageIcon, Video, Mic, FileText, Calendar, Play, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface MultimediaProps {
  pet: Pet;
  events: MedicalEvent[];
}

type FilterType = 'all' | 'image' | 'video' | 'audio' | 'document';

export const Multimedia: React.FC<MultimediaProps> = ({ pet, events }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: string, name: string } | null>(null);

  // Extract all media from events
  const allMedia = events.flatMap(event => {
    if (!event.media) return [];
    return event.media.map(m => {
      const isString = typeof m === 'string';
      const url = isString ? m : m.url;
      const type = isString ? (url.startsWith('data:video/') ? 'video' : 'image') : m.type;
      const name = isString ? 'Archivo adjunto' : m.name;
      const date = isString ? event.date : (m.date || event.date);
      
      return {
        id: isString ? Math.random().toString() : m.id,
        type,
        url,
        name,
        date,
        eventId: event.id,
        eventTitle: event.title
      };
    });
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredMedia = filter === 'all' ? allMedia : allMedia.filter(m => m.type === filter);

  const filters = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'image', label: 'Fotos', icon: ImageIcon },
    { id: 'video', label: 'Vídeos', icon: Video },
    { id: 'audio', label: 'Audios', icon: Mic },
    { id: 'document', label: 'Docs', icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F9F6E8]">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-black text-[#1B3A34] mb-4">Galería de {pet.name}</h2>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all",
                filter === f.id 
                  ? "bg-[#1B3A34] text-white shadow-md" 
                  : "bg-white text-gray-500 hover:bg-[#E2F0D9] hover:text-[#2E7D6F]"
              )}
            >
              {f.icon && <f.icon className="w-4 h-4" />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1B3A34] mb-2">No hay archivos</h3>
            <p className="text-gray-500 text-sm max-w-[250px]">
              Sube fotos, vídeos o documentos desde la Ficha Médica para verlos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMedia.map((media, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={media.id}
                onClick={() => setSelectedMedia(media)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 aspect-square relative cursor-pointer group"
              >
                {media.type === 'image' && (
                  <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                
                {media.type === 'video' && (
                  <div className="w-full h-full relative">
                    <video src={media.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                )}

                {media.type === 'audio' && (
                  <div className="w-full h-full bg-[#4A90E2]/10 flex flex-col items-center justify-center p-4">
                    <Mic className="w-10 h-10 text-[#4A90E2] mb-2" />
                    <span className="text-xs font-bold text-[#1B3A34] text-center line-clamp-2">{media.name}</span>
                  </div>
                )}

                {media.type === 'document' && (
                  <div className="w-full h-full bg-[#F5A623]/10 flex flex-col items-center justify-center p-4">
                    <FileText className="w-10 h-10 text-[#F5A623] mb-2" />
                    <span className="text-xs font-bold text-[#1B3A34] text-center line-clamp-2">{media.name}</span>
                  </div>
                )}

                {/* Overlay with info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                  <p className="text-white text-[10px] font-bold truncate">{media.eventTitle}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-white/70" />
                    <span className="text-white/70 text-[8px]">{media.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Media Viewer */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col">
          <header className="flex justify-between items-center p-4 text-white">
            <h3 className="font-bold truncate max-w-[250px]">{selectedMedia.name}</h3>
            <button onClick={() => setSelectedMedia(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
              <X className="w-6 h-6" />
            </button>
          </header>
          <div className="flex-1 flex items-center justify-center p-4">
            {selectedMedia.type === 'image' && (
              <img src={selectedMedia.url} alt={selectedMedia.name} className="max-w-full max-h-full object-contain" />
            )}
            {selectedMedia.type === 'video' && (
              <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-full" />
            )}
            {selectedMedia.type === 'audio' && (
              <div className="bg-white/10 p-8 rounded-3xl flex flex-col items-center">
                <Mic className="w-20 h-20 text-white mb-6" />
                <audio src={selectedMedia.url} controls autoPlay className="w-full max-w-md" />
              </div>
            )}
            {selectedMedia.type === 'document' && (
              <div className="bg-white/10 p-8 rounded-3xl flex flex-col items-center text-center">
                <FileText className="w-20 h-20 text-white mb-6" />
                <p className="text-white mb-6">Vista previa no disponible para este tipo de documento.</p>
                <a href={selectedMedia.url} download={selectedMedia.name} className="bg-white text-black px-6 py-3 rounded-full font-bold">
                  Descargar Archivo
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
