const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const config = require('./config');
const path = require("path");
/**
 * 给webpack配置增加cesium配置
 * @param {webpack.Configuration } webpackConfig 
 * @param {boolean} beProduction 
 */
function formate_webpack_config_with_cesium(webpackConfig, beProduction) {
    let cesiumPath = beProduction ? path.resolve(__dirname, "../node_modules/cesium/Build/Cesium") : path.resolve(__dirname, "../node_modules/cesium/Build/CesiumUnminified");
    return {
        ...webpackConfig,
        output: {
            ...webpackConfig.output,
            sourcePrefix: ''
        },
        amd: {
            ...webpackConfig.amd,
            toUrlUndefined: true// Enable webpack-friendly use of require in Cesium
        },
        module: {
            ...webpackConfig.module,
            unknownContextCritical: false
        },
        resolve: {
            ...webpackConfig.resolve,
            alias: {
                ...webpackConfig.resolve.alias,
                '@cesiumSource': path.resolve(__dirname, "../node_modules/cesium/Source"),
                '@cesiumBuild': path.resolve(__dirname, "../node_modules/cesium/Build/Cesium"),
                '@cesiumDebug': path.resolve(__dirname, "../node_modules/cesium/Build/CesiumUnminified"),
            }
        },
        plugins: [
            ...webpackConfig.plugins,
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                'CESIUM_BASE_URL': JSON.stringify('')
            }),
            new CopyWebpackPlugin([
                { from: cesiumPath, ignore: ['Cesium.js'] }
            ]),
        ]
    }
}
/**
 * 如果是 "dev+ 参数" 的格式则为执行某个样例
 */
function runExampleFile() {
    return process.argv[2] != null;
}

/**
 * 根据输入参数找到对应样例文件路径;
 * 用于：配合ts-node跑任意入口文件或webpack修改入口地址
 * 
 * @returns {Promise<String>}
 */
function findExampleFile() {
    const file_prefix = process.argv[2];
    const path = require("path");
    const fs = require("fs");
    let src_dir = path.resolve(config.appPath, "examples");
    return new Promise((resolve) => {
        fs.readdir(src_dir, (err, items) => {
            let item = items.find(item => item.toLowerCase().startsWith(file_prefix.toLowerCase()));
            if (item != null) {
                resolve(path.resolve(src_dir, item))
            } else {
                resolve(null);
            }
        });
    })
}


/**
 * 是否需要包分析
 */
function beNeedAnalyze() {
    return process.env["BUILD"] == "analyze"
}

/**
 * webpack添加包分析
 * @param {*} webpackConfig 
 */
function formate_webpack_config_with_analyzer(webpackConfig) {
    return {
        ...webpackConfig,
        plugins: [
            ...webpackConfig.plugins,
            new BundleAnalyzerPlugin(
                {
                    analyzerMode: 'server',
                    analyzerHost: '127.0.0.1',
                    reportFilename: 'report.html',
                    defaultSizes: 'parsed',
                    openAnalyzer: true,
                    generateStatsFile: false,
                    statsFilename: 'stats.json',
                    statsOptions: null,
                    logLevel: 'info'
                }
            )
        ]
    }
}

module.exports = {
    formate_webpack_config_with_cesium,
    runExampleFile,
    findExampleFile,
    beNeedAnalyze,
    formate_webpack_config_with_analyzer
}