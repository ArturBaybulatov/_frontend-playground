var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var glob = require('glob');
var path = require('path');


var entry = glob.sync('pages/**/*.js', {cwd: './app/'}).reduce(function(acc, path) {
    acc[path] = './' + path;
    acc[path.replace(/\.js$/, '.min.js')] = './' + path;
    return acc;
}, {});

module.exports = {
    context: path.resolve('./app/'),
    entry: entry,

    output: {
        path: path.resolve('./app/.build/'),
        filename: '[name]',
    },

    module: {
        rules: [
            {test: /\.html$/, loader: 'raw-loader'},

            {test: /\.less$/, use: ExtractTextPlugin.extract({use: [
                {loader: 'css-loader'},
                {loader: 'postcss-loader', options: {plugins: [autoprefixer({browsers: ['last 8 versions']})]}},
                {loader: 'less-loader'},
            ]})},
        ],
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({include: /\.min\.js$/}),
        new ExtractTextPlugin('style.css'),
        new ExtractTextPlugin('style.min.css'),
        new OptimizeCssAssetsPlugin({assetNameRegExp: /\.min\.css$/}), // cssnano required
    ],
};
