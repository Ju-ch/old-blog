var gulp = require('gulp'),
    uglify = require('gulp-uglify'), // 压缩js文件
    sass = require('gulp-sass'), // 编译sass
    cleanCSS = require('gulp-clean-css'), // 压缩css文件
    rename = require('gulp-rename'), // 文件重命名
    imagemin = require('gulp-imagemin'); // 压缩图片
let uglifyES = require('gulp-uglify-es').default;

/* 
 * gulp - js
 */
gulp.task('index.js', () =>
    gulp.src('dev/js/index.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
);

gulp.task('prism.js', () =>
    gulp.src('dev/js/prism.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
);


gulp.task('Valine.js', () =>
    gulp.src('dev/js/Valine.js')
        .pipe(uglifyES())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
);

gulp.task('toc.js', () =>
    gulp.src('dev/js/toc.js')
        .pipe(uglifyES())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
);

/* 
 * gulp - css
 */
gulp.task('app.css', () =>
    gulp.src('dev/sass/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('dev/sass'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
);

gulp.task('prism.css', () =>
    gulp.src('dev/sass/prism.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
);

gulp.task('github-markdown.css', () =>
    gulp.src('dev/sass/github-markdown.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
);

/*
 * gulp - Image
 */

gulp.task('img', () =>
    gulp.src('dev/img/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('assets/img'))
);

gulp.task('sass', ['app.css', 'prism.css', 'github-markdown.css',]);

gulp.task('script', ['index.js', 'prism.js', 'Valine.js', 'toc.js']);

gulp.task('default', function () {
    gulp.run('sass', 'script', 'img');
    gulp.watch('dev/sass/*.scss', () =>
        gulp.run('sass')
    );
    gulp.watch('dev/js/*.js', () =>
        gulp.run('script')
    );
    gulp.watch('dev/img*.{jpg,jpeg,png}', () =>
        gulp.run('img')
    );
});