import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProfileApi } from '../api';
import type { AxiosError } from 'axios';
import { useAuthStore, UserService } from '@/shared';

interface UseUserSettingsPatchProps {
  userId: number;
}

export function useUserSettingsPatch({ userId }: UseUserSettingsPatchProps) {
  const queryClient = useQueryClient();

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const setUser = useAuthStore(state => state.setUser);

  const { refetch } = useQuery({
    queryKey: ['user-info', userId],
    queryFn: () => UserService.getMe(),
    enabled: false,
  });

  const { mutate: patchUserName, isPending: isPatchUserNamePending } = useMutation({
    mutationFn: (name: string) => UserProfileApi.patchUserName(name),
    onError: (error: AxiosError<{ message: string }>) => {
      setEmailError(null);
      setPasswordError(null);
      setNameError(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['user-info', userId] });
      const user = await refetch().then(res => res.data);

      if (!user) return;

      setUser(user);
    },
  });

  const { mutate: patchUserEmail, isPending: isPatchUserEmailPending } = useMutation({
    mutationFn: (email: string) => UserProfileApi.patchUserEmail(email),
    onError: (error: AxiosError<{ message: string }>) => {
      setNameError(null);
      setPasswordError(null);
      setEmailError(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['user-info', userId] });
      const user = await refetch().then(res => res.data);

      if (!user) return;

      setUser(user);
    },
  });

  const { mutate: patchUserPassword, isPending: isPatchUserPasswordPending } = useMutation({
    mutationFn: (password: string) => UserProfileApi.patchUserPassword(password),
    onError: (error: AxiosError<{ message: string }>) => {
      setNameError(null);
      setEmailError(null);
      setPasswordError(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['user-info', userId] });
    },
  });

  const snackbarMessage = nameError ?? emailError ?? passwordError;

  return {
    patchUserName,
    patchUserEmail,
    patchUserPassword,
    isPatchUserNamePending,
    isPatchUserEmailPending,
    isPatchUserPasswordPending,
    snackbarMessage,
    openSnackbar,
    setOpenSnackbar,
  };
}
