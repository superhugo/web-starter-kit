var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Compile Sass
gulp.task('styles', function() {
  return gulp.src('assets/styles/**/*.scss')
    .pipe($.rubySass({ style: 'expanded' }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist/styles'));
});

// Minify JS
gulp.task('scripts', function() {
  return gulp.src('assets/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('app.js'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.uglify({ preserveComments: 'some' }))
    .pipe(gulp.dest('dist/scripts'))
});

// Copy fonts to dist folder
gulp.task('fonts', function () {
  return gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// Clean dist folder
gulp.task('clean', function() {
  return gulp.src('dist', { read: false })
    .pipe($.clean());
});

// Watch files for changes and reload
gulp.task('watch', function () {
  gulp.watch('assets/styles/**/*.scss', ['styles', reload]);
  gulp.watch('assets/scripts/**/*.js', ['scripts', reload]);
  gulp.watch('assets/fonts/**/*', ['fonts', reload]);
  gulp.watch('assets/images/**/*', ['images', reload]);
  gulp.watch('**/*.html', reload);
});

// Build and optimize assets
gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'scripts', 'images', 'fonts');
});

// Watch and serve files
gulp.task('serve', ['default', 'watch'], function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
