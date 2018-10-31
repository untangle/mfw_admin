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


gulp.task('build-mfw-app', function() {
    return gulp.src([
        './app/mfw/src/util/*.js',
        './app/mfw/src/cmp/**/*.js',
        './app/mfw/src/model/**/*.js',
        './app/mfw/src/store/**/*.js',
        './app/mfw/src/view/**/*.js',
        './app/mfw/src/AppController.js',
        './app/mfw/src/App.js'
    ])
    .pipe(concat('./dist/mfw-app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
    });

gulp.task('build-settings-app', function() {
    return gulp.src([
        './app/settings/src/App.js'
    ])
    .pipe(concat('./dist/mfw-settings-app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
    });


gulp.task('build-settings', function() {
    return gulp.src([
            './package/settings/store/*.js',
            './package/settings/*.js',
        ])
        .pipe(concat('./dist/mfw-settings.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('.'))
    });


gulp.task('serve', function() {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: ['./', './app/mfw']
        },
        ghostMode: false
    });
    // browserSync.init({
    //     port: 3005,
    //     server: {
    //         baseDir: ['./', './app/settings']
    //     },
    //     ghostMode: false
    // });

    // browserSync.init({
    //     proxy: 'http://' + host + ':8080/admin',
    //     // browser: 'google chrome',
    //     middleware: [{
    //         route: '/api',
    //         handle: function (req, res, next) {
    //             if (req.url.startsWith('/settings/reports')) {
    //                 res.setHeader('Content-Type', 'application/json');
    //                 res.write(fs.readFileSync('./reports-new.json', 'utf8'));
    //                 res.end();
    //             } else {
    //                 next();
    //             }
    //         }
    //     }]
    // });

    // gulp.watch('./sass/*.scss', gulp.series('sass'));
    // gulp.watch('./package/settings/**/*.js', gulp.series('build-settings'));
    // gulp.watch('./index.html', gulp.series('index'));
    // // gulp.watch('./dist/mfw-all.js').on('change', browserSync.reload);
    // gulp.watch('./dist/mfw-all.js').on('change', function () {
    //     // timeout hack
    //     setTimeout(function () {
    //         browserSync.reload();
    //     }, 3000);
    // });
    // gulp.watch('./dist/settings/mfw-settings.js').on('change', function () {
    //     // timeout hack
    //     setTimeout(function () {
    //         browserSync.reload();
    //     }, 3000);
    // });
});





/**
 * to pass root password generate a key-pair using ssh-keygen then
 * ssh root@host "tee -a /etc/dropbear/authorized_keys" < ~\.ssh\id_rsa.pub
 */
var host = '192.168.101.233'; // the MFW machine host to scp built files

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

// gulp.task('default', gulp.series('clean', 'concat', 'sass', 'index', 'serve'));
// gulp.task('serve-map', gulp.series('clean', 'concat-map', 'sass-map', 'index', 'serve'));

// gulp.task('default', gulp.series('build-main', 'build-settings', 'serve'));
