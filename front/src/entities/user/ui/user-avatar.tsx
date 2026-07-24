import { Box, Typography, Avatar } from '@mui/material';
import { getFormattedDate } from '@/shared';

interface UserAvatarProps {
  name: string;
  rating: number;
  createdAt: string;
}

export function UserAvatar({ name, rating, createdAt }: UserAvatarProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ bgcolor: 'secondary.main', width: { xs: 48, md: 96 }, height: { xs: 48, md: 96 } }}>
        {name.charAt(0)}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">Current rating: {rating}</Typography>
        <Typography variant="body2">Joined on: {getFormattedDate(createdAt)}</Typography>
      </Box>
    </Box>
  );
}
