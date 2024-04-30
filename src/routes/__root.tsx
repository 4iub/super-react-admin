import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import React from 'react';

const TanStackRouterDevtools
  = import.meta.env.MODE === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
    // Lazy load in development
      import('@tanstack/router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );
interface RouterContext {
  isAuth: () => boolean;
};
export const Route = createRootRouteWithContext<RouterContext>()({

  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
