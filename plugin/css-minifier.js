/* eslint-disable no-var, no-underscore-dangle, vars-on-top, func-names, prefer-arrow-callback */
var PostCss = require('./juliancwirko_meteor-PostCss');
var CssStripper = require('./CssStripper');
var paths = require('../lib/global-paths');

function CssMinifier() {}

Plugin.registerMinifier({
  extensions: ['css'],
  archMatching: 'web',
}, function () {
  var minifier = new CssMinifier();
  return minifier;
});

CssMinifier.prototype.processFilesForBundle = function (files, options) {
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

  // Development Minification
  if (options.minifyMode === 'development') {
    files[0].addStylesheet({
      data: merged.code,
      sourceMap: merged.sourceMap,
      path: 'crater-bunny-dev-merged.css',
    });
    return;
  }

  // Production Minification
  minifiedFiles = PostCss.minifyCss(merged.code);

  // Get CSS stripped of unused selectors
  var strippedCss = CssStripper.stripUnused(merged.code);
  // Add stripped CSS to styles
  files[0].addStylesheet({
    data: strippedCss,
    path: 'crater-bunny-stripped.css',
  });

  if (files.length) {
    minifiedFiles.forEach(function (minified) {
      files[0].addStylesheet({
        data: minified,
      });
    });
  }
};
