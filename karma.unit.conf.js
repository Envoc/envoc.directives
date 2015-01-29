// Karma configuration
// Generated on Tue Jan 21 2014 11:50:01 GMT-0600 (Central Standard Time)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        files: [
            "src/_vendor/jquery/dist/jquery.min.js",
            "src/_vendor/lodash/dist/lodash.js",
            "src/_vendor/angular/angular.js",
            "src/_vendor/angular-mocks/angular-mocks.js",
            './src/_vendor/ui.bootstrap/src/pagination/pagination.js',
            './src/app.js',
            './build/partials/datatables/*.js',
            './build/_vendor/**/*.js',
            './build/partials/validation/*.js',
            './src/datatables/app.js',
            './src/datatables/**/*.js',
            './src/datatables/**/*.html',
            './src/validation/app.js',
            './src/validation/**/*.js',
            "src/**/*.spec.js"
        ],

        // list of files to exclude
        exclude: [
            "src/_vendor/**/*.spec.js"
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'growl'],

        htmlReporter: {
            outputFile: 'testResults.html'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],

        // preprocessors: {
        //     'validation/**/*.html': 'ng-html2js',
        //     'datatables/**/*.html': 'ng-html2js'
        // },

        // ngHtml2JsPreprocessor: {
        //     // setting this option will create only a single module that contains templates
        //     // from all the files, so you can load them all with module('foo')
        //     moduleName: 'envoc.directives.partials',
        //     prependPrefix: '/oTemplates/'
        // },

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
