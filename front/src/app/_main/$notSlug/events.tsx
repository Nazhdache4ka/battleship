import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$notSlug/events')({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useParams();

  return <div>Hello {data.notSlug} events!</div>;
}
