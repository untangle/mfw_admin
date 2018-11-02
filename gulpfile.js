var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
const del = require('del');
var exec = require('gulp-exec');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var mfwServer = require('browser-sync').create('mfw');
var settingsServer = require('browser-sync').create('settings');
var appServer = require('browser-sync').create('app');
var fs = require("fs");

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

/**
 * to pass root password generate a key-pair using ssh-keygen then
 * ssh root@host "tee -a /etc/dropbear/authorized_keys" < ~\.ssh\id_rsa.pub
 */
var host = '192.168.101.233'; // the MFW machine host to scp built files

gulp.task('build-package-settings', function() {
    return gulp.src([
            './package/settings/src/util/**/*.js',
            './package/settings/src/store/**/*.js',
            './package/settings/src/model/**/*.js',
            './package/settings/src/component/**/*.js',
            './package/settings/src/view/**/*.js',
            './package/settings/src/*.js',
        ])
        .pipe(concat('mfw-pkg-settings.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./dist/mfw/pkg'));
    });

gulp.task('build-sass-settings', function () {
    return gulp.src('./package/settings/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('mfw-settings.css'))
        .pipe(gulp.dest('./dist/settings'));
        // .pipe(exec('scp ./dist/mfw-all.css root@' + host + ':/www/admin')) // quick deploy on mfw vm
        // .pipe(browserSync.stream());
    });

gulp.task('build-sass-all', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('mfw-all.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(appServer.stream());
    });

gulp.task('build-package-auth', function() {
    return gulp.src([
            './package/auth/**/*.js',
        ])
        .pipe(concat('mfw-pkg-auth.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./dist/mfw/pkg'));
    });

gulp.task('build-app-settings', function() {
    var js = gulp.src([
        './app/settings/src/cmp/**/*.js',
        './app/AppBase.js',
        './app/settings/src/App.js'
    ])
    .pipe(concat('mfw-app-settings.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/mfw/'))
    var index = gulp.src('./app/settings/index.html')
        .pipe(gulp.dest('./dist/settings'));

    return merge(js, index);
    });

// ADMIN
gulp.task('build-app-admin', function() {
    var js = gulp.src([
        './app/admin/src/cmp/**/*.js',
        './app/admin/src/view/**/*.js',
        './app/AppBase.js',
        './app/admin/src/App.js'
    ])
    .pipe(concat('mfw-app-admin.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/mfw/'))
    var index = gulp.src('./app/admin/index.html')
        .pipe(gulp.dest('./dist'));

    return merge(js, index);
    });

gulp.task('clean', function () {
    var command = 'ssh root@' + host + ' rm /www/admin/index.html; rm /www/admin/mfw-all.css; rm -rf /www/admin/mfw/; rm -rf /www/admin/settings/';
    del(['./dist/**', '!./dist']);
    return gulp.src('.')
        .pipe(exec(command));
    });

gulp.task('deploy', function () {
    return gulp.src('./')
        .pipe(exec('scp -r ./dist/index.html ./dist/mfw-all.css ./dist/mfw ./dist/settings root@' + host + ':/www/admin/')); // quick deploy on mfw vm
    });

gulp.task('build', gulp.series('clean', 'build-package-auth', 'build-package-settings', 'build-sass-all', 'build-app-settings', 'build-app-admin', 'deploy'));

gulp.task('serve', function (cb) {
    appServer.init({
        proxy: 'http://' + host + ':8080/admin',
        // browser: 'google chrome',
        // middleware: [{
        //     route: '/api',
        //     handle: function (req, res, next) {
        //         if (req.url.startsWith('/settings/reports')) {
        //             res.setHeader('Content-Type', 'application/json');
        //             res.write(fs.readFileSync('./reports-new.json', 'utf8'));
        //             res.end();
        //         } else {
        //             next();
        //         }
        //     }
        // }]
    });


    gulp.watch(['./app/**/*.*', './package/**/*.*'], gulp.series('build'));
    // gulp.watch(['./dist/**/*.*']).on('change', function () {
    //     setTimeout(function () {
    //         appServer.reload();
    //     }, 5000);
    // });
});

/**
 * gulp serve --app [appname]
 */

// gulp.task('serve', function (cb) {
//     var app = process.argv[4];
//     if (!app || !['admin', 'settings'].includes(app)) {
//         console.warn('Please specify app! (gulp serve -app admin|settings)');
//         return cb();
//     }

//     if (app === 'settings') {
//         appServer.init({
//             proxy: 'http://' + host + ':8080/admin',
//             port: 3010,
//             ui: { port: 3011 }
//         });
//     }
// })



// gulp.task('serve', function() {
//     // mfwServer.init({
//     //     port: 3000,
//     //     ui: {
//     //         port: 3001
//     //     },
//     //     server: {
//     //         baseDir: ['./', './app/mfw']
//     //     },
//     //     ghostMode: false
//     // });
//     // settingsServer.init({
//     //     port: 3010,
//     //     ui: {
//     //         port: 3011
//     //     },
//     //     server: {
//     //         baseDir: ['./', './app/settings']
//     //     },
//     //     ghostMode: false
//     // });

//     settingsServer.init({
//         port: 3010,
//         ui: {
//             port: 3011
//         },
//         proxy: 'http://' + host + ':8080/admin',
//     });

//     // browserSync.init({
//     //     proxy: 'http://' + host + ':8080/admin',
//     //     // browser: 'google chrome',
//     //     middleware: [{
//     //         route: '/api',
//     //         handle: function (req, res, next) {
//     //             if (req.url.startsWith('/settings/reports')) {
//     //                 res.setHeader('Content-Type', 'application/json');
//     //                 res.write(fs.readFileSync('./reports-new.json', 'utf8'));
//     //                 res.end();
//     //             } else {
//     //                 next();
//     //             }
//     //         }
//     //     }]
//     // });

//     // gulp.watch('./sass/*.scss', gulp.series('sass'));
//     gulp.watch('./app/settings/src/**/*.js', gulp.series('build-settings-app'));
//     gulp.watch('./package/settings/**/*.js', gulp.series('build-settings'));
//     // gulp.watch('./index.html', gulp.series('index'));
//     // // gulp.watch('./dist/mfw-all.js').on('change', browserSync.reload);
//     // gulp.watch('./dist/mfw-all.js').on('change', function () {
//     //     // timeout hack
//     //     setTimeout(function () {
//     //         browserSync.reload();
//     //     }, 3000);
//     // });
//     gulp.watch(['./dist/mfw-settings.js', './dist/mfw-settings-app.js']).on('change', function () {
//         // timeout hack
//         setTimeout(function () {
//             settingsServer.reload();
//         }, 3000);
//     });
// });



// gulp.task('smap', function() {
//     gulp.src('app/**/*.js')
//       .pipe(sourcemaps.init())
//       .pipe(sourcemaps.write('./maps'))
//   });


// gulp.task('clean', function () {
//     return gulp.src('./dist/*.*', {read: false, allowEmpty: true})
//         .pipe(exec('ssh root@' + host + ' "rm -f /www/admin/mfw-all.js /www/admin/mfw-all.min.js /www/admin/mfw-all.js.map /www/admin/mfw-all.css /www/admin/mfw-all.css.map"'))
//         .pipe(clean());
//     });

// gulp.task('concat', function() {
//     return gulp.src([
//             './app/util/*.js',
//             './app/cmp/**/*.js',
//             './app/model/**/*.js',
//             './app/store/**/*.js',
//             './app/view/**/*.js',
//             './app/settings/**/*.js',
//             './app/AppController.js',
//             './app/App.js'
//         ])
//         .pipe(concat('./dist/mfw-all.js'))
//         .pipe(gulp.dest('.'))
//         .pipe(rename('./dist/mfw-all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('.'))
//         .pipe(exec('scp ./dist/mfw-all.js ./dist/mfw-all.min.js root@' + host + ':/www/admin/')); // quick deploy on mfw vm
//     });

// gulp.task('concat-map', function() {
//     return gulp.src([
//             './app/util/*.js',
//             './app/cmp/**/*.js',
//             './app/model/**/*.js',
//             './app/store/**/*.js',
//             './app/view/**/*.js',
//             './app/settings/**/*.js',
//             './app/AppController.js',
//             './app/App.js'
//         ])
//         .pipe(sourcemaps.init())
//         .pipe(sourcemaps.mapSources(function(sourcePath, file) {
//             // need to map sources to keep the same structure
//             var sp = sourcePath, path = file.path.replace(/\\/g, '/'); // needed for windows machines
//             if (path.includes('/app/util')) { sp =  'util/' + sourcePath; }
//             if (path.includes('/app/cmp')) { sp =  'cmp/' + sourcePath; }
//             if (path.includes('/app/model')) { sp =  'model/' + sourcePath; }
//             if (path.includes('/app/store')) { sp =  'store/' + sourcePath; }
//             if (path.includes('/app/view')) { sp =  'view/' + sourcePath; }
//             if (path.includes('/app/settings')) { sp =  'settings/' + sourcePath; }
//             return sp;
//           }))
//         .pipe(concat('./dist/mfw-all.js'))
//         .pipe(gulp.dest('.'))
//         .pipe(rename('./dist/mfw-all.min.js'))
//         .pipe(uglify())
//         .pipe(sourcemaps.write('.', { mapFile: function(mapFilePath) {
//             // source map files are named *.map instead of *.js.map
//                 return mapFilePath.replace('.min.js.map', '.js.map');
//             }
//         }))
//         .pipe(gulp.dest('.'))
//         .pipe(exec('scp ./dist/mfw-all.js ./dist/mfw-all.js.map ./dist/mfw-all.min.js root@' + host + ':/www/admin/')); // quick deploy on mfw vm
//     });

// gulp.task('sass', function () {
//     return gulp.src('./sass/**/*.scss')
//         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//         .pipe(concat('./dist/mfw-all.css'))
//         .pipe(gulp.dest('./'))
//         .pipe(exec('scp ./dist/mfw-all.css root@' + host + ':/www/admin')) // quick deploy on mfw vm
//         .pipe(browserSync.stream());
//     });

// gulp.task('sass-map', function () {
//     return gulp.src('./sass/**/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//         .pipe(concat('./dist/mfw-all.css'))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./'))
//         .pipe(exec('scp ./dist/mfw-all.css ./dist/mfw-all.css.map root@' + host + ':/www/admin')) // quick deploy on mfw vm
//         .pipe(browserSync.stream());
//     });

// gulp.task('index', function () {
//     return gulp.src('./index.html')
//         .pipe(exec('scp index.html root@' + host + ':/www/admin/'))
//     });

// // gulp.task('default', gulp.series('clean', 'concat', 'sass', 'index', 'serve'));
// // gulp.task('serve-map', gulp.series('clean', 'concat-map', 'sass-map', 'index', 'serve'));

// // gulp.task('default', gulp.series('build-main', 'build-settings', 'serve'));
