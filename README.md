# gulp-unicode-ascii
Converts characters from Unicode to ASCII. Have been tested with SCSS, but can be used with any file.

DartSass compiles all code to Unicode, however, some platforms may not support Unicode. For such cases this plugin has been created.

## How to Use
For SCSS compilation.

```js
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const unicodeToAscii = require('gulp-unicode-to-ascii');

const sassOptions = {
  charset: false,
  sassOptions.outputStyle = 'compressed';
};

module.exports = function styles(cb) {
  let stream = gulp.src([`./src/scss/**/*.scss`, `./src/scss/*.scss`]);

  stream = stream.pipe(sass.sync(sassOptions))
    .pipe(unicodeAscii())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/css/'));

    cb();

  return stream;

};

gulp.task('build', gulp.series(styles));
```

