const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: ['babel-polyfill','./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer:{
        contentBase: './dist'
    },
    plugins:[
        new htmlWebpackPlugin({
            fulename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};