import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    external: [ 'parseley' ],
    input: 'src/selderee.ts',
    treeshake: false,
    plugins: [
      typescript({ compilerOptions: { declaration: false, isolatedDeclarations: false } }),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/selderee.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/selderee.cjs',
      },
    ],
  },
  {
    input: 'src/selderee.ts',
    plugins: [
      dts(),
      del({ targets: 'lib/*.d.ts', hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/selderee.d.mts',
      },
      {
        format: 'cjs',
        file: 'lib/selderee.d.cts',
      },
    ],
  },
];
