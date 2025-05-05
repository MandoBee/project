import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  initializeAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// For demonstration purposes, we're using localStorage
// In a production app, you would use a proper backend API
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      
      initializeAuth: () => {
        // In a real app, you might verify the token with your backend here
        set({ isInitialized: true });
      },
      
      login: async (email: string, password: string) => {
        // Simulate API call
        try {
          // For demo purposes, we're just checking if email and password are not empty
          if (!email || !password) {
            return false;
          }
          
          // Simulate successful login - In a real app, you would validate with a backend
          const mockUser = {
            id: 'user-1',
            name: email.split('@')[0],
            email,
          };
          
          set({ user: mockUser, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        try {
          // For demo purposes, we'll just check if all fields are filled
          if (!name || !email || !password) {
            return false;
          }
          
          // Simulate successful registration
          const mockUser = {
            id: 'user-' + Date.now(),
            name,
            email,
          };
          
          set({ user: mockUser, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);