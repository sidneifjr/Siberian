const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,

    output: {
        filename: "siberian.js",
        path: path.resolve(__dirname, "build"),
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
    ],
});
