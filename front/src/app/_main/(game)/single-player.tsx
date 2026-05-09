import { createFileRoute } from '@tanstack/react-router';
import { GameBoardAi } from '@/features';

export const Route = createFileRoute('/_main/(game)/single-player')({
  component: RouteComponent,
});

function RouteComponent() {
  return <GameBoardAi />;
}
