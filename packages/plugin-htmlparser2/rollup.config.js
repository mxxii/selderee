import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    external: [
      'domhandler',
      'htmlparser2',
      'selderee',
    ],
    input: 'src/hp2-builder.ts',
    plugins: [
      typescript({ compilerOptions: { declaration: false, isolatedDeclarations: false } }),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/hp2-builder.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/hp2-builder.cjs',
      },
    ],
  },
  {
    input: 'src/hp2-builder.ts',
    plugins: [
      dts(),
      del({ targets: 'lib/*.d.ts', hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/hp2-builder.d.mts',
      },
      {
        format: 'cjs',
        file: 'lib/hp2-builder.d.cts',
      },
    ],
  },
];
