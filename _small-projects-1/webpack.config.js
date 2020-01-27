const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');


const extractStyles = new ExtractTextPlugin('[name].css');
const extractHtml = new ExtractTextPlugin('[name].html');

const entry = glob.sync('*/**/pages/**/*.js', { cwd: 'apps/', ignore: '**/_public/**' }).reduce(function(acc, p) {
    const pathObj = path.parse(p);

    const buildDirArr = path.normalize(pathObj.dir).split(path.sep);
    buildDirArr.splice(buildDirArr.indexOf('pages'), 0, '_public');

    const buildDir = path.join.apply(path, buildDirArr);
    const name = path.join(buildDir, pathObj.name); // Strip file extension

    acc[name] = './' + p; // Relative paths without leading dot don't work for some reason

    return acc;
}, {});

module.exports = {
    devtool: 'source-map',
    context: path.resolve('apps/'), // Needs to be an absolute path
    entry: entry,

    output: {
        path: path.resolve('apps/'), // Needs to be an absolute path
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',

                include: [
                    path.resolve('apps/'),
                    //path.resolve('node_modules/components-frontend/'), // External ES modules
                ],

                query: { presets: [require.resolve('babel-preset-env')] }, // Important for external symlinked modules
            },

            { test: /\.html$/, loader: 'raw-loader' },

            {
                test: /\.html$/,
                include: /pages/,

                use: extractHtml.extract({
                    use: [
                        { loader: 'raw-loader' },
                        { loader: 'nunjucks-html-loader', options: { searchPaths: ['apps/'] } },
                    ],
                }),
            },

            {
                test: /\.less$/,

                use: extractStyles.extract({
                    use: [
                        { loader: 'raw-loader' }, // Instead of `css-loader` to prevent resolving `url(...)` paths
                        { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 8 versions'] })] } },
                        { loader: 'less-loader' },
                    ],
                }),
            },
        ],
    },

    plugins: [
        extractStyles,
        extractHtml,
        new WebpackNotifierPlugin(),
    ],

    devServer: {
        //host: '0.0.0.0',
        port: 52921,
        //public: 'public-computer-name.corp.ru:52921',
        //public: 'localhost:52921',
        //disableHostCheck: true, // Experim.
        contentBase: path.resolve('apps/'),
        open: process.env.npm_config_open === 'true',
        openPage: 'webpack-dev-server',
        overlay: true,
    },
};
