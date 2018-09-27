const gulp = require('gulp');
const inject = require('gulp-inject');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const ftp = require('vinyl-ftp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const templateCache = require('gulp-angular-templatecache');
const fs = require('fs');
const addsrc = require('gulp-add-src');
const replace = require('gulp-replace');

var project_name = 'text-messages-embed';
var path = 'experiments/usatoday/responsive/' + project_name;
var cdn_path = '/17200/' + path;
var cdn_url = '//www.gannett-cdn.com/' + path;

var js_files = [
    './bower_components/angular/angular.min.js',
    './baseplate-components/angular-iframe-resizer/src/iframe-resizer.js',
    './baseplate-components/angular-resizer/src/resizer.js',
    './components/**/*.js',
    './*.js',
    '!./gulpfile.js'
];

var css_files = [
    './baseplate-components/static-override/static-override.css',
    './components/**/*.css',
    './*.css'
];

var assets = [
    './assets/**/*'
];

var source_files = js_files.concat(css_files);
var dist_path = './dist';

gulp.task('html-dev', function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src(source_files, {
            read: false
        }), {
            addRootSlash: false
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src([
            './dist/*.css',
            './dist/*.js'
        ], {
            read: false
        }), {
            ignorePath: '/dist/',
            addRootSlash: false
        }))
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist_path))
});

gulp.task('css', function () {
    return gulp.src(css_files)
        // add vender prefixes if necessary
        .pipe(autoprefixer({
            browsers: ['>1%','last 3 versions'],
            cascade: false
        }))
        // minify
        .pipe(cssmin())
        // concat
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(dist_path));
});

gulp.task('js', function () {
    return gulp.src('components/**/*.html')
        .pipe(templateCache({
            root: 'components',
            module: project_name
        }))
        .pipe(addsrc.prepend(js_files))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(dist_path));
});

gulp.task('assets', function () {
    return gulp.src(assets)
        .pipe(gulp.dest(dist_path + '/assets/'));
});

gulp.task('update-asset-paths', function () {
    return gulp.src(dist_path + '/app.min.js')
            .pipe(replace(/assets\//g, cdn_url + '/assets/'))
            .pipe(gulp.dest(dist_path));
});

gulp.task('update-paths', function () {
    //src=\"(?!\/\/|http).*?\"
    gulp.src(['./dist/index.html'])
        // ignore strings that start with "//" or "http"
        .pipe(replace(/src="(?!\/\/|http|www)(.*)?"/g, 'src="' + cdn_url + '/$1"'))
        // match href
        .pipe(replace(/href="(?!\/\/|http|www)(.*)?"/g, 'href="' + cdn_url + '/$1"'))
        .pipe(gulp.dest(dist_path));
});

gulp.task('upload', function (files) {

    var key_id = 'experiments',
        user = process.env.USER || process.env.USERNAME,
        keys = null;
    try {
        keys = JSON.parse(fs.readFileSync('/Users/' + user + '/Documents/.ftppass', 'utf8'));
    }
    catch (e) {
	    console.log(e);
        console.warn('.ftppass missing from your user documents folders.')
    }
    if (keys) {
        var conn = ftp.create({
            host: 'usatoday.upload.akamai.com',
            user: keys[key_id].username,
            password: keys[key_id].password,
            parallel: 10,
            log: gutil.log
        });

        var files = [
            dist_path + '/*.js',
            dist_path + '/*.css',
            dist_path + '/*.html',
            dist_path + '/*.json',
            dist_path + '/assets/**'
        ];

        return gulp.src(files, {base: dist_path, buffer: false})
            .pipe(conn.dest(cdn_path));
    }

});


gulp.task('build', function (callback) {
    // clean dist synchronously
    del.sync(['dist'], callback);
    runSequence(
        ['js', 'css', 'assets'],
        'html',
        callback);
});

gulp.task('build-prod', function (callback) {
    runSequence(
        'build',
        'update-asset-paths',
        'update-paths',
        callback);
});

gulp.task('deploy', function (callback) {
    runSequence(
        'build-prod',
        'upload',
        callback);
});