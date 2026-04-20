import { MedicalEvent, Pet, AppSettings } from '../types';
import { storageService } from './storageService';

export type NotificationCallback = (title: string, body: string) => void;

class NotificationService {
  private inAppFallback: NotificationCallback | null = null;
  private notifiedEvents: Set<string> = new Set();
  private pollInterval: number | null = null;

  constructor() {
    const saved = localStorage.getItem('k9_notified_events');
    if (saved) {
      try {
        this.notifiedEvents = new Set(JSON.parse(saved));
      } catch (e) {
        this.notifiedEvents = new Set();
      }
    }
  }

  setFallback(callback: NotificationCallback) {
    this.inAppFallback = callback;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    } catch (e) {
      console.warn('Notification permission error (might be in iframe):', e);
      return false;
    }

    return false;
  }

  async sendNotification(title: string, options?: NotificationOptions) {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      try {
        const notification = new Notification(title, {
          icon: '/vite.svg',
          ...options
        });

        notification.onclick = function() {
          window.focus();
          this.close();
        };
        return; // Success natively
      } catch (error) {
        console.error('Error sending native notification:', error);
      }
    }
    
    // Fallback if blocked/denied/failed
    if (this.inAppFallback) {
      this.inAppFallback(title, options?.body || '');
    } else {
      console.log(`[Notification Fallback] ${title}: ${options?.body}`);
    }
  }

  scheduleReminder(title: string, body: string, delayMs: number) {
    setTimeout(() => {
      this.sendNotification(title, { body });
    }, delayMs);
  }

  // --- Real Background Polling for Events ---
  async startPolling(getEvents: () => MedicalEvent[], getPets: () => Pet[]) {
    if (this.pollInterval) return;
    
    const check = async () => {
      this.checkEvents(getEvents(), getPets());
    };
    
    // Poll every 30 seconds
    this.pollInterval = window.setInterval(check, 30000);
    
    // Check immediately on mount
    check();
  }

  stopPolling() {
    if (this.pollInterval) {
      window.clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private playSoundVibrate(settings: AppSettings) {
    if (settings.notifications.vibration && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    if (settings.notifications.sound) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.warn('Audio play blocked:', e));
      } catch (e) {
        // Ignore
      }
    }
  }

  private async checkEvents(events: MedicalEvent[], pets: Pet[]) {
    const settings = await storageService.getSettings();
    if (!settings.notifications.enabled) return;

    const currentAdvanceMs = (settings.notifications.advanceMinutes || 0) * 60 * 1000;
    const now = new Date();

    events.forEach(event => {
      // Basic check
      if (!event.reminder?.enabled) return;

      // Unify event date and time
      const eventTime = new Date(`${event.date}T${event.time || '00:00'}`);
      const diffMs = eventTime.getTime() - now.getTime();
      
      // We notify exactly at the time, or at the advance time
      const shouldNotifyAdvance = currentAdvanceMs > 0 && diffMs <= currentAdvanceMs && diffMs > (currentAdvanceMs - 60000); 
      const shouldNotifyExact = diffMs <= 0 && diffMs > -60000;

      if (shouldNotifyAdvance || shouldNotifyExact) {
        if (!this.notifiedEvents.has(event.id + (shouldNotifyExact ? '_exact' : '_advance'))) {
          const pet = pets.find(p => p.id === event.petId);
          this.sendNotification(
            `K9 VitalPaw: ${event.title}`,
            { 
              body: shouldNotifyExact 
                ? `¡Es momento!\n${event.description || ''}`
                : `Recordatorio previo: El evento de ${pet?.name || 'tu mascota'} es pronto (${eventTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
              silent: !settings.notifications.sound
            }
          );
          
          this.playSoundVibrate(settings as any);

          this.notifiedEvents.add(event.id + (shouldNotifyExact ? '_exact' : '_advance'));
          this.saveNotified();
        }
      }
    });

    // Also notify if there's missing vital data for active tracking and hasn't been notified today.
    // (A more advanced use of background tasks).
  }

  private saveNotified() {
    localStorage.setItem('k9_notified_events', JSON.stringify(Array.from(this.notifiedEvents)));
  }

  clearHistory() {
    this.notifiedEvents.clear();
    localStorage.removeItem('k9_notified_events');
  }
}

export const notificationService = new NotificationService();
