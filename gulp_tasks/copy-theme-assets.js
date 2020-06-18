module.exports = function() {
    const gulp = require('gulp');
    const newer = require('gulp-newer');
    gulp.task('copy-theme-assets', function(){
        return gulp.src([
            'src/views/themes/**/*',
            '!src/views/themes/**/*.twig',
        ])
        .pipe(newer('src/static/themes'))
        .pipe(gulp.dest('src/static/themes'))
        .on('end', function(){
            console.log('copied newer theme assets');
        });
    });
}