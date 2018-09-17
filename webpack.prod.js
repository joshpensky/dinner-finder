path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/index',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        extractComments: true,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_URL: JSON.stringify('/api/v1'),
      },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'build/index.html'),
        to: path.resolve(__dirname, 'dist/index.html'),
        toType: 'file',
      },
      {
        from: path.resolve(__dirname, 'src/static'),
        to: path.resolve(__dirname, 'dist/static'),
        toType: 'dir',
      },
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
  ],
};
