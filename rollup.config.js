import { terser } from 'rollup-plugin-terser';

export default {
  input: 'prisma-colour.js',
  output: [
    { file: 'dist/umd/prisma-colour.js', format: 'umd', name: 'Prisma', plugins: [terser()]},
    { file: 'dist/es6/prisma-colour.js', format: 'es', plugins: [terser()] },
  ],
};
