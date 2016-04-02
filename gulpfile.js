var gulp = require('gulp');
var include = require('gulp-include');
var del = require('del');
var replace = require('gulp-replace');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

var ENV = process.env.NODE_ENV;

// delete build folder
gulp.task('del', function() {
    del('public/**/*');
});

// build public/main.css
gulp.task('styles', function() {
    gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

// build src/**/*.html into public/*.html
gulp.task('build', function() {
    gulp.src(['src/templates/*.html'])
        .pipe(include())
        .pipe(replace(/public\/([a-z1-9\-\_]*)\.html/gi, '$1.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('serve', function() {
    
    browserSync.init({
        server: {
            baseDir: './public',
        },
        notify: false,
        reloadOnRestart: true,
        open: false,
        ui: false
    });
    
    gulp.watch(['src/**/*.scss'], ['styles']);
    gulp.watch(['src/**/*.html'], ['build']);
    
    // fire reload when public files change
    gulp.watch(['public/*.html', 'public/*.css']).on('change', browserSync.reload);
});

//NODE_ENV=development
gulp.task('development', ['serve']);

//NODE_ENV=production
gulp.task('production', ['del', 'styles', 'build']);

gulp.task('default', 
    [ENV === 'production' ? 'production' : 'development']
);