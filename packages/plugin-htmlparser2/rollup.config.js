import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

export default [
  {
    external: [
      'domhandler',
      'htmlparser2',
      'selderee'
    ],
    input: 'src/hp2-builder.ts',
    plugins: [ typescript(), cleanup({ extensions: ['ts'] }) ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
