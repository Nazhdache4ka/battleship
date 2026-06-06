import { createFileRoute } from '@tanstack/react-router';
import { GameModesPage, ShipPlacement } from '@/widgets';
import { Container } from '@mui/material';

export const Route = createFileRoute('/_main/(game)/game-modes')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <GameModesPage />
      <Container
        maxWidth="xl"
        sx={{ my: 4 }}
      >
        <ShipPlacement />
      </Container>
    </>
  );
}
