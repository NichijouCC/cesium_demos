const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumBuild = "node_modules/cesium/Build/Cesium"
const cesiumBuildDebug = "node_modules/cesium/Build/CesiumUnminified"

const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    mode: "development",
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.css$/, use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
                use: ['url-loader']
            },
            {
                test: /\.(js|mjs|jsx)$/,
                loader: 'string-replace-loader',
                options: {
                    search: '#!/usr/bin/env node',
                    replace: '',
                }
            }
        ],

        // is needed to avoid warnings from Cesium pulling in some third-party AMD-formatted modules like Knockout.
        unknownContextCritical: false
    },
    resolve: {
        alias: {
            // CesiumJS module name
            '@cesiumSource': path.resolve(__dirname, cesiumSource),
            '@cesiumBuild': path.resolve(__dirname, cesiumBuild),
            '@cesiumDebug': path.resolve(__dirname, cesiumBuildDebug)
        },
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopywebpackPlugin([{ from: 'static', to: 'static' }]),

        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopywebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};