import { Pet, MedicalEvent, OwnerProfile, CustomCategory, CustomStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const PETS_KEY = 'k9_vitalpaw_pets_v2';
const EVENTS_KEY = 'k9_vitalpaw_events_v2';
const OWNER_KEY = 'k9_vitalpaw_owner_v2';
const CATEGORIES_KEY = 'k9_vitalpaw_categories_v2';
const STATUSES_KEY = 'k9_vitalpaw_statuses_v2';

const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'medical', label: 'Médico', icon: 'BriefcaseMedical', color: '#B22222', bgColor: '#FFD6D6' },
  { id: 'diet', label: 'Dieta', icon: 'Utensils', color: '#1B3A34', bgColor: '#A6E8D7' },
  { id: 'symptom', label: 'Síntomas', icon: 'AlertTriangle', color: '#B25A00', bgColor: '#FFDDB8' },
  { id: 'exercise', label: 'Ejercicio', icon: 'Activity', color: '#4A148C', bgColor: '#E1BEE7' },
];

const DEFAULT_STATUSES: CustomStatus[] = [
  { id: 'active', label: 'ACTIVO', color: '#B22222', bgColor: '#FFD6D6' },
  { id: 'improving', label: 'EN MEJORA', color: '#B25A00', bgColor: '#FFDDB8' },
  { id: 'resolved', label: 'RESUELTO', color: '#2E7D6F', bgColor: '#E2F0D9' },
];

export const storageService = {
  getCategories: (): CustomCategory[] => {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
  },

  saveCategory: (category: CustomCategory) => {
    const categories = storageService.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  deleteCategory: (id: string) => {
    const categories = storageService.getCategories().filter(c => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  getStatuses: (): CustomStatus[] => {
    const data = localStorage.getItem(STATUSES_KEY);
    if (!data) {
      localStorage.setItem(STATUSES_KEY, JSON.stringify(DEFAULT_STATUSES));
      return DEFAULT_STATUSES;
    }
    return JSON.parse(data);
  },

  saveStatus: (status: CustomStatus) => {
    const statuses = storageService.getStatuses();
    const index = statuses.findIndex(s => s.id === status.id);
    if (index >= 0) {
      statuses[index] = status;
    } else {
      statuses.push(status);
    }
    localStorage.setItem(STATUSES_KEY, JSON.stringify(statuses));
  },

  deleteStatus: (id: string) => {
    const statuses = storageService.getStatuses().filter(s => s.id !== id);
    localStorage.setItem(STATUSES_KEY, JSON.stringify(statuses));
  },

  getOwnerProfile: (): OwnerProfile => {
    const data = localStorage.getItem(OWNER_KEY);
    if (!data) {
      const defaultProfile: OwnerProfile = {
        name: 'Dueño',
        photo: 'https://i.pravatar.cc/150?img=11',
      };
      localStorage.setItem(OWNER_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(data);
  },

  saveOwnerProfile: (profile: OwnerProfile) => {
    localStorage.setItem(OWNER_KEY, JSON.stringify(profile));
  },

  getPets: (): Pet[] => {
    const data = localStorage.getItem(PETS_KEY);
    if (!data) {
      localStorage.setItem(PETS_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  },

  savePet: (pet: Pet) => {
    const pets = storageService.getPets();
    const index = pets.findIndex((p) => p.id === pet.id);
    if (index >= 0) {
      pets[index] = pet;
    } else {
      pets.push({ ...pet, id: uuidv4() });
    }
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  },

  deletePet: (id: string) => {
    const pets = storageService.getPets().filter((p) => p.id !== id);
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
    // Also delete events for this pet
    const events = storageService.getEvents().filter((e) => e.petId !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  getEvents: (): MedicalEvent[] => {
    const data = localStorage.getItem(EVENTS_KEY);
    if (!data) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  },

  getEventsByPet: (petId: string): MedicalEvent[] => {
    return storageService.getEvents().filter((e) => e.petId === petId);
  },

  saveEvent: (event: MedicalEvent) => {
    const events = storageService.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push({ ...event, id: uuidv4() });
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  deleteEvent: (id: string) => {
    const events = storageService.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },
};


