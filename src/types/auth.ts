export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'marketer' | 'warehouse' | 'admin';
  avatar?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}
