var gulp = require("gulp");

var runSequence = require('run-sequence');
var _ = require('lodash')
var realm = require('realm-js');
var spawn = require('child_process').spawn;

var rename = require("gulp-rename");
var concat = require("gulp-concat");
var prettify = require('gulp-jsbeautifier');
var node;
var bump = require('gulp-bump');

// Publish sc
gulp.task('increment-version', function() {
   gulp.src('./package.json')
      .pipe(bump())
      .pipe(gulp.dest('./'));
});
gulp.task('push', function(done) {
   var publish = spawn('npm', ['publish'], {
      stdio: 'inherit'
   })
   publish.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
      done()
   });
})

gulp.task('server', function() {
   if (node) node.kill()
   node = spawn('node', ['app.js'], {
      stdio: 'inherit'
   })
   node.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
   });
});

gulp.task('start', function() {
   return runSequence('build', 'dist', function() {
      runSequence('server')
      return gulp.watch(['src/**/*.js'], function() {
         runSequence('build', 'dist', 'server')
      });
   });
});

gulp.task('copy-dependencies', function() {
   return gulp.src(
         [
            "node_modules/realm-js/build/realm.min.js",
            "node_modules/realm-js/build/realm.js",
            "node_modules/realm-router/dist/frontend/realm.router.min.js",
            "node_modules/realm-router/dist/frontend/realm.router.js",
            "bower_components/lodash/dist/lodash.min.js",
            "bower_components/lodash/dist/lodash.js"
         ]
      )
      .pipe(gulp.dest("./dist/frontend/"))
});

gulp.task("build", function() {
   return realm.transpiler2.universal("src/", "build/");
});

gulp.task("publish", ['dist', 'increment-version'], function() {
   runSequence('push')
})
gulp.task("dist", function(done) {
   runSequence('build', 'dist-backend', 'copy-dependencies', done)
});
gulp.task('dist-backend', function() {
   return gulp.src(["build/backend.js"])
      .pipe(concat("realm.server.js"))
      .pipe(prettify({
         js: {
            max_preserve_newlines: 1
         }
      }))
      .pipe(gulp.dest("./dist/backend/"))
});
