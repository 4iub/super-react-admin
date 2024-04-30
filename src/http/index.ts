import Http from './http';
import type { RequestType, ResponseType, RequestConfig } from './types';

export const server = new Http({
  baseURL: '/api',
  timeout: 10000,
});
function http<T = any>(config: RequestConfig) {
  config.method = config.method?.toLowerCase() || 'get';
  if (config.method === 'get')
    config.params = config.data;
  return server.request<ResponseType<T>>(config);
}

export function get<T = any, K = any>({ url, data }: RequestType<K>) {
  return http<T>({
    url,
    method: 'get',
    data,
  });
}
export function post<T = any, K = any>({ url, data }: RequestType<K>) {
  return http<T>({
    url,
    method: 'post',
    data,
  });
}
export function put<T = any, K = any>({ url, data }: RequestType<K>) {
  return http<T>({
    url,
    method: 'put',
    data,
  });
}
export function del<T = any, K = any>({ url, data }: RequestType<K>) {
  return http<T>({
    url,
    method: 'delete',
    data,
  });
}

export default http;
