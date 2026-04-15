import { Heart, Pill, Activity, Utensils, ShieldAlert, Sparkles, Brain } from 'lucide-react';

export const CATEGORIES: Record<string, { label: string; icon: any; color: string; bgColor: string; textColor: string }> = {
  medical: {
    label: 'Médico',
    icon: Pill,
    color: '#ba1a1a',
    bgColor: 'bg-error-container',
    textColor: 'text-error',
  },
  diet: {
    label: 'Dieta',
    icon: Utensils,
    color: '#146a5d',
    bgColor: 'bg-secondary-container',
    textColor: 'text-on-secondary-container',
  },
  symptom: {
    label: 'Síntomas',
    icon: ShieldAlert,
    color: '#eb8226',
    bgColor: 'bg-tertiary-fixed',
    textColor: 'text-tertiary-container',
  },
  exercise: {
    label: 'Ejercicio',
    icon: Activity,
    color: '#7c3aed',
    bgColor: 'bg-primary-fixed',
    textColor: 'text-on-primary-container',
  },
  hygiene: {
    label: 'Higiene',
    icon: Sparkles,
    color: '#006a6a',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-900',
  },
  conduct: {
    label: 'Conducta',
    icon: Brain,
    color: '#552800',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
  },
};

export const SEVERITIES: Record<string, { label: string; color: string }> = {
  low: { label: 'Baja', color: 'bg-green-500' },
  medium: { label: 'Media', color: 'bg-orange-500' },
  high: { label: 'Alta', color: 'bg-error' },
};

export const STATUSES: Record<string, { label: string; color: string }> = {
  active: { label: 'Activo', color: 'bg-error' },
  improving: { label: 'En mejora', color: 'bg-orange-400' },
  resolved: { label: 'Resuelto', color: 'bg-green-500' },
};

