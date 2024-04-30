// Import the generated route tree

import RouteApp from './components/app/Route';
import AuthApp from './components/app/AuthApp';

console.log(2);
function App() {
  return (
    <AuthApp>
      <RouteApp />
    </AuthApp>
  );
}

export default App;
