module.exports = function(config) {
  'use strict';

  config.set({
    basePath: '',
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/flyout.js',
      'src/flyout-tpls.js',
      'tests/utils.js',
      'tests/flyout.test.js',
      'tests/flyout-tpls.test.js'
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],
    exclude: [],
    reporters: ['progress', 'coverage'],
    port: 9876,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false,
    preprocessors: {
      'src/**/!(*test).js': 'coverage'
    },
    coverageReporter: {
      type: 'html',
      dir: './coverage/'
    }
  });
};
