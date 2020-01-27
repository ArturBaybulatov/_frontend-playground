const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');


module.exports = {
    mode: 'development',
    devtool: 'source-map',
    resolve: { extensions: ['.ts', '.tsx', '.js'] },
    context: path.resolve('src/'), // Needs to be an absolute path
    entry: { index: './index.ts' },

    output: {
        path: path.resolve('dist/'), // Needs to be an absolute path
        filename: '[name].js',
    },

    module: {
        rules: [
            { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
            { test: /\.html$/, use: ExtractTextPlugin.extract('raw-loader') },
        ],
    },

    plugins: [
        new ExtractTextPlugin('[name].html'),
        new WebpackNotifierPlugin(),
    ],

    devServer: {
        port: 43267,
        contentBase: path.resolve('dist/'),
        overlay: true,
        open: true,
    },
};
