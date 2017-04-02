var gulp             = require('gulp'),
    sass             = require('gulp-sass'),
    browserSync      = require('browser-sync').create(),
    autoprefix       = require('gulp-autoprefixer'),
    watch            = require('gulp-watch'),
    uglify           = require('gulp-uglify'),
    rigger           = require('gulp-rigger'),
    cssmin           = require('gulp-minify-css'),
    imagemin         = require('gulp-imagemin'),
    pngquant         = require('imagemin-pngquant'),
    rimraf           = require('rimraf'),
    reload           = browserSync.reload,
    gnf              = require('gulp-npm-files');


var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        style: 'app/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/*.js',
        style: 'app/style/**/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};
    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: "./dist/"
            }
        });
    });

    gulp.task('html:build', function () {
        gulp.src(path.app.html)
            .pipe(rigger())
            .pipe(gulp.dest(path.dist.html))
            .pipe(reload({stream: true}));
    });
    gulp.task('js:build', function() {
        gulp.src(path.app.js)
            .pipe(gulp.dest(path.dist.js))
    });
    gulp.task('style:build', function () {
        gulp.src(path.app.style)
            .pipe(sass())
            .pipe(autoprefix())
            .pipe(cssmin())
            .pipe(gulp.dest(path.dist.css))
            .pipe(reload({stream: true}));
    });
    gulp.task('image:build', function () {
        gulp.src(path.app.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.dist.img))
            .pipe(reload({stream: true}));
    });
    gulp.task('fonts:build', function() {
        gulp.src(path.app.fonts)
            .pipe(gulp.dest(path.dist.fonts))
    });
    gulp.task('copyNpmDependenciesAtDifferentFolder', function() {
        gulp
            .src(gnf(null, 'package.json'), {base:'./'})
            .pipe(gulp.dest('./dist/lib'));
    });
    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            gulp.start('style:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
    });
    gulp.task('build', [
        'html:build',
        'js:build',
        'style:build',
        'fonts:build',
        'image:build'
    ]);
    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });
    gulp.task('default', ['copyNpmDependenciesAtDifferentFolder', 'build', 'browser-sync', 'watch']);