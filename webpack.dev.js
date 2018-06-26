path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: './src/index',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'build',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        API_URL: JSON.stringify('http://localhost:3001/api/v1'),
      },
    }),
    new WriteFilePlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/static'),
        to: path.resolve(__dirname, 'build/static'),
        toType: 'dir',
      },
    ]),
  ],
  devServer: {
    contentBase: 'build/',
    compress: true,
    port: 3000,
    inline: true,
    publicPath: 'static/',
    index: '200.html',
    historyApiFallback: {
      index: '200.html',
    },
  },
};
