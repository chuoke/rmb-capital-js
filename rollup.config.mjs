import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import minify from "@rollup/plugin-terser";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "dist/index.mjs",
    output: {
      name: "RmbCapital",
      file: pkg.browser,
      format: "iife",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), minify({ sourceMap: true })],
  },
];
