const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const PROD = (process.env.NODE_ENV === 'production')

module.exports = {
    entry: path.resolve('src/index.ts'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        path: path.resolve('dist'),
        filename: PROD ? 'bundle.min.js' : 'bundle.js',
    },
};