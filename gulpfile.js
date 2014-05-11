var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    ngHtml2Js = require("gulp-ng-html2js");

var base = { base: './src/app/' };

// =====================================
//              Tasks
// =====================================

gulp.task('clean', function(){
  gulp
    .src(['./dist/*'], {read:false})
    .pipe(clean());
});

// uglify task
gulp.task('js', function() {
    // main app js file
    gulp.src([
            './src/_vendor/ui.bootstrap/src/pagination/pagination.js',
            // './src/_vendor/moment/moment.js',
            './build/partials/**/*.js',
            './build/_vendor/**/*.js',
            './src/app.js',
            './src/validation/**/*.js',
            './src/datatables/**/*.js',
            '!./src/**/*.spec.js'
        ], base)
        //.pipe(uglify())
        .pipe(concat("oDirectives.min.js"))
        .pipe(gulp.dest('./dist/'));
});

// templatify
gulp.task('templatify', function () {
    gulp
        .src("./src/**/*.tmpl.html")
        .pipe(ngHtml2Js({
            moduleName: "envoc.directives.partials",
            prefix: "/oTemplates/"
        }))
        .pipe(gulp.dest("./build/partials"));

    gulp
        .src("./src/_vendor/ui.bootstrap/template/pagination/*.html")
        .pipe(ngHtml2Js({
            moduleName: "envoc.directives.partials",
            prefix: "template/pagination/"
        }))
        .pipe(gulp.dest("./build/_vendor/templates"));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.*', function () {
        gulp.run('build');
    });
});

gulp.task('default', ['templatify', 'js', 'watch']);

gulp.task('build', ['clean', 'templatify', 'js']);