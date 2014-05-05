var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    ngHtml2Js = require("gulp-ng-html2js");

var base = { base: './src/app/' };

// uglify task
gulp.task('js', function() {
    // main app js file
    gulp.src([
            './src/partials/**/*.js',
            './src/app/app.js',
            './src/app/**/*.js',
            '!./src/app/**/*.spec.js'
        ], base)
        .pipe(uglify())
        .pipe(concat("oDirectives.min.js"))
        .pipe(gulp.dest('./dist/app/'))
        .pipe(notify({ message: "Javascript is now ugly!" }));
});

// templatify
gulp.task('templatify', function () {
    gulp.src("./src/partials/*.tmpl.html")
    .pipe(ngHtml2Js({
        moduleName: "envoc.directives.partials",
        prefix: "/oTemplates/"
    }))
    .pipe(gulp.dest("./src/partials"));
});

gulp.task('watch', function () {
    gulp.watch([
            './src/partials/**/*.js',
            './src/app/**/*.js'
    ], base, function () {
        gulp.run('js');
    });
});

gulp.task('default', ['templatify', 'js', 'watch']);