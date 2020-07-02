module.exports = function() {
    const gulp = require('gulp');
    const newer = require('gulp-newer');
    gulp.task('copy-js-templates', function(){
        return gulp.src([
            'src/views/admin/partials/user-table-template.twig',
            'src/views/admin/partials/page-table-template.twig',
            'src/views/admin/partials/comment-table-template.twig',
            'src/views/admin/partials/menu-list-template.twig',
            'src/views/admin/partials/menu-list-item-template.twig',
            'src/views/admin/partials/selected-menu-items-template.twig',
            'src/views/admin/partials/file-table-template.twig',
            'src/views/admin/partials/add-edit-user-modal-template.twig',
            'src/views/admin/partials/add-edit-menu-modal-template.twig',
            'src/views/admin/partials/add-edit-comment-modal-template.twig',
            'src/views/admin/partials/add-edit-setting-modal-template.twig',
            'src/views/admin/partials/menu-list-page-select-options-template.twig',
            'src/views/admin/partials/page-select-options-template.twig',
            'src/views/admin/partials/setting-page-data-template.twig',
            'src/views/admin/partials/themes-page-data-template.twig',
            'src/views/admin/partials/media-modal-template.twig',
            "src/views/admin/partials/media-modal-content-template.twig",
            'src/views/admin/partials/single-comment-template.twig',
            'src/views/admin/partials/single-comment-form-template.twig',
            'src/views/partials/public-single-comment-template.twig',
            'src/views/admin/partials/add-edit-codeblock-modal-template.twig',
            'src/views/admin/partials/codeblock-table-template.twig',
            'src/views/partials/pagination.twig'
        ])
        .pipe(newer('src/static/js/templates'))
        .pipe(gulp.dest('src/static/js/templates'))
        .on('end', function(){
            console.log('copied newer templates for js');
        });
    });
}