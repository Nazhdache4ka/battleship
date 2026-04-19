import { LoginPage } from '@/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/(auth)/login')({
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: 'Login',
        },
      ],
    };
  },
});

function RouteComponent() {
  return <LoginPage />;
}
