import { createFileRoute } from '@tanstack/react-router';
import { UserPrivateProfile } from '@/pages';

export const Route = createFileRoute('/_main/(user)/user-private-profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserPrivateProfile />;
}
