import process from 'node:process';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import { wrapperEnv, pathResolve, createProxy } from './build/utils';
import { createVitePlugins } from './build/plugins';
import { setBuild } from './build/setBuild';

export default ({ command: _, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const { VITE_PORT, VITE_OPEN_MOCK, VITE_BUILD_NAME, VITE_PROXY } = wrapperEnv(env);
  return {
    plugins: createVitePlugins(VITE_OPEN_MOCK),
    resolve: {
      alias: [
        {
          find: '@',
          replacement: `${pathResolve('src')}/`,
        },
      ],
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    build: setBuild({ mode, outDir: VITE_BUILD_NAME }),
  };
};
