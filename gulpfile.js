var gulp = require('gulp'),
    uglify = require('gulp-uglify'), // 压缩js文件
    sass = require('gulp-sass'), // 编译sass
    cleanCSS = require('gulp-clean-css'), // 压缩css文件
    rename = require('gulp-rename'); // 文件重命名
let uglifyES = require('gulp-uglify-es').default;

/* 
 * gulp - js
 */
gulp.task('index.js', function () {
    gulp.src('dev/js/index.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

gulp.task('prism.js', function () {
    gulp.src('dev/js/prism.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

gulp.task('social-share.js', function () {
    gulp.src('dev/js/social-share.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

gulp.task('Valine.js', function () {
    gulp.src('dev/js/Valine.js')
        .pipe(uglifyES())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

gulp.task('toc.js', function () {
    gulp.src('dev/js/toc.js')
        .pipe(uglifyES())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

/* 
 * gulp - css
 */
gulp.task('app.css', function () {
    gulp.src('dev/sass/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('dev/sass'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('share.css', function () {
    gulp.src('dev/sass/share.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('prism.css', function () {
    gulp.src('dev/sass/prism.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('github-markdown.css', function () {
    gulp.src('dev/sass/github-markdown.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('sass', ['app.css', 'share.css', 'prism.css', 'github-markdown.css',]);

gulp.task('script', ['index.js', 'social-share.js', 'prism.js', 'Valine.js', 'toc.js']);

gulp.task('default', function () {
    gulp.run('sass', 'script');
    gulp.watch('dev/sass/*.scss', function () {
        gulp.run('sass');
    });
    gulp.watch('dev/js/*.js', function () {
        gulp.run('script');
    });
});