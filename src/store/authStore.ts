import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole } from '@/types/auth';
import { authApi } from '@/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.login({ username, password });
          const { token, user } = response.data;
          
          localStorage.setItem('auth-token', token);
          
          // Map API role to app role
          let role: UserRole = user.role;
          if (user.role === 'warehouse_keeper') role = 'keeper';
          if (user.role === 'salesman') role = 'marketer';
          
          set({
            user: {
              id: user.id.toString(),
              username: user.username,
              name: user.full_name,
              role,
              email: `${user.username}@taqnia.com`,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'فشل تسجيل الدخول';
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('auth-token');
          set({
            user: null,
            isAuthenticated: false,
          });
        }
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
