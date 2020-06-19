const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base');

const pathsMap = require("./config");

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    ...baseConfig,
    mode: "production",
    // devtool: "",
    output: {
        ...baseConfig.output,
        filename: '_static/js/[name].[contenthash:8].js'
    },
    module: {
        ...baseConfig.module,
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
                        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]// 将 Sass 编译成 CSS-》将 CSS 转化成 CommonJS 模块-》将 JS 字符串生成为 style 节点
                    },
                    {
                        test: /\.(svg|jpg|jpeg|bmp|png|webp|gif|ico|ttf)$/,
                        loader: 'url-loader',
                        options: {
                            // limit: 8 * 1024, // 小于这个大小的图片，会自动base64编码后插入到代码中
                            name: '_static/img/[name].[contenthash:8].[ext]',
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
                            name: '_static/media/[name].[contenthash:8].[ext]',
                        },
                    }
                ]
            }

        ]
    },
    plugins: [
        ...baseConfig.plugins,
        // gzip压缩
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 10240, // 大于这个大小的文件才会被压缩
            minRatio: 0.8
        }),
        new MiniCssExtractPlugin({
            filename: "_static/css/[name].[contenthash:8].css"
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, "../node_modules/cesium/Build/Cesium"), ignore: ['Cesium.js'] }
        ]),
        new BundleAnalyzerPlugin(
            {
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8888, // 运行后的端口号
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            }
        ),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 100000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
        runtimeChunk: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { map: { inline: false } }
            }),
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // Must be set to true if using source-maps in production
            })
        ]
    }
}

