var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var exec = require('gulp-exec');
var browserSync = require('browser-sync').create();
var fs = require("fs");

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

gulp.task('index', function () {
    return gulp.src('./index.html')
        .pipe(exec('scp index.html root@' + host + ':/www/admin/'))
    });


gulp.task('translations', function () {
    return gulp.src('./locale/**/*.*')
        .pipe(exec('scp -r ./locale/ root@' + host + ':/www/admin/'))
    });



gulp.task('keys', function (cb) {
    fs.readFile('mfw-all.js', "utf-8", function(err, data) {
        // var arr = data.match(/'(.*?.*?)'+(.t\(\))/g);
        var arr = data.match(/'([a-zA-Z0-9 ]*?)'+(.t\(\))/g), json = {}, keys = '';
        // use json to generate unique keys
        arr.forEach(function (string) {
            string = string.replace('.t()', '').replace(/'/g, '');
            if (string.length === 0) { return; }
            if (!isNaN(string)) { return; }
            json[string] = string;
        });
        for (var key in json) {
            keys += key + '\n';
        }

        fs.writeFileSync('./locale/keys', keys);
        cb();
    })
})

gulp.task('locale', function (cb) {
    var lang = process.argv[3].replace('--', ''),
        json = {},
        keys = fs.readFileSync('./locale/keys', 'utf8').split('\n'),
        strings, str;

    if (lang === 'default') {
        keys.forEach(function (key) {
            if (key) { json[key] = key }
        });
    } else {
        strings = fs.readFileSync('./locale/strings/' + lang, 'utf8').split('\n');
        keys.forEach(function (key, idx) {
            str = strings[idx];
            if (key.charAt(0) === key.charAt(0).toUpperCase()) {
                // it's uppercase
                str = str.charAt(0).toUpperCase() + str.substr(1);
            }
            if (key) { json[key] = str; }
        });
    }
    fs.writeFileSync('./locale/json/' + lang + '.json', JSON.stringify(json, null, 4));
    cb();
})

gulp.task('default', gulp.parallel('concat', 'sass', 'index'));
