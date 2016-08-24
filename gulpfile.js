var gulp = require('gulp'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    jeditor = require("gulp-json-editor"),
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

    var envoc_src = [
        './src/envoc/envoc-module.js',
        './src/envoc/**/*.js'
    ]

    var combined_src = [
        './src/app.js',
        '!./src/**/*.spec.js'
    ]

    gulp.src(['./build_head.js'])
        .pipe(replace(/\{version\}/g, pkg.version))
        .pipe(gulp.dest('./build/'));

    build('oDirectives', [combined_src, datatables_src, envoc_src]);
    build('oDirectives.datatables', [datatables_src]);

    function build(outputFileName, sources) {
        var combined_build = Array.prototype.concat.apply([], sources)
        combined_build.unshift('./build/build_head.js');
        

        //console.log(combined_build);
        //
        var the_source = gulp.src(combined_build, base);

        the_source
            .pipe(ngAnnotate())
            .pipe(concat(outputFileName + ".js"))
            .pipe(gulp.dest('./dist/'));

        the_source
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(concat(outputFileName + ".min.js"))
            .pipe(gulp.dest('./dist/'));
    }
});

// templatify
gulp.task('templatify', function() {
    gulp
        .src("./src/_vendor/ui.bootstrap/template/pagination/*.html")
        .pipe(ngHtml2Js({
            moduleName: "envoc.directives.partials",
            prefix: "template/pagination/"
        }))
        .pipe(gulp.dest("./build/_vendor/templates"));

    return gulp
        .src("./src/**/*.tmpl.html")
        .pipe(ngHtml2Js({
            moduleName: "envoc.directives.partials",
            prefix: "/oTemplates/"
        }))
        .pipe(gulp.dest("./build/partials"));
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.*', function() {
        gulp.run('build');
    });
});

gulp.task('watch-testing', function() {
    gulp.watch('./src/**/*.*', function() {
        gulp.run('templatify');
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

gulp.task('build-bump', function() {
    var newVer = semver.inc(pkg.version, 'patch');

    // bump package.json
    gulp.src('./package.json')
        .pipe(jeditor({
            'version': newVer
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['build-bump', 'templatify', 'js', 'watch']);

gulp.task('build', ['clean', 'templatify', 'js']);

gulp.task('testing', ['js', 'watch-testing']);
