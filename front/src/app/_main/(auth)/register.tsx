import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/pages';

export const Route = createFileRoute('/_main/(auth)/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage />;
}
