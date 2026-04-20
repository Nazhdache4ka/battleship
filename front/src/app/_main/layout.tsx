import { Footer, Header } from '@/widgets';
import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, minHeight: 0, width: '100%' }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
