/* eslint-disable no-var, no-undef, new-cap, no-underscore-dangle, func-names, vars-on-top, prefer-arrow-callback */
// This is a near clone of meteor/packages/standard-minifier-js/plugin/minify-js.js
// https://github.com/meteor/meteor/blob/devel/packages/standard-minifier-js/plugin/minify-js.js
var paths = require('../lib/global-paths');

function JsMinifier() {}

Plugin.registerMinifier({
  extensions: ['js'],
  archMatching: 'web',
}, function () {
  var minifier = new JsMinifier();
  return minifier;
});

JsMinifier.prototype.processFilesForBundle = function (files, options) {
  var mode = options.minifyMode;

  // don't minify anything for development
  if (mode === 'development') {
    files.forEach(function (file) {
      file.addJavaScript({
        data: file.getContentsAsBuffer(),
        sourceMap: file.getSourceMap(),
        path: file.getPathInBundle(),
      });
    });
    return;
  }

  var minifyOptions = {
    fromString: true,
    compress: {
      drop_debugger: false,
      unused: false,
      dead_code: false,
    },
  };

  var allJs = '';
  files.forEach(function (file) {
    // Don't reminify *.min.js.
    if (/\.min\.js$/.test(file.getPathInBundle())) {
      allJs += file.getContentsAsString();
    } else {
      allJs += UglifyJSMinify(file.getContentsAsString(), minifyOptions).code;
    }
    allJs += '\n\n';

    Plugin.nudge();
  });

  if (files.length) {
    files[0].addJavaScript({ data: allJs });
  }

  paths.saveAsset('scripts', 'js', allJs);
};
