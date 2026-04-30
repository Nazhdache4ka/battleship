import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/(game)/game-mode')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_main/(game)/game-mode"
      <Outlet />
    </div>
  );
}
