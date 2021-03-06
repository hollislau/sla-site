const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

var nodemonStream;

const lintFiles = [
  'app/**/*.js',
  'lib/**/*.js',
  'models/**/*.js',
  'routes/**/*.js',
  'test/**/*.js',
  '*.js'
];
const staticFiles = ['app/**/*.html'];

gulp.task('lint', () => {
  return gulp.src(lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('server:test', () => {
  return gulp.src('test/server/**/*_test.js')
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('static:dev', () => {
  return gulp.src(staticFiles)
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('static:pro', () => {
  return gulp.src(staticFiles)
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build:dev'], () => {
  if (nodemonStream) {
    nodemonStream.emit('restart');
  } else {
    nodemonStream = nodemon({
      script: 'server.js',
      watch: ['lib', '_server.js', 'server.js']
    })
    .on('restart', () => {
      process.stdout.write('Server restarted!\n');
    })
    .on('crash', () => {
      process.stderr.write('Server crashed!\n');
    });
  }

  livereload.listen();
  gulp.watch(staticFiles, ['static:dev']);
  gulp.watch('gulpfile.js', ['watch']);
});

gulp.task('test', ['server:test']);
gulp.task('build:dev', ['static:dev']);
gulp.task('build:pro', ['static:pro']);
gulp.task('default', ['lint', 'test']);
