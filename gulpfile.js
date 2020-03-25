const { watch, dest, src, task } = require('gulp');
const less = require('gulp-less');

task('watch', function (cb) {

    src('./less/styles.less').pipe(less()).pipe(dest('./css', { overwrite: true}))

    watch(['./less/*.less'], function (cb) {
      return src('./less/styles.less').pipe(less()).pipe(dest('./css', { overwrite: true }));
    });

    cb();
});