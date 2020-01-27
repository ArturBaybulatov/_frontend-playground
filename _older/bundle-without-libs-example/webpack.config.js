module.exports = {
    entry: './src/index.js',
    
    output: {
        path: './dist',
        filename: 'bundle.js',
    },
    
    externals: {
        lodash: '_',
        moment: 'moment',
    },
}
