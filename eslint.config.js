import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  unocss: true,
  react: true,
  typescript: true,
  stylistic: {
    indent: 2, // 4, or 'tab'
    semi: true,
    ignores: [],
    quotes: 'single', // or 'double'
  },
  rules: {
    // 禁用import排序
    'sort-imports': 'off',
    // 禁用禁止输出console
    'no-console': 'off',
    // 禁止在Promise中return
    'no-promise-executor-return': 'error',
    // 禁止在async函数中 return await
    'no-return-await': 'error',
    // reject必需使用Error返回错误
    'prefer-promise-reject-errors': 'error',
    // 排序命名导入
    'perfectionist/sort-named-imports': [
      'error',
      {
        type: 'line-length', // 按代码行长度排序
        order: 'asc',
      },
    ],
  },
});
