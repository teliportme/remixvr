const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

let PLUGINS = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    inject: 'head'
  })
  // new ScriptExtHtmlWebpackPlugin({
  //   defaultAttribute: 'async'
  // })
];
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
