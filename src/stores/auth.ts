import { writable } from 'svelte/store';
import type { User } from '$types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  return {
    subscribe,
    setUser: (user: User | null) => {
      update((state) => ({
        ...state,
        user,
        isAuthenticated: !!user,
        isLoading: false
      }));
    },
    setLoading: (loading: boolean) => {
      update((state) => ({ ...state, isLoading: loading }));
    },
    logout: () => {
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };
}

export const authStore = createAuthStore();
