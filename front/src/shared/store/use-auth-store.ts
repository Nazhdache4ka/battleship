import { create } from 'zustand';
import { type IUser } from '../model';

interface AuthStore {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuth: false,
  user: null,
  setIsAuth: isAuth => set({ isAuth }),
  setUser: user => set({ user }),
}));
