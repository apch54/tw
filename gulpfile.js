var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src(["game/src/**/!(boot)*.coffee", "game/src/boot.coffee"])
      .pipe(coffee())
      .pipe(concat('game.js'))
      .pipe(gulp.dest('game/build/'));
});

gulp.task('default', ['coffee', 'watch']);

gulp.task('coffee', function(){
  return gulp.src(["game/src/**/!(boot)*.coffee", "game/src/boot.coffee"])
      .pipe(coffee())
      .pipe(concat('game.js'))
      .pipe(gulp.dest('game/build/'));
});

gulp.task('watch', function() {
  gulp.watch("game/src/**/*.coffee", ['coffee']);
});
