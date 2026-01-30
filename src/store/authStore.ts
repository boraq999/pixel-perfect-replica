import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';

// Mock user for demo
const mockUser: User = {
  id: '1',
  username: 'ahmad',
  email: 'ahmad@taqnia.com',
  name: 'أحمد محمد',
  role: 'marketer',
  avatar: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string, rememberMe = false) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo: Accept any login with username length >= 3 and password length >= 6
        if (username.length >= 3 && password.length >= 6) {
          set({
            user: { ...mockUser, username, name: username },
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('بيانات الدخول غير صحيحة');
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
