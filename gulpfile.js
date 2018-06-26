var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./sass/*.scss', gulp.series('sass'));
    gulp.watch('./app/**/*.js', gulp.series('concat'));
    gulp.watch('./res/*.js').on('change', browserSync.reload);
});

gulp.task('clean', function () {
    return gulp.src(['res/mfw-all.js', 'res/mfw-all.css'], {read: false, allowEmpty: true})
        .pipe(clean());
    });

gulp.task('concat', function() {
    return gulp.src([
            './app/util/**/*.js',
            './app/cmp/**/*.js',
            './app/model/**/*.js',
            './app/store/**/*.js',
            './app/view/**/*.js',
            './app/AppController.js',
            './app/App.js'
        ])
        .pipe(concat('mfw-all.js'))
        .pipe(gulp.dest('./res/'));
        // .pipe(browserSync.reload()));
    });

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('mfw-all.css'))
        .pipe(gulp.dest('./res/'))
        .pipe(browserSync.stream());
    });

gulp.task('default', gulp.parallel('concat', 'sass'));

// const defaultTasks = gulp.parallel('concat', 'sass')

// export default defaultTasks
