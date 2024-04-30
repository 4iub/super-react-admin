import React from 'react';

type Theme = 'dark' | 'light';

const prefersDark
  = window.matchMedia
  && window.matchMedia('(prefers-color-scheme: dark)').matches;

const colorSchema = (window.localStorage.getItem('color-schema') ?? (prefersDark ? 'dark' : 'light')) as Theme;

export function useDark() {
  const [isDark, setIsDark] = React.useState(() => colorSchema === 'dark');
  const toggle = React.useCallback((event: React.MouseEvent) => {
    // @ts-expect-error experimental API
    const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      setIsDark(!isDark);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    // @ts-expect-error experimental API
    const transition = document.startViewTransition(async () => {
      setIsDark(!isDark);
      window.localStorage.setItem('color-schema', !isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', !isDark);
    });
    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: !isDark
              ? [...clipPath].reverse()
              : clipPath,
          },
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: !isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        );
      });
  }, [isDark]);

  return [isDark, toggle] as const;
}
