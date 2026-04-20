import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/pages';

export const Route = createFileRoute('/_main/(auth)/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
