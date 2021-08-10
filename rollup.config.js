import {babel} from "@rollup/plugin-babel";
import {uglify} from "rollup-plugin-uglify";

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
                            browsers: "> 1%, not dead",
                            node: 8
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
        uglify({
            output: {
                comments: "some"
            }
        })
    ]
};
