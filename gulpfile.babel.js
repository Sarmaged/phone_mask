'use strict';

// const TIMESTAMP = new Date().getTime();

import plugins  from 'gulp-load-plugins';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import rimraf   from 'rimraf';
import yargs    from 'yargs';

const $ = plugins();

const PRODUCTION = !!(yargs.argv.production);

const PATHS = {
    copy: ['./dist/**/*', '!./dist/{scss, js}/**/*']
}

gulp.task('clean', function(done) {
  rimraf('./build/**/*', done);
});

gulp.task('scss', () => {
  return gulp.src(['./dist/scss/app.scss'])
  .pipe($.sourcemaps.init())
  // .pipe($.header('$TIMESTAMP: ' + TIMESTAMP + ';\n'))
  .pipe($.sass({
    outputStyle: PRODUCTION ? 'compressed' : '',
    includePaths: [
      './bower_components'
    ]
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: [
        "last 2 versions",
        "ie >= 9",
        "ios >= 7"
    ]
  }))
  .pipe($.if(PRODUCTION, $.minifyCss()))
  .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
  .pipe(gulp.dest('./build/css'))
  .pipe(browser.reload({ stream: true }));
});

gulp.task('js', () => {
  return gulp.src([
    './bower_components/jquery/dist/jquery.js',
    './bower_components/jquery-mask-plugin/src/jquery.mask.js',
    './dist/js/app.js'
  ])
  .pipe($.sourcemaps.init())
  // .pipe($.babel())
  .pipe($.concat('app.js'))
  .pipe($.if(PRODUCTION, $.uglify()
    .on('error', e => { console.log(e); })
  ))
  .pipe($.if(!PRODUCTION, $.sourcemaps.write('.')))
  .pipe(gulp.dest('./build/js'));
});

gulp.task('client', gulp.series('clean', gulp.parallel('scss','js')));

gulp.task('default', gulp.series('client', server, watch));

function server(done) {
    browser.init({
        port: 5000,
        server: "./",
        index: "index.html",
        browser: "google-chrome-stable"
    });
    done();
}

function watch() {
    // gulp.watch(PATHS.copy, gulp.series('copy', browser.reload));
    gulp.watch("./index.html").on('change', browser.reload);
    gulp.watch('./dist/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('./dist/js/**/*.js').on('change', gulp.series('js', browser.reload));
};
