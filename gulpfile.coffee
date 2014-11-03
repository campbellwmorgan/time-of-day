#!/bin/coffee

gulp = require 'gulp'
coffeeify = require 'coffeeify'
browserify = require 'gulp-browserify'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'

gulp.task 'build', ->
  gulp
    .src('./build/build.coffee', {read:false})
    .pipe(
      browserify(
          debug: false
          transform: ['coffeeify']
          extensions: ['.coffee']
      )
    ).pipe(rename('time-of-day.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify(outSourceMaps:false))
    .pipe(rename('time-of-day.min.js'))
    .pipe(gulp.dest('./dist/'))

gulp.task 'default', [
  'build'
]




