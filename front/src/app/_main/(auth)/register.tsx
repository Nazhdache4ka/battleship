import { RegisterPage } from '@/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/(auth)/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage />;
}
