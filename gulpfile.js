const gulp = require('gulp');
const ts = require('gulp-typescript');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  return tsProject.src()
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('devBuild', () => {
  return tsProject.src()
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
  return tsProject.src()
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base))
    .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
  watch('./**/*.ts', gulp.series('devBuild'));
});

gulp.task('default', gulp.series('build'));