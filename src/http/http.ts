import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { RequestConfig, CachedResponse } from './types';
import { errorCode } from '@/constants/errorCode';

/**
 * 创建一个 AbortController 实例,并在指定时间后自动调用 abort 方法
 * @param {number} timeoutMs - 超时时间,单位为毫秒
 * @returns {AbortController} - AbortController 实例
 */
function newAbortSignal(timeoutMs: number) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs);
  return abortController;
}

class Http {
  private instance: AxiosInstance; // Axios 实例
  private abortSignalMap: Map<string, AbortController>; // 请求 URL 与 AbortController 实例的映射
  private cache: Map<string, CachedResponse<any>> = new Map();

  constructor(config: RequestConfig) {
    this.instance = axios.create(config); // 创建 Axios 实例
    this.abortSignalMap = new Map(); // 初始化 AbortController 实例映射

    // 设置请求拦截器(自定义请求处理)
    this.instance.interceptors.request.use(
      config => this.handleRequest(config),
      error => this.handleRequestError(error),
    );

    // 设置响应拦截器(自定义响应处理)
    this.instance.interceptors.response.use(
      response => this.handleResponse(response),
      error => this.handleResponseError(error),
    );
  }

  /**
   * 发起 HTTP 请求
   * @param {RequestConfig<T>} config - 请求配置对象
   * @returns {Promise<T>} - 请求结果
   */
  request<T>(config: RequestConfig): Promise<AxiosResponse<T>['data']> {
    const { retry, useCache } = config;
    return new Promise((resolve, reject) => {
      if (useCache) {
        const cacheKey = this.getCacheKey(config);
        const cachedResponse = this.cache.get(cacheKey);
        if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
          resolve(cachedResponse.data);
          return;
        }
      }
      // 如果有自定义的请求拦截器,则执行
      if (config.interceptors?.requestInterceptors)
        config = config.interceptors.requestInterceptors(config as any);

      this.instance
        .request<any, AxiosResponse<T>>(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error: AxiosError) => {
          if (retry && retry > 0)
            this.retryRequest<T>(config);
          else
            return reject(error);
        });
    });
  }

  /**
   * 取消指定 URL 的请求
   * @param {string | string[]} url - 待取消的请求 URL,可以是单个 URL 或 URL 数组
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url];
    urlList.forEach((url) => {
      const signal = this.abortSignalMap.get(url);
      signal?.abort(); // 调用 AbortController 实例的 abort 方法取消请求
      this.abortSignalMap.delete(url); // 从映射中删除 AbortController 实例
    });
  }

  /**
   * 取消所有未完成的请求
   */
  cancelAllRequest() {
    for (const [_, controller] of this.abortSignalMap)
      controller.abort(); // 调用所有 AbortController 实例的 abort 方法取消请求
    this.abortSignalMap.clear(); // 清空 AbortController 实例映射
  }

  /**
   * 处理请求配置,添加 AbortSignal 和 Authorization 头
   * @param {InternalAxiosRequestConfig & RequestConfig} config - 请求配置对象
   * @returns {InternalAxiosRequestConfig<RequestConfig>} - 处理后的请求配置对象
   */
  private handleRequest(config: InternalAxiosRequestConfig & RequestConfig): InternalAxiosRequestConfig<RequestConfig> {
    const { timeout = 5000 } = config;
    const controller = newAbortSignal(timeout); // 创建 AbortController 实例
    config.signal = controller.signal; // 将 AbortSignal 添加到请求配置中
    config.headers.Authorization = 'token';
    const key = this.getCacheKey(config);
    const signal = this.abortSignalMap.get(key);
    if (signal)
      signal.abort();
    this.abortSignalMap.set(key, controller); // 将 AbortController 实例添加到映射中

    return config;
  }

  /**
   * 处理请求错误
   * @param {AxiosError} error - 请求错误
   * @returns {Promise<AxiosError>} - 处理后的错误
   */
  private handleRequestError(error: AxiosError): Promise<AxiosError> {
    return Promise.reject(error);
  }

  /**
   * 处理响应,包括缓存处理
   * @param {AxiosResponse} response - 响应对象
   * @returns {AxiosResponse} - 处理后的响应对象
   */
  private handleResponse(response: AxiosResponse) {
    const data = response.data;
    const config = response.config as RequestConfig;
    const { useCache, cacheTimeout = 1000 * 60 } = config;
    if (useCache) {
      const cacheKey = this.getCacheKey(config);
      this.cache.set(cacheKey, {
        data,
        expiresAt: Date.now() + cacheTimeout,
      });
    }
    this.abortSignalMap.delete(response.config.url ?? ''); // 从映射中删除 AbortController 实例
    return response;
  }

  /**
   * 处理响应错误
   * @param {AxiosError} error - 响应错误
   * @returns {Promise<AxiosError>} - 处理后的错误
   */
  private handleResponseError(error: AxiosError): Promise<AxiosError> {
    if (axios.isCancel(error))
      return Promise.reject(new Error('request is cancel'));

    const { response = { status: 404 } } = error;
    const { status } = response;
    const message = errorCode[status] || errorCode.default;
    console.log('🚀 ~ Http ~ handleResponseError ~ message:', message);
    return Promise.reject(error);
  }

  /**
   * 获取请求缓存的键值
   * @param {RequestConfig<T>} config - 请求配置对象
   * @returns {string} - 缓存键值
   */
  private getCacheKey<T>(config: RequestConfig<T>): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
  }

  /**
   * 重试请求
   * @param {RequestConfig} config - 请求配置对象
   * @returns {Promise<AxiosResponse<T>>} - 重试后的响应
   */
  private retryRequest<T>(config: RequestConfig) {
    const { retry = 0, retryDelay = 1000 } = config;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const updatedConfig = { ...config, retry: retry - 1 };
        this.instance.request<T>(updatedConfig)
          .then(resolve)
          .catch((error) => {
            if (updatedConfig.retry && updatedConfig.retry > 0) {
              this.retryRequest(updatedConfig)
                .then(resolve)
                .catch(reject);
            }
            else { reject(error); }
          });
      }, retryDelay);
    });
  }
}

export default Http;
