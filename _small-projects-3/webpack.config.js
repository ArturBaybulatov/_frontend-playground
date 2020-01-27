const glob = require('glob');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // Use with `npm install extract-text-webpack-plugin@next`
const WebpackNotifierPlugin = require('webpack-notifier');


const entry = glob.sync('pages/**/*.js', {cwd: 'src/'}).reduce((entry, pathName) => {
    const pathNameWithoutExt = path.join(path.dirname(pathName), path.parse(pathName).name);
    entry[pathNameWithoutExt] = `./${pathName}`; // Leading dot is crucial
    return entry;
}, {});

entry.polyfill = './polyfill.js';


const extractStyles = new ExtractTextPlugin('[name].css');
const extractHtml = new ExtractTextPlugin('[name].html');


const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;


module.exports = {
    context: path.resolve('src/'), // Absolute path required

    entry,

    output: {
        path: path.resolve('public/'), // Absolute path required
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve('src/'),
                use: ['babel-loader'].concat(process.env.npm_config_disable_linting === 'true' ? [] : 'eslint-loader'),
            },

            {
                test: /\.less$/,
                include: path.resolve('src/'),
                use: extractStyles.extract({use: ['raw-loader', 'postcss-loader', 'less-loader']}),
            },

            {
                test: /\.html$/,
                include: path.resolve('src/modules/'),
                use: 'raw-loader',
            },

            {
                test: /\.html$/,
                include: path.resolve('src/pages/'),

                use: extractHtml.extract({
                    use: [
                        {loader: 'raw-loader'},
                        {loader: 'nunjucks-html-loader', options: {searchPaths: ['src/']}},
                    ],
                }),
            },
        ],
    },

    plugins: [
        extractStyles,
        extractHtml,
        new WebpackNotifierPlugin({alwaysNotify: !isDevServer}),
    ],

    mode: isDevServer ? 'development' : 'production',
    devtool: 'source-map',
    // optimization: { minimize: false },

    devServer: {
        host: '0.0.0.0',
        port: 51950,
        contentBase: path.resolve('public/'),
        open: process.env.npm_config_open === 'true',
        openPage: 'webpack-dev-server',
        overlay: true,
    },
};
