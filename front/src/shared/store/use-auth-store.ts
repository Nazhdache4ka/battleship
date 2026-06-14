import { create } from 'zustand';
import { type Board, type IUser } from '../model';

interface AuthStore {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  userBoard: Board | null;
  setUserBoard: (board: Board | null) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuth: false,
  user: null,
  userBoard: null,
  setIsAuth: isAuth => set({ isAuth }),
  setUser: user => set({ user }),
  setUserBoard: board => set({ userBoard: board }),
}));
