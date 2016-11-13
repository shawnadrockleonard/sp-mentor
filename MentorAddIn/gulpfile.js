
"use strict";

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    timeString = "-" + (new Date()).getTime().toString();

var paths = {
    app: ['content/js/app/**/*.js', 'content/css/**/*.css'],
    mentorPath: 'content/js/mentor/',
    vendorPath: 'content/js/vendor/',
    bowerPath: 'bower_components/',
    modulePath: 'node_modules/',
    libs: [
       { src: 'jquery/dist/jquery*min*js', dest: 'jquery/' },
       { src: 'jquery.validation/dist/jquery**', dest: 'jquery/' },
       { src: 'knockout/dist/knockout.js', dest: 'knockout/' },
       { src: 'knockout-validation/dist/*min*.js', dest: 'knockout/' },
       { src: 'knockout-mapping/build/output/*.js', dest: 'knockout/' },
       { src: 'modernizer/modernizr.js', dest: 'modernizer/' },
       { src: 'moment/moment*js', dest: 'moment/' },
       { src: 'moment/min/moment*js', dest: 'moment/' },
       { src: 'bootstrap/dist/js/bootstrap*min*js', dest: 'bootstrap/js/' },
       { src: 'bootstrap/dist/css/bootstrap*min*css', dest: 'bootstrap/css/' },
       { src: 'bootstrap/dist/fonts/*.*', dest: 'bootstrap/fonts/' },
       { src: 'font-awesome/css/*min*', base: './', dest: '/' },
       { src: 'font-awesome/fonts/*.*', base: './', dest: '/' },
    ]
};

gulp.task('default', function () {
    // place code for your default task here
});

/**
 * copy bower packages
 */
gulp.task('copy:bower:libs', function () {
    paths.libs.forEach(function (vendorPkg, vendorIdx) {
        if (typeof vendorPkg.base !== typeof undefined) {
            gulp.src(paths.bowerPath + vendorPkg.src, {
                base: vendorPkg.base + paths.bowerPath
            }).pipe(gulp.dest('./' + paths.vendorPath + vendorPkg.dest));
        }
        else {
            gulp.src(paths.bowerPath + vendorPkg.src)
                .pipe(gulp.dest('./' + paths.vendorPath + vendorPkg.dest));
        }
    });
});
