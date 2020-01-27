const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const glob = require('glob');
const path = require('path');


const extractStyles = new ExtractTextPlugin('[name].css');
const extractHtml = new ExtractTextPlugin('[name].html');

const entry = glob.sync('pages/**/*.js', { cwd: 'src/' }).reduce(function(acc, p) {
    const pathObj = path.parse(p);
    const name = path.join(pathObj.dir, pathObj.name); // Strip file extension
    acc[name] = './' + p; // Relative paths without leading dot don't work for some reason
    return acc;
}, {});

module.exports = {
    devtool: 'source-map',
    context: path.resolve('src/'), // Needs to be an absolute path
    entry: entry,

    output: {
        path: path.resolve('public/'), // Needs to be an absolute path
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: [require.resolve('babel-preset-env')] }, // Important
            },

            { test: /\.html$/, loader: 'raw-loader' },

            {
                test: /\.html$/,
                include: path.resolve('src/pages/'),

                use: extractHtml.extract({
                    use: [
                        { loader: 'raw-loader' },
                        { loader: 'nunjucks-html-loader', options: { searchPaths: ['src/'] } }, // "options" vs "query"?
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
        port: 49967,
        contentBase: path.resolve('public/'),
        overlay: true,
        open: true,
        openPage: 'pages/home/',
    },
};
