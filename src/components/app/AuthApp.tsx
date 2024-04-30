import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

const store = createStore({
  authName: import.meta.env.VITE_AUTH_NAME,
  authType: 'localstorage',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

function AuthApp({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider store={store}>
      {children}
    </AuthProvider>
  );
}

export default AuthApp;
