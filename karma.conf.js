// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['bower', 'jasmine'],

    reporters: ['progress', 'coverage'],

    //components
    bowerPackages: [
      'jquery',
      'ckeditor',
      'angular',
      'angular-bootstrap',
      'angular-cookies',
      'angular-eyesight',
      'angular-google-maps',
      'angular-messages',
      'angular-notify',
      'angular-resource',
      'angular-sanitize',
      'angular-socket-io',
      'angular-spinkit',
      'angular-ui-router',
      'angular-ui-select',
      'angular-ui-tree',
      'angular-mocks',
      'async',
      'bootstrap-sass-official',
      'es5-shim',
      'json3',
      'lodash',
      'ng-ckeditor',
      'ng-file-upload',
      'ng-file-upload-shim',
      'trNgGrid'
    ],

    // list of files / patterns to load in the browser
    files: [
      'client/app/app.js',
      'client/app/**/*.js',
      'client/components/**/*.js',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
      '**/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'tapApp'
    },

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'},
        {type: 'json', subdir: 'report-json'},
        {type: 'text-summary'}
      ]
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    browserDisconnectTimeout: 10000,

    browserDisconnectTolerance: 1,

    browserNoActivityTimeout: 60000
  });
};
