/// <binding AfterBuild='build' />
'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var lessGlobPlugin = require('less-plugin-glob');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifyCss = require('gulp-csso');
var rename = require('gulp-rename');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var gutil = require('gulp-util');


// Styles -----------------------------------------------------------------

gulp.task('_styles', function() {
    return gulp.src('./app/_imports.less')
        .pipe(plumber({errorHandler: errorHandler}))
        .pipe(less({plugins: [lessGlobPlugin]}))
        .pipe(postcss([autoprefixer({browsers: ['last 8 versions']})]))
        .pipe(gulp.dest('./app/build/'))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./app/build/'));
});


// Scripts ----------------------------------------------------------------

gulp.task('_scripts', function(done) {
    webpack(webpackConfig, function(err, stats) {
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});


// Grouped build task -----------------------------------------------------

gulp.task('build', [
    '_styles',
    '_scripts',
]);


// Watching ---------------------------------------------------------------

gulp.task('watch', function() {
    gulp.start('_styles');
    gulp.watch(['./app/**/*.less'], ['_styles']);

    webpack(Object.assign({}, webpackConfig, {watch: true}), function(err, stats) {
        gutil.log('[webpack]', stats.toString({colors: true}));
    });
});


// Helper stuff -----------------------------------------------------------

function errorHandler(err) {
    console.log(err.toString());
    this.emit('end');
}
