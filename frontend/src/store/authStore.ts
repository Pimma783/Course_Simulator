import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  username: typeof window !== 'undefined' ? localStorage.getItem('studentId') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  
  login: (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('studentId', username);
    set({ token, username, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    set({ token: null, username: null, isAuthenticated: false });
  },
}));
