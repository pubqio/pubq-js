import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/pubq.ts",
    output: [
        {
            file: "build/pubq.cjs.js",
            format: "cjs",
            exports: "auto",
            sourcemap: true,
        },
        {
            file: "build/pubq.esm.js",
            format: "esm",
            sourcemap: true,
        },
        {
            file: "build/pubq.umd.js",
            format: "umd",
            name: "PubQ",
            exports: "named",
            globals: {
                ws: "WebSocket",
            },
            sourcemap: true,
        },
    ],
    plugins: [
        typescript({ declaration: true, declarationDir: "./build" }),
        resolve({ browser: true, preferBuiltins: false }),
        commonjs({ transformMixedEsModules: true }),
        terser(),
    ],
    external: ["ws", "crypto", "http", "https", "url"],
};
