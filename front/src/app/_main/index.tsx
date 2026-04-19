import { createFileRoute } from '@tanstack/react-router';

type BackendResponse = {
  count: number;
};

export const Route = createFileRoute('/_main/')({
  loader: async () => {
    console.log('starting to load my good sir');

    const response = await new Promise<BackendResponse>(resolve =>
      setTimeout(() => resolve({ count: Math.floor(9999 * Math.random()) }), 2000)
    );

    return {
      response,
    };
  },
  component: RouteComponent,
  staleTime: Infinity,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return <div>{data.response.count}</div>;
}
