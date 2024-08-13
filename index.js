const Stream = require('stream');

/**
 * Replaces unicode characters with ascii
 *
 * @param  {String}  source           input string for replacements
 * @return {String}                   updated string
 */
function replaceUnicodeChars(source, isShowReplacements) {
  const UNICODE_MATCH_REG = /[^\u0000-\u007F][0-9a-fA-F \t\r\n\f]?/gu;
  const newSource = source.replace(UNICODE_MATCH_REG, (match) => {
    let chars = [...match];
    let codePt = chars[0].codePointAt(0);
    let out = `\\${codePt.toString(16)}`;
    if (chars.length > 1) {
      out = `${out} ${chars[1]}`;
      if (codePt > 0xfffff) {
        out = `${out}${chars[1]}`;
      }
    }
    if (isShowReplacements) {
      console.log(`[${new Date().toLocaleTimeString('it-IT')}]`, `[unicodeToAscii] before: ${match} after: ${out}`);
    }
    return out;
  });

  return newSource;
}

/**
 * Replace unicode with ascii in source file
 * @param  {String}  source           input stream
 * @param  {Boolean} isCssContentOnly should replacements be made only in css content properties?
 * @return {String}                   updated stream
 */
function replaceUnicode(source, options) {
  const UNICODE_MATCH_REG = /[^\u0000-\u007F][0-9a-fA-F \t\r\n\f]?/gu;
  const CONTENT_MATCH_REG = /((?<!-)content\s*:\s*['"]?[a-zA-Z0-9]*)([^\u0000-\u007F][0-9a-fA-F \t\r\n\f]?)([0-9a-fA-F*-_]*['";]+)/gu;

  let isCssContentOnly = false;
  let isShowReplacements = false;

  if (options?.cssContentOnly) {
    isCssContentOnly = options.cssContentOnly;
  }

  if (options?.showReplacements) {
    isShowReplacements = options.showReplacements;
  }

  let newSource = source;
  if (isCssContentOnly) {

    newSource = source.replace(CONTENT_MATCH_REG, (match, p1, p2, p3) => {
      return `${p1}${replaceUnicodeChars(p2, isShowReplacements)}${p3}`;
    });
    console.log(`[${new Date().toLocaleTimeString('it-IT')}]`, '[unicodeToAscii] Replaced in CSS `content` properties only.');
  } else {

    newSource = replaceUnicodeChars(source, isShowReplacements);
    console.log(`[${new Date().toLocaleTimeString('it-IT')}]`, '[unicodeToAscii] Replaced everywhere.');
  }

  return newSource;
}

/**
 * Plugin core function, pulls in the Node data stream,
 * then runs the replacement functions
 * @param  {object} options          plugin options
 * @return {Stream}                  stream
 */
module.exports = function unicodeToAscii(options) {
  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      const errorOptions = { fileName: file.path, showStack: true };
      const message = 'Streams are not supported';
      setImmediate(() => {
        callback(new Error('gulp-unicode-ascii', message, errorOptions));
      });
    }

    const contents = String(file.contents);
    const result = replaceUnicode(contents, options);
    file.contents = Buffer.from(result);

    setImmediate(() => {
      callback(null, file);
    });
  };

  return stream;
};