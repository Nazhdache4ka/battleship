import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$notSlug')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ border: '1px solid red' }}>
      <Outlet />
    </div>
  );
}
