import React from 'react';

/**
 *
 * @description 用于在组件中抛出异步错误 React Hook。
 * @returns {Function} 抛出异步错误的函数。
 */
export function useThrowAsyncError() {
  const [_state, setState] = React.useState();
  const throwAsyncError = React.useCallback((error: any) => {
    setState(() => {
      throw error;
    });
  }, []);
  return throwAsyncError;
}
