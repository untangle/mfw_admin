var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var exec = require('gulp-exec');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var fs = require("fs");

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var host = '192.168.101.60'; // the MFW machine host to scp built files

gulp.task('smap', function() {
    gulp.src('app/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('./maps'))
  });


gulp.task('clean', function () {
    return gulp.src('./dist/*.*', {read: false, allowEmpty: true})
        .pipe(exec('ssh root@' + host + ' "rm -f /www/admin/mfw-all.js /www/admin/mfw-all.min.js /www/admin/mfw-all.js.map /www/admin/mfw-all.css /www/admin/mfw-all.css.map"'))
        .pipe(clean());
    });

gulp.task('concat', function() {
    return gulp.src([
            './app/util/*.js',
            './app/cmp/**/*.js',
            './app/model/**/*.js',
            './app/store/**/*.js',
            './app/view/**/*.js',
            './app/settings/**/*.js',
            './app/AppController.js',
            './app/App.js'
        ])
        .pipe(concat('./dist/mfw-all.js'))
        .pipe(gulp.dest('.'))
        .pipe(rename('./dist/mfw-all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'))
        .pipe(exec('scp ./dist/mfw-all.js ./dist/mfw-all.min.js root@' + host + ':/www/admin/')); // quick deploy on mfw vm
    });

gulp.task('concat-map', function() {
    return gulp.src([
            './app/util/*.js',
            './app/cmp/**/*.js',
            './app/model/**/*.js',
            './app/store/**/*.js',
            './app/view/**/*.js',
            './app/settings/**/*.js',
            './app/AppController.js',
            './app/App.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.mapSources(function(sourcePath, file) {
            // need to map sources to keep the same structure
            var sp = sourcePath, path = file.path.replace(/\\/g, '/'); // needed for windows machines
            if (path.includes('/app/util')) { sp =  'util/' + sourcePath; }
            if (path.includes('/app/cmp')) { sp =  'cmp/' + sourcePath; }
            if (path.includes('/app/model')) { sp =  'model/' + sourcePath; }
            if (path.includes('/app/store')) { sp =  'store/' + sourcePath; }
            if (path.includes('/app/view')) { sp =  'view/' + sourcePath; }
            if (path.includes('/app/settings')) { sp =  'settings/' + sourcePath; }
            return sp;
          }))
        .pipe(concat('./dist/mfw-all.js'))
        .pipe(gulp.dest('.'))
        .pipe(rename('./dist/mfw-all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', { mapFile: function(mapFilePath) {
            // source map files are named *.map instead of *.js.map
                return mapFilePath.replace('.min.js.map', '.js.map');
            }
        }))
        .pipe(gulp.dest('.'))
        .pipe(exec('scp ./dist/mfw-all.js ./dist/mfw-all.js.map ./dist/mfw-all.min.js root@' + host + ':/www/admin/')); // quick deploy on mfw vm
    });

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('./dist/mfw-all.css'))
        .pipe(gulp.dest('./'))
        .pipe(exec('scp ./dist/mfw-all.css root@' + host + ':/www/admin')) // quick deploy on mfw vm
        .pipe(browserSync.stream());
    });

gulp.task('sass-map', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('./dist/mfw-all.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'))
        .pipe(exec('scp ./dist/mfw-all.css ./dist/mfw-all.css.map root@' + host + ':/www/admin')) // quick deploy on mfw vm
        .pipe(browserSync.stream());
    });

gulp.task('index', function () {
    return gulp.src('./index.html')
        .pipe(exec('scp index.html root@' + host + ':/www/admin/'))
    });


gulp.task('serve', function() {
    // browserSync.init({
    //     server: "./"
    // });

    browserSync.init({
        proxy: 'http://' + host + ':8080/admin',
        // browser: 'google chrome',
        middleware: [{
            route: '/api',
            handle: function (req, res, next) {
                if (req.url.startsWith('/settings/reports')) {
                    res.setHeader('Content-Type', 'application/json');
                    res.write(fs.readFileSync('./reports.json', 'utf8'));
                    res.end();
                } else {
                    next();
                }
            }
        }]
    });

    gulp.watch('./sass/*.scss', gulp.series('sass'));
    gulp.watch('./app/**/*.js', gulp.series('concat'));
    gulp.watch('./locale/*.json', gulp.series('locale'));
    gulp.watch('./index.html', gulp.series('index'));
    gulp.watch('./dist/mfw-all.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('clean', 'concat', 'sass', 'index', 'serve'));
gulp.task('serve-map', gulp.series('clean', 'concat-map', 'sass-map', 'index', 'serve'));



// localization helpers
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

