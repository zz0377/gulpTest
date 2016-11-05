var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})

// 一次编译所有 js 文件
gulp.task('uglifyjs', function() {
	var combined = combiner.obj([
		gulp.src('src/js/**/*.js'),
		sourcemaps.init(),
		uglify(),
		sourcemaps.write('./'),
		gulp.dest('dist/js/')
	])
	combined.on('error', handlerError)
})

// 
gulp.task('watchcss', function() {
	gulp.watch('src/css/**/*.css', function(event) {
		var paths = watchPath(event, 'src/', 'dist/');

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);

		gulp.src(paths.srcPath)
		    .pipe(sourcemaps.init())
		    .pipe(autoprefixer({
		    	browsers: 'last 2 versions'
		    }))
		    .pipe(minifycss())
		    .pipe(sourcemaps.write('./'))
		    .pipe(gulp.dest(paths.distDir));
	})
})

// 一次编译所有 css 文件
gulp.task('minifycss', function() {
	gulp.src('src/css/**/*.css')
	    .pipe(autoprefixer({
	    	    	browsers: 'last 2 versions'
	    }))
	    .pipe(minifycss())
	    .pipe(sourcemaps.write('./'))
	    .pipe(gulp.dest('dist/css/'));
})

// 
gulp.task('watchless', function() {
	gulp.watch('src/less/**/*.less', function() {
		var paths = watchPath(event, 'src/less/', 'dist/css/');

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
            	browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
		]);
		combined.on('error', handlerError);
	})
})

// 一次编译所有的 less
gulp.task('lesscss', function() {
	var combined = combiner.obj([
		gulp.src('src/less/**/*.js'),
		sourcemaps.init(),
		autoprefixer({
			browsers: 'last 2 versions'
		}),
		less(),
		minifycss(),
		sourcemaps.write('./'),
		gulp.dest('dist/css/')
	]);
	combined.on('error', handleError);
})


//
gulp.task('watchimage', function() {
	gulp.watch('src/image/**/*', function() {
		var paths = watchPath(event, 'src/image', 'dist/image');

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist' + paths.distDir);

		gulp.src(paths.srcPath)
		    .pipe(imagemin({
		    	progressive: true
		    }))
		    .pipe(gulp.dest(paths.distDir))
	})
})

//
gulp.task('image', function() {
	gulp.src('src/image/**/*')
	    .pipe(imagemin({
	    	progressive: true
	    }))
	    .pipe(gulp.dest('dist/image'));
})


//
gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        var paths = watchPath(event)

		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})


gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchimage', 'watchcopy']);