var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var exec = require('gulp-exec');
var browserSync = require('browser-sync').create();

var host = '192.168.0.58'; // the MFW machine host to scp built files

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./sass/*.scss', gulp.series('sass'));
    gulp.watch('./app/**/*.js', gulp.series('concat'));
    gulp.watch('./locale/*.json', gulp.series('locale'));
    gulp.watch('./index.html', gulp.series('index'));
    gulp.watch('./*.js').on('change', browserSync.reload);
});

gulp.task('clean', function () {
    return gulp.src(['mfw-all.js', 'mfw-all.css'], {read: false, allowEmpty: true})
        .pipe(clean());
    });

gulp.task('concat', function() {
    return gulp.src([
            './app/util/**/*.js',
            './app/overrides/**/*.js',
            './app/cmp/**/*.js',
            './app/model/**/*.js',
            './app/store/**/*.js',
            './app/view/**/*.js',
            './app/settings/**/*.js',
            './app/AppController.js',
            './app/App.js'
        ])
        .pipe(concat('mfw-all.js'))
        .pipe(gulp.dest('.'))
        .pipe(exec('scp mfw-all.js root@' + host + ':/www/admin/')); // quick deploy on mfw vm
        // .pipe(browserSync.reload()));
    });

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('mfw-all.css'))
        .pipe(gulp.dest('./'))
        .pipe(exec('scp mfw-all.css root@' + host + ':/www/admin')) // quick deploy on mfw vm
        .pipe(browserSync.stream());
    });

gulp.task('locale', function () {
    return gulp.src('./locale/*.*')
        .pipe(exec('scp -r ./locale/ root@' + host + ':/www/admin/'))
    });

gulp.task('index', function () {
    return gulp.src('./index.html')
        .pipe(exec('scp index.html root@' + host + ':/www/admin/'))
    });

gulp.task('default', gulp.parallel('concat', 'sass', 'locale', 'index'));
