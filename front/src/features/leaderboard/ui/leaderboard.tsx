import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
  Box,
  Container,
  alpha,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { axiosConfig, type IUser, getFormattedDate, useAuthStore } from '@/shared';

export function Leaderboard() {
  const userAuth = useAuthStore(state => state.user);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () =>
      axiosConfig
        .get<Pick<IUser, 'id' | 'name' | 'rating' | 'createdAt'>[]>('/users/leaderboard')
        .then(res => res.data),
  });

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress size={20} />
      </Box>
    );

  return (
    <Container maxWidth="xl">
      <TableContainer
        component={Paper}
        sx={{ my: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                }}
              >
                Rank
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard?.map((user, index) => {
              const formattedDate = getFormattedDate(user.createdAt);

              const isCurrentUser = userAuth?.id === user.id;

              const link = isCurrentUser ? '/user-private-profile' : `/users/$id`;

              return (
                <TableRow key={user.id}>
                  <TableCell
                    sx={{
                      background: theme =>
                        `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.6)}, ${alpha(theme.palette.primary.main, 0.8)})`,
                      border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Link
                      to={link}
                      params={{ id: user.id.toString() }}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.rating}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
