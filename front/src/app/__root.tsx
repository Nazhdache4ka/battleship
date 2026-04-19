import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';

export const Route = createRootRoute({
  beforeLoad: async () => {
    return {
      hui: 228,
    };
  },
  component: RootLayout,
  head: () => {
    return {
      meta: [
        {
          title: 'Battleship',
        },
      ],
    };
  },
});

function RootLayout() {
  return (
    <div className="p-2 flex gap-2">
      <HeadContent />

      <Outlet />

      <Scripts />
    </div>
  );
}
