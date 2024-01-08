// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import html from 'rollup-plugin-html';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    html({ include: '**/*.html', inject: 'head', htmlMinifierOptions: { collapseWhitespace: true } }),
  ],
};
