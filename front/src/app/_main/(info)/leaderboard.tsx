import { Leaderboard } from '@/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/(info)/leaderboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Leaderboard />;
}
