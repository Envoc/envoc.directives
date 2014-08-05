var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    ngmin = require('gulp-ngmin'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    jeditor = require("gulp-json-editor"),
    xeditor = require("gulp-xml-editor"),
    ngHtml2Js = require("gulp-ng-html2js"),
    fs = require('fs'),
    pkg = require('./package.json'),
    git = require('git-rev'),
    semver = require("semver"),
    changelog = require('conventional-changelog');

var base = {
    base: './src/app/'
};

// =====================================
//              Tasks
// =====================================

gulp.task('clean', function() {
    gulp
        .src(['./dist/*'], {
            read: false
        })
        .pipe(clean());
});

// uglify task
gulp.task('js', function() {
    // main app js file
    var datatables_src = [
        './src/_vendor/ui.bootstrap/src/pagination/pagination.js',
        './build/partials/datatables/*.js',
        './build/_vendor/**/*.js',
        './src/datatables/app.js',
        './src/datatables/**/*.js',
        '!./src/**/*.spec.js'
    ];

    var validation_src = [
        './build/partials/validation/*.js',
        './src/validation/app.js',
        './src/validation/**/*.js',
        '!./src/**/*.spec.js'
    ];

    var combined_src = [
        './src/app.js',
        '!./src/**/*.spec.js'
    ]

    build('oDirectives', [combined_src, datatables_src, validation_src]);
    build('oDirectives.datatables', [datatables_src]);
    build('oDirectives.validation', [validation_src]);


    function build(outputFileName, sources) {
        var combined_buid = Array.prototype.concat.apply([], sources)
        var the_source = gulp.src(combined_buid, base);

        the_source
            .pipe(concat(outputFileName + ".js"))
            .pipe(gulp.dest('./dist/'));

        the_source
            .pipe(ngmin())
            .pipe(uglify())
            .pipe(concat(outputFileName + ".min.js"))
            .pipe(gulp.dest('./dist/'));
    }
});

// templatify
gulp.task('templatify', function() {
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

gulp.task('watch', function() {
    gulp.watch('./src/**/*.*', function() {
        gulp.run('build');
    });
});

gulp.task('watch-testing', function() {
    gulp.watch('./src/**/*.*', function() {
        gulp.run('js');
    });
});

gulp.task('bump', function() {
    var from = pkg.lastDocHash;
    var newVer = semver.inc(pkg.version, 'minor');

    git.long(function (str) {
        // bump package.json
        gulp.src('./package.json')
            // .pipe(bump({version:'minor'}))
            .pipe(jeditor({
                'lastDocHash': str,
                'version': newVer
            }))
            .pipe(gulp.dest('./'));

        
        // bump NuGet package
        gulp.src("./Envoc.Directives.nuspec")
            .pipe(xeditor([
                {path: '//version', text: newVer}
            ]))
            .pipe(gulp.dest("./"));


        // create changelog
        var opts = {
            repository: 'https://github.com/Envoc/envoc.directives',
            version: newVer
        };

        if(from) opts.from = from;

        changelog(opts, function(err, log) {
            var stream = fs.createWriteStream("changelog.md");
            stream.once('open', function(fd) {
                stream.write(log);
                stream.end();
            });
        });
    })
});


gulp.task('default', ['templatify', 'js', 'watch']);

gulp.task('build', ['clean', 'templatify', 'js']);

gulp.task('testing', ['js', 'watch-testing']);
