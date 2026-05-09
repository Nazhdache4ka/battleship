import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../api';
import { getShipsFromBoardPreset, useAuthStore, useGameStore, UserService } from '@/shared';
import { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';

export function useAuthLogin() {
  const navigate = useNavigate();

  const { setIsAuth, setUser, setUserBoard } = useAuthStore();
  const { setBoard, setShips } = useGameStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => AuthService.login(email, password),
    onSuccess: async ({ accessToken, user }) => {
      setIsAuth(true);
      setUser(user);
      localStorage.setItem('accessToken', accessToken);
      const userBoardPreset = await UserService.getUserBoardPreset();
      if (userBoardPreset.length === 0) {
        setUserBoard(null);
      } else {
        setBoard(userBoardPreset);
        setShips(getShipsFromBoardPreset(userBoardPreset));
        setUserBoard(userBoardPreset);
      }
      navigate({ to: '/' });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMessage(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
  });

  return { login, isPending, errorMessage, openSnackbar, setOpenSnackbar };
}
