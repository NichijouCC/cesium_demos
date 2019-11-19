const ora = require('ora');//一个优雅的 Node.js 终端加载动画效果
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod');

const spinner = ora('webpack编译开始...\n').start();
webpack(webpackConfig, function (err, stats) {
    if (err) {
        spinner.fail('编译失败');
        console.log(err);
        return;
    } else {
        spinner.succeed('编译结束!\n');
        let statsLogs = stats.toString(
            {
                ...webpackConfig.stats,
                colors: true
            });
        process.stdout.write(statsLogs + '\n\n');
    }
});