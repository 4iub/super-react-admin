import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@mantine/core';

export const Route = createFileRoute('/_auth/')({
  component: Home,
  staticData: {
    name: '123',
  },
});

function Home() {
  return (
    <div>
      <Button variant="filled">Button</Button>
      Hello /_auth/!
    </div>
  );
}
