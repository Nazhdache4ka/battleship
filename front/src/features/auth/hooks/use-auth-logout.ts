import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/shared';
import type { AxiosError } from 'axios';

export function useAuthLogout() {
  const navigate = useNavigate();

  const { setIsAuth, setUser } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setIsAuth(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      navigate({ to: '/login' });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMessage(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
  });

  return { logout, isPending, errorMessage, openSnackbar, setOpenSnackbar };
}
