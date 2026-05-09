import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/shared';
import { AuthService } from '@/features/auth/api';
import { useEffect } from 'react';

export function useAuthRefresh() {
  const { setIsAuth, setUser } = useAuthStore();

  const { mutate: refresh, isPending } = useMutation({
    mutationFn: () => AuthService.refresh(),
    onSuccess: ({ accessToken, user }) => {
      setIsAuth(true);
      setUser(user);
      localStorage.setItem('accessToken', accessToken);
    },
    onError: () => {
      setIsAuth(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    },
  });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isPending;
}
