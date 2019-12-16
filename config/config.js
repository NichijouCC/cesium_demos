const path = require('path');

const buildPath = path.resolve(__dirname, '../build');
const publicPath = "/";
const appPath = path.resolve(__dirname, '../src');
const node_modules_path = path.resolve(__dirname, "../node_modules");
const indexHtmlPath = path.resolve(__dirname, "../public/index.html");

module.exports = {
    buildPath: buildPath,
    publicPath: publicPath,
    appPath: appPath,
    node_modules_path: node_modules_path,
    indexHtmlPath: indexHtmlPath
}