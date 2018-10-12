// karma configuration

module.exports = function (config) {
  config.set({
    basePath: '../',
    browsers: ['Chrome', 'Firefox'],
    client: {
      captureConsole: true,
      mocha: { ui: 'tdd' }
    },
    files: [
      'tests/index.js',
      { pattern: 'packages/*/{*.test.js,!(node_modules)/**/*.test.js}' },
      { pattern: 'objects/**/*', included: false, served: true }
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal'],
    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap'],
      'packages/*/{*.test.js,!(node_modules)/**/*.test.js}': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true,
      stats: 'minimal'
    },
  })
}