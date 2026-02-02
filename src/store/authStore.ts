import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole } from '@/types/auth';

const mockUsers: Record<string, User> = {
  admin: {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@taqnia.com',
    name: 'مدير النظام',
    role: 'admin',
  },
  keeper: {
    id: 'keeper-1',
    username: 'warehouse',
    email: 'keeper@taqnia.com',
    name: 'أمين المخزن',
    role: 'keeper',
  },
  marketer: {
    id: 'marketer-1',
    username: 'salesman',
    email: 'marketer@taqnia.com',
    name: 'المسوق الميداني',
    role: 'marketer',
  },
  'best-marketer': {
    id: 'marketer-2',
    username: 'bestmarketer',
    email: 'best@taqnia.com',
    name: 'المسوق الأفضل',
    role: 'marketer',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string, rememberMe = false) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let userKey: string | null = null;
        const usernameLower = username.toLowerCase();
        
        // Check specific usernames first
        if (usernameLower === 'bestmarketer' || usernameLower === 'المسوق الأفضل') {
          userKey = 'best-marketer';
        } else if (usernameLower.includes('admin')) {
          userKey = 'admin';
        } else if (usernameLower.includes('warehouse') || usernameLower.includes('keeper')) {
          userKey = 'keeper';
        } else if (usernameLower.includes('salesman') || usernameLower.includes('marketer')) {
          userKey = 'marketer';
        }

        if (userKey && password.length >= 6) {
          const user = mockUsers[userKey];
          set({
            user: { ...user, username },
            isAuthenticated: true,
            isLoading: false,
          });
          // Save token for axiosInstance
          localStorage.setItem('auth-token', 'mock-jwt-token');
        } else {
          set({ isLoading: false });
          throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
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
