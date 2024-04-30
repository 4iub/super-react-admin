import { createRouter, RouterProvider } from '@tanstack/react-router';
import RouteLoading from './components/Loading';
import { routeTree } from '@/routeTree.gen';

const router = createRouter({
  routeTree,
  context: { isAuth: undefined! },
  defaultPreload: 'intent',
  defaultPendingMs: 3000,
  defaultPendingComponent: () => <RouteLoading />,
  defaultNotFoundComponent: () => <div>Global Not Found 23</div>,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    name?: string;
    hidden?: boolean;
  }
}

function RouteApp() {
  const authName = import.meta.env.VITE_AUTH_NAME;
  const isAuth = () => localStorage.getItem(authName) !== null;
  return (
    <RouterProvider router={router} context={{ isAuth }} />
  );
}

export default RouteApp;
