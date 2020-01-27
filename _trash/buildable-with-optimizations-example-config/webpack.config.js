const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

//const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const glob = require('glob');
const path = require('path');

const extractStyles = new ExtractTextPlugin('[name].css');
const extractHtml = new ExtractTextPlugin('[name].html');

const entry = glob.sync('pages/**/*.js', { cwd: 'src/' }).reduce(function(acc, p) {
    const pathObj = path.parse(p);
    const name = path.join(pathObj.dir, pathObj.name); // Strip file extension
    acc[name] = './' + p; // Relative paths without leading dot don't work for some reason
    //acc[name + '.min'] = './' + p;
    return acc;
}, {});

module.exports = {
    context: path.resolve('src/'), // Needs to be an absolute path
    entry: entry,

    output: {
        path: path.resolve('public/'), // Needs to be an absolute path
        filename: '[name].js',
    },

    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['env'] } },
            // To resolve presets locally for `npm link`-ed modules: `query: { presets: [require.resolve('babel-preset-env')] }`

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

            { test: /\.html$/, include: /modules/, loader: 'raw-loader' },

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
        //new webpack.optimize.UglifyJsPlugin({ include: /\.min\.js$/ }),
        //new OptimizeCssAssetsPlugin({ assetNameRegExp: /\.min\.css$/ }), // cssnano required
        new WebpackNotifierPlugin(),
    ],

    devtool: 'source-map',

    devServer: {
        port: 49967,
        contentBase: path.resolve('public/'),
        overlay: true,
        open: true,
        openPage: 'pages/home/',
    },
};
