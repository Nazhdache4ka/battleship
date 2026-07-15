import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useAuthRefresh } from '@/features';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const isPending = useAuthRefresh();

  if (isPending) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">Server is waking up...</Typography>
        <Typography variant="body1">Might take a minute or two...</Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
