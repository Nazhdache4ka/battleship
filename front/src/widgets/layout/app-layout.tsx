import { Box } from '@mui/material';
import { Header } from './header';
import { Outlet } from 'react-router-dom';
import { Footer } from './footer';

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
