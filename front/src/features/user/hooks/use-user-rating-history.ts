import { useQuery } from '@tanstack/react-query';
import { UserProfileApi } from '../api';

export function useUserRatingHistory(userId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-rating-history', userId],
    queryFn: () => UserProfileApi.getRatingHistory(userId),
    enabled: !!userId,
  });

  return { data, isLoading, error };
}
