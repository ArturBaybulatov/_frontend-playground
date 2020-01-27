'use strict';

var gulp = require('gulp');
var responsive = require('gulp-responsive');


gulp.task('default', function() {
    gulp.src('./images/**/*.{jpg,jpeg,png,gif}')
        .pipe(responsive({'**/*': {
            quality: 1,
            withMetadata: false,
        }}))

        .pipe(gulp.dest('./.resized/'));
});
