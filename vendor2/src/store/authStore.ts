import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Next_server } from '@/constant';

interface User {
  id: string;
  name: string;
  email: string;
  vendor_id: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  
  // Auth actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  
  // Session management
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      
      login: async (credentials) => {
        try {
          const response = await fetch(`${Next_server}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials),
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          
          // Store user info and token
          set({ 
            user: data.user,
            isAuthenticated: true,
            accessToken: data.access_token
          });
          
          // Store vendor_id in sessionStorage for other parts of the app
          if (data.user?.vendor_id) {
            sessionStorage.setItem('vendor_id', data.user.vendor_id);
          }
          
          return data;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      
      logout: async () => {
        try {
          // Call logout API
          await fetch(`${Next_server}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state and storage regardless of API result
          set({ user: null, isAuthenticated: false, accessToken: null });
          sessionStorage.removeItem('vendor_id');
        }
      },
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user?.vendor_id) {
          sessionStorage.setItem('vendor_id', user.vendor_id);
        }
      },
      
      checkSession: async () => {
        try {
          const response = await fetch(`${Next_server}/auth/session`, {
            credentials: 'include',
          });
          
          if (!response.ok) {
            set({ user: null, isAuthenticated: false });
            return false;
          }
          
          const data = await response.json();
          set({ user: data.user, isAuthenticated: true });
          
          if (data.user?.vendor_id) {
            sessionStorage.setItem('vendor_id', data.user.vendor_id);
          }
          
          return true;
        } catch (error) {
          console.error('Session check error:', error);
          set({ user: null, isAuthenticated: false });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken
      })
    }
  )
);