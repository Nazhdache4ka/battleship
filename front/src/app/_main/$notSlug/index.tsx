import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/$notSlug/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>ЕБАНАТ ТЫ ЗАБЫЛ УКАЗАТЬ НОВОСТИ ИЛИ ЭВЕНТЫ</div>;
}
