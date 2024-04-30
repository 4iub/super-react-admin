import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

export interface RequestType<T = any> {
  url: string;
  data?: T;
};
export interface ResponseType<T> {
  code: number;
  msg: string;
  data: T;
}

export interface CachedResponse<T> {
  data: T;
  expiresAt: number;
}

export interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (_config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (_err: AxiosError) => any;
  // 响应拦截
  responseInterceptors?: (_config: T) => T;
  responseInterceptorsCatch?: (_err: AxiosError) => any;
}

export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟时间(ms)
  onCancel?: (cancelToken: string) => void; // 取消请求的回调函数
  useCache?: boolean; // 是否使用缓存
  cacheTimeout?: number; // 缓存过期时间(ms)
}
