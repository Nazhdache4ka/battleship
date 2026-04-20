import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../api';
import { useAuthStore } from '@/shared';
import { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';

export function useAuthLogin() {
  const navigate = useNavigate();

  const { setIsAuth, setUser } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => AuthService.login(email, password),
    onSuccess: ({ accessToken, user }) => {
      setIsAuth(true);
      setUser(user);
      localStorage.setItem('accessToken', accessToken);
      navigate({ to: '/' });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMessage(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
  });

  return { login, isPending, errorMessage, openSnackbar, setOpenSnackbar };
}
