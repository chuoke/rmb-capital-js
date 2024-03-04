import { defineBuildConfig } from 'unbuild'
import type { Plugin } from 'rollup'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import minify from "@rollup/plugin-terser";

export default defineBuildConfig([{
    entries: [
        'src/index',
    ],
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: true,
        output: {
            exports: 'named'
        }
    },
    hooks: {
        'rollup:options': (_, options) => {
            options.plugins ||= [];
            (options.plugins as any as Plugin[]).push({
                name: 'remove-assert',
                transform(code) {
                    return code.replace(/(\s\s)assert\(/g, '$1false && assert(')
                },
            })
        },
    },
}, {
    entries: [
        {
            input: "dist/index.mjs",
        }
    ],
    rollup: {
        output: {
            name: "RmbCapital",
            dir: 'dist/',
            format: "iife",
            entryFileNames: 'rmb-capital.min.js',
            sourcemap: true,
            exports: 'named'
        },
    },
    hooks: {
        'rollup:options': (_, options) => {
            options.plugins ||= [];
            (options.plugins as any as Plugin[])
                .push(...[
                    resolve() as Plugin, commonjs() as Plugin, minify({ sourceMap: true })
                ]);
        },
    },
}])
