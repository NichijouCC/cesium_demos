const path = require('path');

/**
 * 自定义配置(按照项目修改)
 */
const customConfig = {
    assetBasePath: "./",
    devServerPort: 8585,
}


const staticConfig = {
    buildPath: path.resolve(__dirname, '../build'),
    appPath: path.resolve(__dirname, '../src'),
    node_modules_path: path.resolve(__dirname, "../node_modules"),
    indexHtmlPath: path.resolve(__dirname, "../public/index.html"),
}
module.exports = { ...staticConfig, ...customConfig }

