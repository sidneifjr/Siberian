const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
    },

    devServer: {
        contentBase: './build',
        port: 9000,
    },
});
