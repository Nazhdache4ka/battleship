import { useQuery } from '@tanstack/react-query';
import { UserProfileApi } from '../api/user-profile-api';

export function useUserInfo(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-info', id],
    queryFn: () => UserProfileApi.getUserInfo(Number(id)),
    enabled: !!id,
  });

  return { data, isLoading, error };
}
