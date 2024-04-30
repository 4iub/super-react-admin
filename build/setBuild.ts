import type { ConfigEnv, BuildOptions } from 'vite';

import { pathResolve } from './utils';

interface Props {
  mode: ConfigEnv['mode'];
  outDir: string;
}
export function setBuild({ mode, outDir }: Props) {
  const build: BuildOptions = {
    outDir,
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: {
        index: pathResolve('index.html'),
      },
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id: any) {
          if (id.includes('node_modules'))
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
        },
      },
    },
  };

  if (mode === 'production') {
    build.terserOptions = {
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    };
  }
  return build;
}
