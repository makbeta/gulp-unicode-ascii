# gulp-unicode-ascii
Converts characters from Unicode to ASCII. Have been tested with SCSS, but can be used with any file, provided the correct options are psecified.

DartSass compiles all code to Unicode, however, some platforms may not support Unicode. For such cases this plugin has been created.

The plugin should also work when Unicode and ASCII letter & number characters appearing next to each other, it will insert a white space between the two to ensure an entirely different Unicode character is not rendered. For this reason the plugin includes an option to show all replacements in the console.

## Plugin Options

The plugin takes an object of options as an argument. Options are

### `cssContentOnly` - boolean
Include and set to `true`, if you want the replacement to happen inside the CSS `content` property. 
Omit or set to false to do the replacements globally.

### `showReplacements` - boolean
Include and set to `true`, if you would like to see the replacements in the console.

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
    .pipe(unicodeAscii({ cssContentOnly: true, showReplacements: true }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/css/'));

    cb();

  return stream;

};

gulp.task('build', gulp.series(styles));
```


## Compatibility
This has been written and tested against Node v20.15.1, NPM 10.7.0 and Gulp v5.0.0. The code uses some ES6 syntax, which can be rewritten, if necessary. 