import { createFileRoute, redirect } from '@tanstack/react-router';
import { Home } from '@/pages';
import { useAuthStore } from '@/shared';

export const Route = createFileRoute('/_main/')({
  // beforeLoad: async () => {
  //   const user = useAuthStore.getState().user;
  //   const isAuth = useAuthStore.getState().isAuth;

  //   if (!isAuth || !user) {
  //     throw redirect({ to: '/login' });
  //   }
  // },
  component: RouteComponent,
});

function RouteComponent() {
  return <Home />;
}
