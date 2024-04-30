import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import svgr from 'vite-plugin-svgr';
import { compression } from 'vite-plugin-compression2';
import legacy from '@vitejs/plugin-legacy';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export function createVitePlugins(isMock: boolean = false): PluginOption[] {
  console.log(isMock);
  return [
    react(),
    UnoCSS(),
    // https://github.com/pd4d10/vite-plugin-svgr
    svgr(),
    // https://github.com/nonzzz/vite-plugin-compression
    compression(),
    // https://tanstack.com/router/latest/docs/framework/react/quick-start
    TanStackRouterVite(),
    // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ];
}
