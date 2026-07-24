import { createFileRoute } from '@tanstack/react-router';
import { UserPublicPage } from '@/pages';

export const Route = createFileRoute('/_main/(user)/users/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserPublicPage />;
}
