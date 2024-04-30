import { random } from 'lodash-es';
import React from 'react';

/**
 * 创建一个用于执行随机间隔的回调函数的 React Hook。
 *
 * @param {Function} callback - 要执行的回调函数。
 * @param {number | null} minDelay - 最小延迟时间（毫秒）。如果为 null，则禁用随机间隔。
 * @param {number | null} maxDelay - 最大延迟时间（毫秒）。如果为 null，则禁用随机间隔。
 * @returns {Function} 用于取消随机间隔的函数。
 *
 * @example
 * // 在组件中使用useRandomInterval Hook
 * const cancelRandomInterval = useRandomInterval(
 *   () => {
 *     // 这里可以执行周期性的操作
 *   },
 *   1000, // 最小延迟时间
 *   5000 // 最大延迟时间
 * );
 *
 * // 在组件卸载时取消随机间隔
 * useEffect(() => {
 *   return () => {
 *     cancelRandomInterval();
 *   };
 * }, []);
 */
export function useRandomInterval(callback: () => void, minDelay: number | null = null, maxDelay: number | null = null) {
  const timeoutId = React.useRef<number | undefined>(undefined);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const isEnabled = typeof minDelay === 'number' && typeof maxDelay === 'number';
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(() => {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
}
