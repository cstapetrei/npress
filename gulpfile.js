const gulp = require('gulp');
const fs = require('fs');
const newer = require('gulp-newer');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function(){
    return del('dist/**', {force:true});
});

gulp.task('tsc', function () {
    let tsResult = tsProject.src()
                .pipe(sourcemaps.init())
                .pipe(tsProject());
    return tsResult
        .js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});

require("./gulp_tasks/copy-templates")();
require("./gulp_tasks/copy-theme-assets")();

gulp.task('folders', function () {
    // delete directory recursively
    let dir = './build';
    try {
        fs.rmdirSync(dir, { recursive: true });
        console.log(`${dir} folder deleted`);
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }
    return gulp.src(['server.ts'], {read: false})
        .pipe(gulp.dest('build/src/static'))
        .pipe(gulp.dest('build/src/views'))
        .pipe(gulp.dest('build/src/logs'));
});
gulp.task('copy-static', function () {
    return gulp.src(['src/static/**/*']).pipe(gulp.dest('build/src/static'));
});

gulp.task('copy-views', function () {
    return gulp.src(['src/views/**/*']).pipe(gulp.dest('build/src/views'));
});

gulp.task('copy-logs', function () {
    return gulp.src(['src/logs/**/*']).pipe(gulp.dest('build/src/logs'));
});

gulp.task('default', gulp.series('folders', 'tsc', gulp.parallel('copy-js-templates', 'copy-theme-assets', 'copy-static', 'copy-views', 'copy-logs')));