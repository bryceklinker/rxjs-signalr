var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/tests.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      'src/tests.ts': ['webpack']
    },
    reporters: ['spec','kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    mime: {
      'text/x-typescript': ['ts']
    },
    webpack: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'awesome-typescript-loader'
          }
        ]
      },
      plugins: [
        new webpack.ProvidePlugin({
          'window.jQuery': 'jquery'
        })
      ]
    }
  })
}
