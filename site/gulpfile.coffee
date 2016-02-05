gulp = require 'gulp'
connect = require 'gulp-connect'
jade = require 'gulp-jade'
stylus = require 'gulp-stylus'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
clean = require 'gulp-clean'
rjs = require 'gulp-requirejs'
rename = require 'gulp-rename'

dist = 'dist/'
db_dir = '../database/db_full.json'

gulp.task 'connect', ->
  connect.server
    port: 1337
    livereload: on
    root: './' + dist

gulp.task 'jade', ->
  gulp.src 'jade/index.jade'
    .pipe jade
      locals: require db_dir
    .pipe gulp.dest dist
    .pipe do connect.reload

  tasks = require db_dir
  task_names = Object.keys tasks
  for name in task_names
    gulp.src 'jade/task.jade'
      .pipe jade
        locals:
          task: tasks[name]
          tasks: task_names
      .pipe rename name + '.html'
      .pipe gulp.dest dist + 'tasks'
      .pipe do connect.reload

gulp.task 'stylus', ->
  gulp.src 'stylus/*.styl'
    .pipe stylus set: ['compress']
    .pipe gulp.dest dist + 'css'
    .pipe do connect.reload

gulp.task 'build', ['coffee'], ->
  rjs
    baseUrl: 'js'
    name: '../bower_components/almond/almond'
    include: ['main']
    insertRequire: ['main']
    out: 'all.js'
    wrap: on
  .pipe do uglify
  .pipe gulp.dest dist + 'js'
  .pipe do connect.reload
  
  gulp.src 'js/', read: no
    .pipe do clean

gulp.task 'coffee', ->
  gulp.src 'coffee/*.coffee'
    .pipe do coffee
    .pipe gulp.dest 'js'

gulp.task 'css', ->
  gulp.src 'backup/*.css'
    .pipe gulp.dest dist + 'css'
    .pipe do connect.reload

gulp.task 'js', ->
  gulp.src 'backup/*.js'
    .pipe gulp.dest dist + 'js'
    .pipe do connect.reload

gulp.task 'database', ->
  gulp.src '../database/*.json'
    .pipe gulp.dest dist

gulp.task 'watch', ->
  gulp.watch 'jade/*.jade', ['jade']
  gulp.watch 'stylus/*.styl', ['stylus']
  gulp.watch 'coffee/*.coffee', ['build']
  gulp.watch 'backup/*.css', ['css']
  gulp.watch 'backup/*.js', ['js']

gulp.task 'default', ['jade', 'stylus', 'build', 'css', 'js', 'database', 'watch', 'connect']
