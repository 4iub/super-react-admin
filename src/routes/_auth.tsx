import { redirect, createFileRoute } from '@tanstack/react-router';
import Layout from '@/layout';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    const { isAuth } = context;
    const auth = isAuth();
    if (!auth) {
      throw redirect({
        to: '/login',
        replace: true,
        search: {
          redirect: location.href,
        },
      });
    }
    if (auth && location.pathname === '/login') {
      throw redirect({
        to: '/',
        replace: true,
      });
    }
  },
  component: Layout,
});
