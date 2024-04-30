import { Outlet } from '@tanstack/react-router';
import React from 'react';
import { routeTree } from '@/routeTree.gen';

const Layout = React.memo(() => {
  console.log(routeTree);
  return (
    <div className="h-screen">

      <Outlet />
    </div>
  );
});

Layout.displayName = '22';
export default Layout;
