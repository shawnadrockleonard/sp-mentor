

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
       { src: 'jquery/dist/jquery*.*', dest: 'jquery/' },
       { src: 'jquery.validation/dist/jquery**', dest: 'jquery/' },
       { src: 'knockout/dist/*.js', dest: 'knockout/' },
       { src: 'knockout-validation/dist/*.js', dest: 'knockout/' },
       { src: 'knockout-mapping/build/output/*.js', dest: 'knockout/' },
       { src: 'modernizer/modernizr.js', dest: 'modernizer/' },
       { src: 'moment/moment*js', dest: 'moment/' },
       { src: 'moment/min/moment*js', dest: 'moment/' }
    ],
    fonts: [
       { src: 'bootstrap/dist/js/bootstrap*js', dest: 'bootstrap/js/' },
       { src: 'bootstrap/dist/css/bootstrap*css', dest: 'bootstrap/css/' },
       { src: 'bootstrap/dist/fonts/*.*', dest: 'bootstrap/fonts/' },
       { src: 'font-awesome/css/*.*', base: './', dest: '/' },
       { src: 'font-awesome/fonts/*.*', base: './', dest: '/' },
    ]
};

gulp.task('default', ['buildApp'], function () {
    return true;
});

gulp.task('buildApp', ['copy:bower:libs', 'copy:font:libs'], function (callback) {
    runSequence(
        ['min:js', 'min:css', 'min:app:js'], callback);
});

gulp.task('min:css', function () {
    return gulp.src(['./content/css/*.css', '!./content/css/*.min.css'])
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./content/css'));
});

gulp.task('min:js', function () {
    return gulp.src(['./content/js/*.js', '!./content/js/*.min.js'])
     .pipe(uglify())
     .pipe(rename({ suffix: '.min' }))
     .pipe(gulp.dest('./content/js'));
});

gulp.task('min:app:js', function () {
    return gulp.src(['./' + paths.mentorPath + '*.js', '!./' + paths.mentorPath + '*.min.js'])
     .pipe(uglify({ outSourceMap: true }))
     .pipe(rename({ suffix: '.min' }))
     .pipe(gulp.dest('./' + paths.mentorPath));
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

/**
 * copy npm libraries
 */
gulp.task('copy:font:libs', function () {
    paths.fonts.forEach(function (vendorPkg, vendorIdx) {
        if (typeof vendorPkg.base !== typeof undefined) {
            gulp.src(paths.bowerPath + vendorPkg.src, {
                base: vendorPkg.base + paths.bowerPath
            }).pipe(gulp.dest(paths.vendorPath + vendorPkg.dest));
        }
        else {
            gulp.src(paths.bowerPath + vendorPkg.src)
                .pipe(gulp.dest(paths.vendorPath + vendorPkg.dest));
        }
    });
});