import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/prisma-colour.js',
  output: [
    { file: 'build/cjs/index.js', format: 'cjs', name: 'Prisma', plugins: [terser()]},
    { file: 'build/esm/index.js', format: 'es', plugins: [terser()] },
  ],
};
