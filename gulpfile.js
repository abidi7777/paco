const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const del = require('del');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const path = require('path');
const rename = require('gulp-rename');
const through2 = require('through2');

gulp.task('clean', () => del(['./dist/**/*']));

gulp.task('js', () => gulp
  .src(path.join(__dirname, 'src', 'paco.js'))
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest(path.join(__dirname, 'dist'))));

gulp.task('js:module', () => gulp
  .src(path.join(__dirname, 'src', 'paco.js'))
  .pipe(babel({ presets: [['@babel/preset-env', { modules: false }]] }))
  .pipe(uglify())
  .pipe(rename('paco.module.js'))
  .pipe(gulp.dest(path.join(__dirname, 'dist'))));

gulp.task('js:web', () => {
  function browserified(file, _, cb) {
    browserify(file.path)
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle((__, buf) => {
        file.contents = buf;

        cb(null, file);
      });
  }

  return gulp
    .src(path.join(__dirname, 'src', 'paco.js'))
    .pipe(through2.obj(browserified))
    .pipe(uglify())
    .pipe(rename('paco.web.js'))
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
});

gulp.task('default', gulp.series('clean', 'js', 'js:module', 'js:web'));
