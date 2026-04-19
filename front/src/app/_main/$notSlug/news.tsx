import * as z from 'zod';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$notSlug/news')({
  validateSearch: z.object({
    page: z.number(),
    limit: z.number().optional(),
  }),
  loader: () => {
    if (Math.random() > 0.5) {
      return {
        news: 'news',
      };
    }

    throw notFound();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useParams();
  const search = Route.useSearch();
  const loaderData = Route.useLoaderData();

  return (
    <div>
      Hello — {data.notSlug}: {loaderData.news} — news! {search.page} {search.limit}
    </div>
  );
}
