/* eslint-disable no-var, no-underscore-dangle, func-names, prefer-arrow-callback */
var PostCss = require('./juliancwirko_meteor-PostCss');
var CssStripper = require('../lib/CssStripper');

function AsyncInlineMinifier() {}

Plugin.registerMinifier({
  extensions: ['css'],
  archMatching: 'web',
}, function () {
  var minifier = new AsyncInlineMinifier();
  return minifier;
});

AsyncInlineMinifier.prototype.processFilesForBundle = function (files, options) {
  var filesToMerge = [];
  var merged;
  var minifiedFiles;
  if (!files.length) return;

  files.forEach(function (file) {
    if (PostCss.isNotImport(file._source.url)) {
      filesToMerge.push(file);
    }
  });

  merged = PostCss.mergeCss(filesToMerge);

  if (true || options.minifyMode === 'production') {
    CssStripper.setMergedCss(merged.code);
    CssStripper.generateStrippedCss();
  }

  if (options.minifyMode === 'development') {
    files[0].addStylesheet({
      data: merged.code,
      sourceMap: merged.sourceMap,
      path: 'dev-crash-landing-merged.css',
    });
    return;
  }

  minifiedFiles = PostCss.minifyCss(merged.code);

  if (files.length) {
    minifiedFiles.forEach(function (minified) {
      files[0].addStylesheet({
        data: minified,
        path: 'prod-crash-landing-merged.css',
      });
    });
  }
};
