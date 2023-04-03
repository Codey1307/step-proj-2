const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
const postscss = require('postcss-scss');

function cleaning() {
    return src('dist')
    .pipe(clean());
}

function scripts() {
    return src('src/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/dist/js'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('src/scss/*.scss')
        .pipe(autoprefixer())
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('src/dist/css'))
        .pipe(browserSync.stream())
}

function watching(){
    watch(['src/scss/*.scss'], styles);
    watch(['src/js/*.js'], scripts);
    watch(['src/*.html']).on('change', browserSync.reload);
}

function browserSyncing(){
    browserSync.init({
        server: {
            baseDir: "src/"
        },
        browser:"google chrome",
    })
};

function bulid() {
    return src([
        'src/dist/css/style.min.css',
        'src/dist/js/main.min.js',
        'src/*.html',
    ], {base : 'src'})
    .pipe(dest('dist'))
}

exports.cleaning = cleaning;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browserSyncing = browserSyncing;
exports.default = parallel(styles, scripts, browserSyncing, watching);
exports.build = series(cleaning, styles, scripts, bulid);