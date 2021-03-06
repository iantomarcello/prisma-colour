import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/prisma-colour.js',
  output: [
    { file: 'build/cjs/prisma-colour.js', format: 'cjs', name: 'Prisma', plugins: [terser()]},
    { file: 'build/esm/prisma-colour.js', format: 'es', plugins: [terser()] },
  ],
};
