import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/shared';
import { AuthService } from '../api';

export function useAuthRegister() {
  const navigate = useNavigate();

  const { setIsAuth, setUser } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { mutate: register, isPending } = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      AuthService.register(name, email, password),
    onSuccess: ({ accessToken, user }) => {
      setIsAuth(true);
      setUser(user);
      localStorage.setItem('accessToken', accessToken);
      navigate('/');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMessage(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
  });

  return { register, isPending, errorMessage, openSnackbar, setOpenSnackbar };
}
