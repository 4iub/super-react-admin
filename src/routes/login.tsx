import { redirect, useNavigate, createFileRoute } from '@tanstack/react-router';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { z } from 'zod';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: ({ context, location }) => {
    const { isAuth } = context;
    const auth = isAuth();
    if (auth && location.pathname === '/login') {
      throw redirect({
        to: '/',
        replace: true,
      });
    }
  },
  validateSearch: z.object({
    redirect: z.string().catch('/'),
  }),
});
function LoginPage() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const _handleLogin = () => {
    const loginState = signIn({
      auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6ODg4ODQyMTYwMH0.WBzc6RiWThQ66sOXbodoKqpui4R_ey0T-HDuWtSw-rI',
        type: 'Bearer',
      },
      userState: {
        name: 'React User',
        uid: 123456,
      },
    });
    if (loginState)
      navigate({ to: redirect });
  };
  return (
    <button className="btn" onClick={_handleLogin}>click me </button>

  );
}
