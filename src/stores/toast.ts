import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  let toastId = 0;

  return {
    subscribe,
    add: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
      const id = `toast-${toastId++}`;
      const toast: Toast = { id, message, type, duration };

      update((toasts) => [...toasts, toast]);

      if (duration) {
        setTimeout(() => {
          update((toasts) => toasts.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    remove: (id: string) => {
      update((toasts) => toasts.filter((t) => t.id !== id));
    },
    success: (message: string, duration = 3000) => {
      return {
        add: (msg: string) => {
          const id = `toast-${toastId++}`;
          const toast: Toast = { id, message: msg, type: 'success', duration };
          update((toasts) => [...toasts, toast]);
          if (duration) {
            setTimeout(() => {
              update((toasts) => toasts.filter((t) => t.id !== id));
            }, duration);
          }
          return id;
        }
      }.add(message);
    },
    error: (message: string, duration = 3000) => {
      const id = `toast-${toastId++}`;
      const toast: Toast = { id, message, type: 'error', duration };
      update((toasts) => [...toasts, toast]);
      if (duration) {
        setTimeout(() => {
          update((toasts) => toasts.filter((t) => t.id !== id));
        }, duration);
      }
      return id;
    }
  };
}

export const toastStore = createToastStore();
