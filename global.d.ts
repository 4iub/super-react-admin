type Recordable<T = any> = Record<string, T>;
// 合并交叉类型
type MergeIntersection<A> = A extends infer T ? { [Key in keyof T]: T[Key] } : never;
// Env配置类型
interface EnvType {
  // 根路径
  VITE_ROOT_URL: string;
  // 网站标题
  VITE_TITLE: string;
  // 端口
  VITE_PORT: number;
  // 是否开启mock
  VITE_OPEN_MOCK: boolean;
  // 代理配置
  VITE_PROXY: Array<string[]>;
  /** 打包文件的输出目录 */
  VITE_BUILD_NAME: string;
  /** 接口地址 */
  VITE_GLOB_API_URL: string;
  /** mock接口地址 */
  VITE_MOCK_API_URL: string;
}
