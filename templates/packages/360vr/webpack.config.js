const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let PLUGINS = [new HtmlWebpackPlugin({
  template: 'index.html',
  inject: 'head'
}),
  new CopyWebpackPlugin([
    { from: 'images', to: 'images' }
  ])];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: PLUGINS,
  devServer: {
    disableHostCheck: true,
    watchContentBase: true,
    contentBase: './'
  }
};
