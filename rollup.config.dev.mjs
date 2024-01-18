import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",

  output: {
    file: "./dist/main.min.js",
    name: "fletchApp",
    format: "iife",
    sourcemap: true,
  },

  plugins: [
    //  See https://github.com/rollup/plugins/tree/master/packages/typescript for config options
    typescript(),
    //  See https://github.com/rollup/plugins/tree/master/packages/terser for config options
    terser(),
  ],
};
