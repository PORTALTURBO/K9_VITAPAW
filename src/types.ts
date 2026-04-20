export interface CustomThemeData {
  id: string;
  name: string;
  cssVariables: Record<string, string>;
  fontFamily?: string;
  backgroundImage?: string;
  borderRadius?: string;
  baseTheme?: 'light' | 'dark' | 'oled';
}

export interface AppSettings {
  biometricEnabled: boolean;
  aiProvider: string;
  theme: string;
  customThemes?: CustomThemeData[];
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    advanceMinutes: number;
  };
}

export interface CustomCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface CustomStatus {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface OwnerProfile {
  name: string;
  photo?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document' | string;
  url: string;
  name: string;
  date?: string;
}

export interface MedicalEvent {
  id: string;
  petId: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  date: string;
  time: string;
  medication?: {
    name: string;
    dosage: string;
    duration: string;
  };
  vitals?: {
    temperature?: number;
    heartRate?: number;
  };
  professional?: {
    name: string;
    clinic: string;
  };
  media?: (string | MediaItem)[];
  reminder?: {
    frequency: number;
    unit: 'min' | 'hrs' | 'days' | 'weeks';
    enabled: boolean;
    limitType?: 'infinite' | 'date' | 'count';
    endDate?: string;
    occurrences?: number;
  };
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  weight: number;
  idealWeight?: number;
  sex: 'male' | 'female';
  neutered: boolean;
  photo?: string;
  allergies?: string;
  currentMedications?: string;
  bloodType?: string;
  vetName?: string;
  vetClinic?: string;
  vetPhone?: string;
  notes?: string;
  weightHistory: { date: string; value: number }[];
  expectedData?: {
    idealWeight?: number;
    checkupFrequencyMonths?: number;
    minTemperature?: number;
    maxTemperature?: number;
    minHeartRate?: number;
    maxHeartRate?: number;
  };
}


