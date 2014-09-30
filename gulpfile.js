var 

gulp       = require('gulp'),
purescript = require('gulp-purescript'),
livescript = require('gulp-livescript'),
concat     = require('gulp-concat'),
gulpif     = require('gulp-if'),
gulpFilter = require('gulp-filter'),
express    = require('express'),
runSq      = require('run-sequence'),
karma      = require('gulp-karma'),

paths      = {
  prod : {
    src : [
      "bower_components/js-yaml/dist/js-yaml.js",
      "bower_components/purescript-*/src/**/*.purs",
      "bower_components/purescript-*/src/**/*.purs.hs",
      "presentable/src/**/*.purs",
      "src/**/*.purs",
      "src/**/*.ls"
    ],
    dest : "lib"
  },
  test : {
    src : [
      "bower_components/chai/chai.js",
      "bower_components/js-yaml/dist/js-yaml.js",
      "bower_components/purescript-*/src/**/*.purs",
      "bower_components/purescript-*/src/**/*.purs.hs",
      "presentable/src/**/*.purs",
      "src/**/*.ls",
      "src/**/*.purs",
      "tests/**/*.ls",
      "tests/**/*.purs"
    ],
    dest : 'tmp'
  }
},

options    = {
  prod :{
    output : 'Todo.js',
    main : true
  },
  test :{
    output : 'Test.js',
    main : true,
    runtimeTypeChecks : false,
    externs : "extern.purs"
  }
},

port       = 3333,
server     = express(),

build = function(k){
  return function(){

    var x   = paths[k],
        o   = options[k],
        psc = purescript.psc(o),
        lsc = livescript({bare:true});


      psc.on('error', function(e){
        console.error(e.message);
        psc.end();  
      });

      return gulp.src(x.src)
        .pipe(gulpif(/.purs/, psc))
        .pipe(gulpif(/.ls/,   lsc))
        .pipe(concat(o.output))
        .pipe(gulp.dest(x.dest));
 
  };
}; // var

gulp.task('build:test',     build('test'));
gulp.task('build:prod',     build('prod'));

gulp.task('test:unit', function(){
  gulp.src(options.test.output)
    .pipe(karma({
      configFile : "./tests/karma.conf.js",
      noColors   : true,
      action     : "run"
    }));
});

gulp.task('watch', function(){ 
  gulp.watch(paths.prod.src, ['build:example']); 
});

gulp.task('serve', function(){ 
  console.log("listening on port " + port);
  server.use(express.static('./example'));
  server.listen(port); 
});

gulp.task('doc', function(){
  var noBower = gulpFilter(["*", "!bower_components/**/*"]);
  gulp.src("src/**/*.purs")
    .pipe(purescript.docgen())
    .pipe( gulp.dest("DocGen.md"));
});

gulp.task('default', ['build:prod','watch','serve']);
gulp.task('test',    function(){ runSq('build:test','test:unit'); });