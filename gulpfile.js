var gulp = require('gulp');
var include = require('gulp-include');
var del = require('del');
var replace = require('gulp-replace');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var jspm = require('jspm');

var ENV = process.env.NODE_ENV;

// delete build folder
gulp.task('del', function() {
    del('public/');
});

// build public/main.css
gulp.task('styles', function() {
    gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

// build src/**/*.html into public/*.html
gulp.task('build-html', function() {
    
    gulp.src(['!src/templates/index.html', 'src/templates/*.html'])
        .pipe(include())
        .pipe(gulp.dest('public'));
        
    gulp.src('src/templates/index.html')
        .pipe(include())
        .pipe(gulp.dest('.'));
});

gulp.task('serve', function() {
    
    browserSync.init({
        server: {
            baseDir: '.',
        },
        notify: false,
        reloadOnRestart: true,
        open: false,
        ui: false
    });
    
    gulp.watch(['src/scss/*.scss'], ['styles']);
    gulp.watch(['src/**/*.html'], ['build-html']);
    
    // fire reload when public files change
    gulp.watch([
        'public/*.html', 
        'public/*.css',
    ]).on('change', browserSync.reload);
});

//NODE_ENV=development
gulp.task('development', ['serve']);

//NODE_ENV=production
gulp.task('production', ['del', 'styles', 'build-html']);

gulp.task('default', 
    [ENV === 'production' ? 'production' : 'development']
);