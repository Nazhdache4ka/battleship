import { Container, Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { MatchmakingOrchestrator } from '@/features';

export const Route = createFileRoute('/_main/(game)/multiplayer')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <MatchmakingOrchestrator />
      </Box>
    </Container>
  );
}
