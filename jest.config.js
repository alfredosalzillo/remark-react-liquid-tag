export default {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            jsx: true,
            tsx: true,
            decorators: false,
            dynamicImport: false,
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    '!node_modules/',
  ],
};
