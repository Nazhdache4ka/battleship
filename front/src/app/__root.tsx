import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useAuthRefresh } from '@/features';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const isPending = useAuthRefresh();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
