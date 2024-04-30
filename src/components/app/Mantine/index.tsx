import { MantineProvider } from '@mantine/core';
import { useDark } from '@/hooks';
import '@mantine/core/styles.css';

function MantineApp({ children }: { children: React.ReactNode }) {
  const [isDark] = useDark();
  const colorScheme = isDark ? 'dark' : 'light';
  return (
    <MantineProvider defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
}

export default MantineApp;
