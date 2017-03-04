const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

const lintFiles = [
  'app/**/*.js',
  'lib/**/*.js',
  'test/**/*.js',
  '_server.js',
  'gulpfile.js',
  'server.js'
];
const staticFiles = ['app/**/*.html'];

gulp.task('lint', () => {
  return gulp.src(lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
