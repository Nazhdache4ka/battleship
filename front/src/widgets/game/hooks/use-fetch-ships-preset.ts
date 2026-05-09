import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/shared';

export function useFetchShipsPreset() {
  const { data, isFetching } = useQuery({
    queryKey: ['ships-preset'],
    queryFn: () => UserService.getUserBoardPreset(),
  });

  return { data, isFetching };
}
