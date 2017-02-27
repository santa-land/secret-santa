/*
* @Author: Ali
* @Date:   2017-02-26 10:38:27
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-26 21:42:33
*/

'use strict';
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const jsmin = require('gulp-jsmin');
const processhtml = require('gulp-processhtml');
const htmlmin = require('gulp-htmlmin');
// const watch = require('gulp-watch');

// html
gulp.task('process-html', () => {
    return gulp.src('./app/*.html').pipe(processhtml()).pipe(gulp.dest('./public'));
});

gulp.task('minify-html', ['process-html'],() => {
    return gulp.src('./public/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('./public'));
});


// css
gulp.task('sass', () => {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/scss/css'));
});

gulp.task('concat-css', ['sass'],() => {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css', './app/scss/css/**/*']).pipe(concat('main.css')).pipe(gulp.dest('./public/css'));
});

gulp.task('minify-css', ['concat-css'], () => {
  return gulp.src('./public/css/main.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/css'));
});

// images
gulp.task('images', () => {
    return gulp.src('app/images/**/*').pipe(imagemin()).pipe(gulp.dest('public/images'));
    }
);

// JS
gulp.task('js-concat', () => {
    return gulp.src(['./node_modules/angular/angular.js','./app/js/app.js', './app/js/services/santafactory.js', './app/js/controllers/secret-santa.js']).pipe(concat('main.js')).pipe(gulp.dest('./public/js'));
});

gulp.task('minify-js', ['js-concat'], () => {
    gulp.src('./public/js/main.js')
        .pipe(jsmin())
        .pipe(gulp.dest('public/js'));
});

// watcher
// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch('./app/*.html', ['minify-html']);
    gulp.watch('./app/scss/**/*.scss', ['minify-css']);
    gulp.watch('./app/js/**/*', ['minify-js']);
    gulp.watch('./app.images/**/*', ['images']);
});

// default
gulp.task('default', ['images', 'minify-js', 'minify-css', 'minify-html'], () => {
    // This will only run if the dependency tasks are successful...
});