import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$notSlug/$')({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useParams();

  return (
    <div>
      Hello SPLAT: {data.notSlug} {data._splat}
    </div>
  );
}
