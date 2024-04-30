import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
  component: Home,
  staticData: {
    name: '123',
  },
});

function Home() {
  return (
    <div>
      <button className="btn">Button</button>
      Hello /_auth/!
    </div>
  );
}
