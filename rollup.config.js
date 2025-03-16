import swc from '@rollup/plugin-swc';
import { dts } from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input: 'src/plugin.ts',
    output: [
      {
        format: 'cjs',
        file: 'dist/plugin.cjs',
      },
      {
        format: 'es',
        file: 'dist/plugin.js',
      },
    ],
    external: ['react'],
    plugins: [
      nodeResolve(),
      swc(),
    ],
  },
  {
    input: 'src/plugin.ts',
    output: {
      file: 'dist/plugin.d.ts',
      format: 'es',
    },
    external: ['react'],
    plugins: [
      dts(),
    ],
  },
];

export default config;
