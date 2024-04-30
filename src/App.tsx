// Import the generated route tree

import RouteApp from './components/app/Route';
import AuthApp from './components/app/AuthApp';
import MantineApp from './components/app/Mantine';

function App() {
  return (
    <AuthApp>
      <MantineApp>
        <RouteApp />
      </MantineApp>
    </AuthApp>
  );
}

export default App;
