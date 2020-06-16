const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pathsMap = require("./config");
const htmlPath = path.resolve(__dirname, "../src/index.html");

module.exports = {
    entry: {
        app: path.resolve(pathsMap.appPath, "index.tsx"),
        vendor: ['react', 'react-dom']// 不变的代码分包
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: pathsMap.buildPath,
        publicPath: pathsMap.publicPath,
        sourcePrefix: ''// Needed to compile multiline strings in Cesium --------------------------cesium
    },

    amd: {
        toUrlUndefined: true// Enable webpack-friendly use of require in Cesium
    },

    module: {
        unknownContextCritical: false,//build warn-------------------------cesium
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(j|t)sx?$/,
                        include: pathsMap.appPath,
                        exclude: pathsMap.node_modules_path,
                        use: "babel-loader",
                    },
                    {
                        test: /\.(html)$/,
                        loader: 'html-loader'
                    },
                    {
                        test: /\.(scss|css)$/,
                        use: ["style-loader", "css-loader", "sass-loader"]// 将 Sass 编译成 CSS-》将 CSS 转化成 CommonJS 模块-》将 JS 字符串生成为 style 节点
                    },
                    {
                        test: /\.(svg|jpg|jpeg|bmp|png|webp|gif|ico|ttf)$/,
                        loader: 'url-loader',
                        options: {
                            // limit: 8 * 1024, // 小于这个大小的图片，会自动base64编码后插入到代码中
                            name: 'img/[name].[hash:8].[ext]',
                            outputPath: pathsMap.buildPath,
                            publicPath: pathsMap.publicPath
                        }
                    },
                    {
                        loader: 'file-loader',
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'media/[name].[hash:8].[ext]',
                        },
                    }
                ]
            }

        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'], // 自动判断后缀名，引入时可以不带后缀
        alias: {
            '@': path.resolve(__dirname, '../src/'), // 以 @ 表示src目录
            '@public': path.resolve(__dirname, '../public/'), // 以 @ 表示src目录
            // CesiumJS module name-----------------------------------------------------------------------------cesium
            '@cesiumSource': path.resolve(__dirname, "../node_modules/cesium/Source"),
            '@cesiumBuild': path.resolve(__dirname, "../node_modules/cesium/Build/Cesium"),
            '@cesiumDebug': path.resolve(__dirname, "../node_modules/cesium/Build/CesiumUnminified"),
        }
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'public', ignore: ['index.html'] },
            { from: "src/lib/libAssets", to: "./libAssets" }
        ]),
        new HtmlWebpackPlugin({
            template: pathsMap.indexHtmlPath,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeOptionalTags: false,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new CleanWebpackPlugin(),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            'CESIUM_BASE_URL': JSON.stringify('./')
        })
    ]
}