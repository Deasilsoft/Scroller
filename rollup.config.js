import {babel} from "@rollup/plugin-babel";
import {terser} from "rollup-plugin-terser";

export default {
    input: "src/scroller.js",
    output: {
        file: "dist/scroller.min.js",
        globals: {
            $: "$",
            document: "document",
            window: "window"
        },
        format: "iife"
    },
    plugins: [
        babel({
            babelHelpers: "runtime",
            presets: [
                [
                    "@babel/preset-env",
                    {
                        modules: false,
                        targets: {
                            browsers: "> 1%, not dead"
                        },
                        useBuiltIns: "usage",
                        corejs: 3
                    }
                ]
            ],
            plugins: [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: false
                    }
                ]
            ]

        }),
        terser({
            mangle: {
                reserved: ["links", "userOptions"]
            }
        })
    ]
};
