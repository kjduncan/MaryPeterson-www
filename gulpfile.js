var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    svgSprite = require('gulp-svg-sprite'),
    svgfallback = require('gulp-svgfallback'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    exec = require('child_process').exec,
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util');


gulp.task('jekyll', function (cb){
    exec('jekyll build', function(err, stdout, stderr) {
        console.log(stdout);
        cb(err);
    });
});

gulp.task('serve', function() {
    browserSync.init({
        port: 4100,
        server: {
            baseDir: "./_site/",
        },
        ui: {
            port: 4000
        }

    });
    gulp.watch("_assets/_sass/**/*.scss", ['styles']);
    gulp.watch("_assets/_js/**/*.js", ['js']);
    gulp.watch(["**/*.html", "**/*.md", "assets/**/*", "!_site/**/*"], ['jekyll']);
    gulp.watch("_site/*").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return sass('_assets/_sass/*.scss', { style: 'expanded' })
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream());
});

//I hacked together an SVG sprite sheet with a PNG sprite sheet fallback.
//PNGs are only visible if .no-svg class is triggered through modernizr.
//I stole this from mealplanner

var config = {
    shape: {
        dimensions: {
            maxWidth: 100000
        },
        spacing: {
            padding: 1
        },
    },
    mode: {
        view: {
            bust: false,
            prefix: ".%s",
            dimensions: "%s",
            render: {
                css: true
            },
            example: true
        },
        symbol: true
    }
};

gulp.task('svgsprite', function() {
    return gulp.src('**/*.svg', {cwd: '_assets/_images/icons'})
        .pipe(svgSprite(config))
        .pipe(gulp.dest('assets/images/icons/svg'));
});

gulp.task('svgfallback', function () {
    return gulp
        .src('_assets/_images/icons/*.svg', {base: '_assets/_images/icons'})
        .pipe(rename({prefix: 'no-svg .'}))
        .pipe(svgfallback())
        .pipe(gulp.dest('assets/images/icons/png'));
});

gulp.task('images', function() {
  return gulp.src('_assets/_images/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/images/images'));
});

gulp.task('files', function() {
  return gulp.src('_assets/_files/**/*')
    .pipe(gulp.dest('assets/files'));
});

gulp.task('js', function() {
    return gulp.src('_assets/_js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
            .pipe(concat('main.js'))
            //look for supported gulp-sourcemap plugins
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/js'))
});




gulp.task('default', ['styles', 'js', 'files', 'serve', 'jekyll']);
gulp.task('sprites', ['svgsprite', 'svgfallback', 'images']);
