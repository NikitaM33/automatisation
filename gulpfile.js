'use strict';

// Plugins section
const gulp = require('gulp'),
sass = require('gulp-sass'),
prefixer = require('gulp-autoprefixer'),
htmlmin = require('gulp-htmlmin'),
plumber = require('gulp-plumber'),
terser = require('gulp-terser'),
rigger = require('gulp-rigger'),
rimraf = require('rimraf'),
browserSync = require('browser-sync'),
reload = browserSync.reload;

// Routs for sources and build
const path = {
    build: {
        all: 'build/',
        html: 'build/',
        scss: 'build/css/',
        js: 'build/js/',
        fonts: 'build/fonts/',
        img: 'build/img/'
    },
    src: {
        html: 'src/*.{html, htm}',
        scss: 'src/scss/main.scss',
        js: ['src/js/libs.js', 'src/js/app.js'],
        fonts: 'src/fonts/**/*.{eot, svg, ttf, woff, woff2}',
        img: 'src/img/**/*.{jpg, gif, jpeg, svg, png, webp}'
    },
    watch: {
        html: 'src/*.{html, htm}',
        scss: 'src/scss/**/*.*',
        js: 'src/js/**/*.js',
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.{jpg, gif, jpeg, svg, png, webp}'
    },
    clear: 'build/'
},

config = {
    server: {
        baseDir: 'build/',
        index: 'index.html'
    },
    tunnel: true,
    host: 'localhost',
    port: 7787,
    logPrefix: 'WebDev'
};

gulp.task('mv:html', function(done) {
    gulp.src(path.src.html)
    .on('data', function(file) {
        console.log({
            contents: file.contents,
            path: file.path,
            cwd: file.cwd,
            base: file.base,
            relative: file.relative,
            dirname: file.dirname,
            basename: file.basename,
            stem: file.stem,
            extname: file.extname
        });
    })
    .pipe(gulp.dest(path.build.html));
    done();
});

gulp.task('clean', function(done) {
    rimraf(path.clear, done);
});

gulp.task('html:dev', function(done) {
    gulp.src(path.src.html)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(path.build.html))

    done();
});

gulp.task('dev:html', function(done) {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('dev:scss', function(done) {
    gulp.src(path.src.scss, {sourcemaps: true})
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "expanded",
            sourcemaps: true
        }))
        .pipe(prefixer({cascade: false, remove: true}))
        .pipe(gulp.dest(path.build.scss, {sourcemaps: '.'}))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('prod:scss', function(done) {
    gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "compressed",
            sourcemaps: false
        }))
        .pipe(prefixer({cascade: false, remove: true}))
        .pipe(gulp.dest(path.build.scss))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('dev:js', function(done) {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(terser())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));

    done();
});

gulp.task('mv:img', function (done) {
    gulp.src(path.src.img)
        .on('data', function (file) {
            console.log({
                contents: file.contents,
                path: file.path,
                cwd: file.cwd,
                base: file.base,
                relative: file.relative,
                dirname: file.dirname,
                basename: file.basename,
                stem: file.stem,
                extname: file.extname
            });
        })
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({ stream: true }));

    done();
});

gulp.task('mv:fonts', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));

    done();
});

gulp.task('localhost', function(done) {
    browserSync(config);
    done();
});

gulp.task('watch', function(done) {
        gulp.watch(path.watch.html, gulp.series('dev:html'));
        gulp.watch(path.watch.scss, gulp.series('dev:scss'));
        gulp.watch(path.watch.js, gulp.series('dev:js'));
        gulp.watch(path.watch.img, gulp.series('mv:img'));
        gulp.watch(path.watch.fonts, gulp.series('mv:fonts'));
    done();
});

gulp.task('default', gulp.series('clean', gulp.parallel('dev:html', 'dev:scss', 'dev:js', 'mv:img'), 'localhost', 'watch'));