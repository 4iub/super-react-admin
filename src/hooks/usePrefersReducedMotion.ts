import React from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';
const isRenderingOnServer = typeof window === 'undefined';
function getInitialState() {
  return isRenderingOnServer ? true : !window.matchMedia(QUERY).matches;
}
/**
 *
 * @description 用于检测用户是否偏好减少动效的 React Hook。
 * @returns {boolean} 如果用户偏好减少动效，则返回true，否则返回false。
 *
 * @example
 * // 在组件中使用usePrefersReducedMotion Hook
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * // 根据用户的偏好减少动效进行渲染
 * return (
 *   <div>
 *     {prefersReducedMotion ? (
 *       <StaticComponent />
 *     ) : (
 *       <AnimatedComponent />
 *     )}
 *   </div>
 * );
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(getInitialState);
  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };
    if (mediaQueryList.addEventListener)
      mediaQueryList.addEventListener('change', listener);
    else
      mediaQueryList.addListener(listener);

    return () => {
      if (mediaQueryList.removeEventListener)
        mediaQueryList.removeEventListener('change', listener);
      else
        mediaQueryList.removeListener(listener);
    };
  }, []);
  return prefersReducedMotion;
}
