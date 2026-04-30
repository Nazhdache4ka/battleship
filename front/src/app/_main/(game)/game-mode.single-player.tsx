import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/(game)/game-mode/single-player')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_main/(game)/game-mode/single-player"!</div>;
}
