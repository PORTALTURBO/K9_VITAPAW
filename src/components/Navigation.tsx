import React from 'react';
import { Home, History, Brain, Settings, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightElement }) => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 glass border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-6 h-16 w-full">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          )}
          <h1 className="font-headline font-bold tracking-tight text-lg text-primary">{title}</h1>
        </div>
        {rightElement}
      </div>
    </header>
  );
};

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'multimedia', label: 'Galería', icon: ImageIcon },
    { id: 'copilot', label: 'Copilot', icon: Brain },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 glass rounded-t-[2.5rem] shadow-[0_-4px_40px_rgba(27,29,14,0.06)] border-t border-outline-variant/10">
      <div className="flex justify-around items-center px-2 sm:px-4 pb-4 pt-2 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 sm:px-5 py-2 transition-all duration-300 rounded-full",
                isActive ? "bg-primary text-white scale-105 shadow-lg" : "text-primary/60 hover:text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
