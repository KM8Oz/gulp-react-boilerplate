var gulp = require('gulp');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new lessPluginAutoprefix({ browsers: ['last 2 versions'] });
var path = require('path');
var swPrecache = require('sw-precache');
var babel = require('gulp-babel');

var paths = {
  src: './'
};

gulp.task('service-worker', function(callback) {
  swPrecache.write(path.join(paths.src, 'service-worker.js'), {
    staticFileGlobs: [
      paths.src + 'index.html',
      paths.src + 'build/*'
    ],
    importScripts: [
      'node_modules/sw-toolbox/sw-toolbox.js',
      'build/toolbox-script.js'
    ],
    stripPrefix: paths.src
  }, callback);
});

gulp.task('processJS', function() {
  gulp.src('src/scripts/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({ presets: ['latest']}))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/scripts'));
});

gulp.task('processReact', function() {
  gulp.src('src/react/*.jsx')
  .pipe(sourcemaps.init())
  .pipe(babel({ presets: ['react','latest']}))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/react'));
});

gulp.task('processLESS', function() {
  gulp.src('src/styles/*.less')
  .pipe(sourcemaps.init())
  .pipe(less({ plugins: [lessAutoprefix]}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/styles'));
});

gulp.task('default', ['serve']);

gulp.task('serve', ['processLESS', 'processJS', 'processReact', 'service-worker'], function() {
  browserSync.init({
    server: '.',
    port: 3000
  });
  gulp.watch('src/styles/*.less', ['processLESS']).on('change', browserSync.reload);
  gulp.watch('src/scripts/*.js', ['processJS']).on('change', browserSync.reload);
  gulp.watch('src/react/*.jsx', ['processReact']).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
});
