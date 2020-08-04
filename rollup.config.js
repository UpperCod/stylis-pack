import resolve from "@rollup/plugin-node-resolve";
import builtins from "builtin-modules";
import pkg from "./package.json";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: [...builtins, ...Object.keys(pkg.dependencies)],
  plugins: [resolve()],
};
