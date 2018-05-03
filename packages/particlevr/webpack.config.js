const webpack = require('webpack');

let PLUGINS = [];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
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
