import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';

const router = createRouter({
  routeTree,
  context: { isAuth: undefined! },
  defaultPreload: 'intent',
  defaultPendingComponent: () => <div>Loading...</div>,
  defaultNotFoundComponent: () => <div>Global Not Found 23</div>,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    name?: string;
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
