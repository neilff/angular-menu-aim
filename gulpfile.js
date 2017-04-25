var gulp = require('gulp-help')(require('gulp'));

gulp.task('connect', false, function() {
  var connect = require('gulp-connect');
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('html', false, function () {
  gulp.src('./demos/simple/*.html')
    .pipe(connect.reload());
});

gulp.task('js', false, function () {
  gulp.src('./demos/simple/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', false, function () {
  gulp.watch(['./demos/simple/*.html'], ['html']);
  gulp.watch(['./demos/simple/*.js'], ['js']);
});

gulp.task('lint', false, function () {
  var eslint = require('gulp-eslint');
  return gulp.src(['src/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', 'Runs karma and lints code.', ['lint'], function() {
  var karma = require('gulp-karma');

  var testFiles = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'tests/**/*.js'
  ];

  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('css', function () {
  var rename = require('gulp-rename');

  return gulp.src('src/flyout.css')
    .pipe(rename('neilff-flyout.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('build', 'Builds project (concat, ngmin, uglify).', ['css'], function () {
  var uglify = require('gulp-uglify');
  var ngAnnotate = require('gulp-ng-annotate');
  var rename = require('gulp-rename');
  var concat = require('gulp-concat');

  return gulp.src(['src/flyout-tpls.js', 'src/flyout.js'])
    .pipe(ngAnnotate())
    .pipe(concat('neilff-flyout.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('build'));
});

gulp.task('serve', 'Launch dev environment', ['connect', 'watch']);
