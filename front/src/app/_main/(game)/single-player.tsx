import { createFileRoute } from '@tanstack/react-router';
import { AiGamePage } from '@/pages';

export const Route = createFileRoute('/_main/(game)/single-player')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AiGamePage />;
}
