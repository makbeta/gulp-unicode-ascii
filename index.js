const Stream = require('stream');

function replaceUnicode(source) {
  const UNICODE_MATCH_REG = /[^\u0000-\u007F]/g;
  const CONTENT_MATCH_REG = /(?<!-)content\s*:\s*([^;\}]+)/g;
  const newSource = source.replace(CONTENT_MATCH_REG, (m, p1) => {
    return m.replace(UNICODE_MATCH_REG, (m) => {
      return `\\${m.charCodeAt(0).toString(16)}`;
    });
  });
  return newSource;
}

module.exports = function unicodeAscii() {
  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      const errorOptions = { fileName: file.path, showStack: true };
      const message = 'Streams are not supported';
      setImmediate(() => {
        callback(new Error('unicode-to-ascii', message, errorOptions));
      });
    }

    const contents = String(file.contents);
    const result = replaceUnicode(contents);
    file.contents = Buffer.from(result);

    setImmediate(() => {
      callback(null, file);
    });
  };

  return stream;
};
