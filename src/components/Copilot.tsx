import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Brain, Sparkles, User, Bot, Loader2, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Pet } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface CopilotScreenProps {
  pet?: Pet;
}

export const CopilotScreen: React.FC<CopilotScreenProps> = ({ pet }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: `¡Hola! Soy tu Copilot de VitalPaw. ${pet ? `¿En qué puedo ayudarte hoy con la salud de **${pet.name}**?` : '¿En qué puedo ayudarte hoy?'}` }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setIsLoading(true);

    const petContext = pet ? `${pet.name} es un ${pet.breed} de ${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} años, pesa ${pet.weight}kg.` : undefined;
    
    const response = await geminiService.getChatResponse(
      messages,
      userMessage,
      petContext
    );

    setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-40 pt-20 px-6 flex flex-col max-w-2xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
            <Brain className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline text-primary tracking-tight">Copiloto IA 🧠</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">Conectado</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 mb-8">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm",
              msg.role === 'user' ? "bg-secondary-container text-on-secondary-container" : "bg-white border border-outline-variant/20 text-primary"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={cn(
              "max-w-[80%] p-5 rounded-[2rem] shadow-sm",
              msg.role === 'user' 
                ? "bg-secondary-container text-on-secondary-container rounded-tr-none" 
                : "bg-white border border-outline-variant/15 text-on-surface rounded-tl-none"
            )}>
              <div className="prose prose-sm font-medium leading-relaxed">
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant/20 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-white border border-outline-variant/15 p-5 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-secondary animate-spin" />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Analizando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-32 left-0 w-full px-6 z-40">
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute -top-12 left-0 w-full flex justify-center">
            <div className="bg-surface-container-high/80 backdrop-blur-md border border-outline-variant/20 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <Info className="w-3 h-3 text-secondary" />
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Consejo IA: No sustituye consulta veterinaria</span>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-2 shadow-2xl shadow-primary/10 border border-outline-variant/20 flex items-center gap-2 group-focus-within:border-secondary transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe los síntomas..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-sm font-medium text-primary placeholder:text-outline-variant"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
                input.trim() && !isLoading ? "bg-secondary text-white scale-100" : "bg-surface-container-low text-outline scale-90"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

