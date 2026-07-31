import { useParams } from '@tanstack/react-router';
import { useUserInfo, useUserRatingHistory } from '../hooks';
import { UserAvatar, UserRatingHistory } from '@/entities';
import { Box, CircularProgress } from '@mui/material';

export function UserProfilePublic() {
  const { id } = useParams({ from: '/_main/(user)/users/$id' });

  const { data: ratingHistory } = useUserRatingHistory(Number(id));
  const { data: userInfo, isLoading } = useUserInfo(Number(id));

  if (isLoading) return <CircularProgress size={40} />;
  if (!userInfo) return <div>User not found</div>;

  return (
    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
      <UserAvatar
        name={userInfo.name}
        rating={userInfo.rating}
        createdAt={userInfo.createdAt}
      />
      <UserRatingHistory ratingHistory={ratingHistory ?? []} />
    </Box>
  );
}
