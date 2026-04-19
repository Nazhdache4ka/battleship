import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$post/$fuck/$what')({
  params: {
    parse: params => {
      if (params.post === 'nehui' && params.what === 'nahui') {
        throw new Error('Nahui');
      }

      return params;
    },
  },
  component: RouteComponent,
  skipRouteOnParseError: {
    params: true,
  },
});

function RouteComponent() {
  const data = Route.useParams();
  return (
    <div>
      Hello "/_main/$post/$fuck/$what"! {data.post} {data.fuck} {data.what}
    </div>
  );
}
