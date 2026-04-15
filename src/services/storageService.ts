import { Pet, MedicalEvent, OwnerProfile, CustomCategory, CustomStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';

const PETS_KEY = 'k9_vitalpaw_pets_v2';
const EVENTS_KEY = 'k9_vitalpaw_events_v2';
const OWNER_KEY = 'k9_vitalpaw_owner_v2';
const CATEGORIES_KEY = 'k9_vitalpaw_categories_v2';
const STATUSES_KEY = 'k9_vitalpaw_statuses_v2';
const SETTINGS_KEY = 'k9_vitalpaw_settings_v2';

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
  getSettings: async () => {
    const data = await localforage.getItem(SETTINGS_KEY);
    if (!data) {
      const defaultSettings = { biometricEnabled: false, aiProvider: 'gemma4b', aiPromptShown: false, aiDownloaded: false };
      await localforage.setItem(SETTINGS_KEY, defaultSettings);
      return defaultSettings;
    }
    return data as { biometricEnabled: boolean, aiProvider: string, aiPromptShown: boolean, aiDownloaded: boolean };
  },

  saveSettings: async (settings: any) => {
    await localforage.setItem(SETTINGS_KEY, settings);
  },

  getCategories: async (): Promise<CustomCategory[]> => {
    const data = await localforage.getItem<CustomCategory[]>(CATEGORIES_KEY);
    if (!data) {
      await localforage.setItem(CATEGORIES_KEY, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return data;
  },

  saveCategory: async (category: CustomCategory) => {
    const categories = await storageService.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    await localforage.setItem(CATEGORIES_KEY, categories);
  },

  deleteCategory: async (id: string) => {
    const categories = await storageService.getCategories();
    await localforage.setItem(CATEGORIES_KEY, categories.filter(c => c.id !== id));
  },

  getStatuses: async (): Promise<CustomStatus[]> => {
    const data = await localforage.getItem<CustomStatus[]>(STATUSES_KEY);
    if (!data) {
      await localforage.setItem(STATUSES_KEY, DEFAULT_STATUSES);
      return DEFAULT_STATUSES;
    }
    return data;
  },

  saveStatus: async (status: CustomStatus) => {
    const statuses = await storageService.getStatuses();
    const index = statuses.findIndex(s => s.id === status.id);
    if (index >= 0) {
      statuses[index] = status;
    } else {
      statuses.push(status);
    }
    await localforage.setItem(STATUSES_KEY, statuses);
  },

  deleteStatus: async (id: string) => {
    const statuses = await storageService.getStatuses();
    await localforage.setItem(STATUSES_KEY, statuses.filter(s => s.id !== id));
  },

  getOwnerProfile: async (): Promise<OwnerProfile> => {
    const data = await localforage.getItem<OwnerProfile>(OWNER_KEY);
    if (!data) {
      const defaultProfile: OwnerProfile = {
        name: 'Dueño',
        photo: 'https://i.pravatar.cc/150?img=11',
      };
      await localforage.setItem(OWNER_KEY, defaultProfile);
      return defaultProfile;
    }
    return data;
  },

  saveOwnerProfile: async (profile: OwnerProfile) => {
    await localforage.setItem(OWNER_KEY, profile);
  },

  getPets: async (): Promise<Pet[]> => {
    const data = await localforage.getItem<Pet[]>(PETS_KEY);
    if (!data) {
      await localforage.setItem(PETS_KEY, []);
      return [];
    }
    return data;
  },

  savePet: async (pet: Pet) => {
    const pets = await storageService.getPets();
    const index = pets.findIndex((p) => p.id === pet.id);
    if (index >= 0) {
      pets[index] = pet;
    } else {
      pets.push({ ...pet, id: uuidv4() });
    }
    await localforage.setItem(PETS_KEY, pets);
  },

  deletePet: async (id: string) => {
    const pets = await storageService.getPets();
    await localforage.setItem(PETS_KEY, pets.filter((p) => p.id !== id));
    const events = await storageService.getEvents();
    await localforage.setItem(EVENTS_KEY, events.filter((e) => e.petId !== id));
  },

  getEvents: async (): Promise<MedicalEvent[]> => {
    const data = await localforage.getItem<MedicalEvent[]>(EVENTS_KEY);
    if (!data) {
      await localforage.setItem(EVENTS_KEY, []);
      return [];
    }
    return data;
  },

  getEventsByPet: async (petId: string): Promise<MedicalEvent[]> => {
    const events = await storageService.getEvents();
    return events.filter((e) => e.petId === petId);
  },

  saveEvent: async (event: MedicalEvent) => {
    const events = await storageService.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push({ ...event, id: uuidv4() });
    }
    await localforage.setItem(EVENTS_KEY, events);
  },

  deleteEvent: async (id: string) => {
    const events = await storageService.getEvents();
    await localforage.setItem(EVENTS_KEY, events.filter((e) => e.id !== id));
  },
};


