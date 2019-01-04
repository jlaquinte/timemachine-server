'use strict';

// IMPORTS
import sync from 'browser-sync'
import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import notifier from 'node-notifier'
import changed from 'gulp-changed'
import fileinclude from 'gulp-file-include'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import babelify from 'babelify'
import browserify from "browserify"

const nodemonBus = require('nodemon/lib/utils/bus');

// ERROR HANDLER
const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })

  console.log(error)
  this.emit('end')
}

// HTML
gulp.task('html', () => {
  return gulp.src('src/test_frontend/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(fileinclude({ prefix: '@', basepath: 'src/html/' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist/'))
})


// JS
gulp.task('js', ()=>  {
    browserify({
      entries: 'src/test_frontend/js/app.js',
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .on('error', onError)
    .pipe(gulp.dest( 'dist/js/' ))
    .pipe(sync.stream())
});


// IMAGES
gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg,json}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist/'))
    .pipe(imagemin({ progressive: true, interlaced: true,
      svgoPlugins: [{
          cleanupIDs: false
        // }, {
        //   sortAttrs: true
        // }, {
        //   convertPathData: false
        }, {
          removeHiddenElems: false
        }, {
          collapseGroups: false
        }]
    }))
    .pipe(gulp.dest('dist/images'))
})


// BACKEND
// start our server and listen for changes
gulp.task('backend', function() {
    // configure nodemon
    nodemon({
        // the script to run the app
        script: 'server.js',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ['server.js', 'src/server/**/*.js', 'src/config/**/*.{js,json}']
    })
    .on('start', () => {
      var restartInterval = 6 * 60 * 60 * 1000;  // h * m * s * ms

      var intervalID = setInterval(() => {
        clearInterval(intervalID);
        console.log('Auto restarting backend server');
        nodemonBus.emit('restart');
      }, restartInterval);
    })
    .on('restart', () => {
      gulp.src('server.js')
    });
});


// BROWSER SYNC
const browserSync = sync.create()
const reload = sync.reload

const options = {
  notify: false,
  server: {
    baseDir: 'dist/'
  }
}
gulp.task('browser-sync', () => sync(options))


// WATCH
gulp.task('watch', () => {
  gulp.watch('src/test_frontend/*.html', ['html', reload])
  gulp.watch('src/test_frontend/js/*.js', ['js', reload])
  gulp.watch('src/test_frontend/images/**/*.{gif,jpg,png,svg}', ['images', reload])
})

// BUILD & DEFAULT TASK
gulp.task('build', ['html', 'js', 'images'])
gulp.task('default', ['browser-sync', 'build','watch', 'backend'])
