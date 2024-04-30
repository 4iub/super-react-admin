import { resolve } from 'node:path';
import process from 'node:process';
import type { ProxyOptions } from 'vite';

/**
 * @description 解析路径
 * @param {string} dir - 相对路径
 * @returns {string} - 解析后的绝对路径
 */
export function pathResolve(dir: string): string {
  return resolve(process.cwd(), '.', dir);
}

/**
 * @description 包装环境配置
 * @param {Recordable} envConfig - 环境配置对象
 * @returns {EnvType} - 包装后的环境配置
 */
export function wrapperEnv(envConfig: Recordable): EnvType {
  const env: any = {};
  for (const key of Object.keys(envConfig)) {
    let value = envConfig[key];
    value = value === 'true' ? true : value === 'false' ? false : value;
    if (key === 'VITE_PORT')
      value = Number(value);
    if (key === 'VITE_PROXY') {
      try {
        value = JSON.parse(value);
      }
      catch (error) {
        console.error(`analysis ${key} an error occurred while creating environment variables:`, error);
      }
    }
    env[key] = value;
  }
  return env;
}

type ProxyReturnType = Recordable< ProxyOptions & { rewrite: (_path: string) => string }>;
export function createProxy(proxy: Array<string[]>): ProxyReturnType {
  const proxyObj: ProxyReturnType = {};
  for (const [prefix, target] of proxy) {
    const httpsRE = /^https:\/\//;
    const isHttps = httpsRE.test(target);
    proxyObj[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return proxyObj;
}
