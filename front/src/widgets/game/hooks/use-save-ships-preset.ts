import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, type Board } from '@/shared';
import type { AxiosError } from 'axios';

export function useSaveShipsPreset() {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { mutate: saveShipsPreset, isPending } = useMutation({
    mutationFn: ({ boardPreset }: { boardPreset: Board }) => UserService.saveUserBoardPreset(boardPreset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships-preset'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setErrorMessage(error.response?.data.message ?? 'An error occurred');
      setOpenSnackbar(true);
    },
  });

  return { isPending, errorMessage, openSnackbar, setOpenSnackbar, saveShipsPreset };
}
