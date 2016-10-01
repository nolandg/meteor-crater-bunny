/* eslint-disable no-param-reassign, no-var, no-underscore-dangle, func-names, prefer-arrow-callback */
var CssParser = require('css');

var baseDir = 'private/noland_crash-landing/';
var paths = {
  mergedCss: baseDir + 'merged.css',
  strippedCss: baseDir + 'stripped.css',
  unusedSelectors: baseDir + 'unused-css-selectors.txt',
};

// Save the full merged css file (from the minifier before any stripping)
function setMergedCss(cssString) {
  if (!Plugin) console.error('Cannot use setUnoptimizedCss() on client!');
  Plugin.fs.writeFileSync(paths.mergedCss, cssString);
}

// Read and return the unstripped original file from the minifer
function getMergedCss() {
  if (!Plugin) console.error('Cannot use getUnoptimizedCss() on client!');
  return Plugin.fs.readFileSync(paths.mergedCss, 'utf8');
}

// Remove all unused selectors from an AST CSS rule object
// Recursive when it finds media queries
function stripUnusedSelectors(rule, unusedSelectors) {
  var mediaQuery;
  if (rule.type === 'comment') {
    // ignore comments for now
  } else if (rule.type === 'rule') {
    // cut down the selectors array to only the difference (ie !intersection)
    // between selectors and unused selectors
    rule.selectors = rule.selectors.filter(function (selector) {
      return unusedSelectors.indexOf(selector) === -1;
    });
  } else if (rule.type === 'media') {
    // this "rule" is actually a media query that itself contains rules
    mediaQuery = rule;
    mediaQuery.rules.forEach(function (mediaQueryRule) { stripUnusedSelectors(mediaQueryRule, unusedSelectors); });
  }
}

// Used to filter the rules array
// Return true to keep this rule in the file, false to remove it
// This is where we remove rules that now have zero selectors (yay!!)
// Can also remove comments here
function filterRule(rule) {
  var mediaQuery;
  // Remove comments
  if (rule.type === 'comment') {
    return false;
  }
  if (rule.type === 'rule') {
    // Keep rule if it still has at least one selector
    return rule.selectors.length;
  }
  if (rule.type === 'media') {
    // this "rule" is actually a media query that itself contains rules
    mediaQuery = rule;
    // recursively process the query
    mediaQuery.rules = mediaQuery.rules.filter(filterRule);
    // and only keep it if it still has rules
    return mediaQuery.rules.length;
  }
  return true; // keep anything else?
}

// Accept the full merged css and a string of unused selectors
// and return a string of css with unused selectors and rules removed.
function stripUnused(cssInputString, unusedSelectorsInputString) {
  var css = CssParser.parse(cssInputString);
  var unusedSelectors = unusedSelectorsInputString.trim();
  var cssString;

  // Split the unused selector string into an array
  // Selectors can be separated by either a newline or a comma followed by space
  unusedSelectors = unusedSelectors.split(/[\r\n]+\s*|,+\s*/);

  // Remove all unused selectors from every rule
  css.stylesheet.rules.forEach(function (rule) { stripUnusedSelectors(rule, unusedSelectors); });
  // Remove all rules that no longer have any selectors
  css.stylesheet.rules = css.stylesheet.rules.filter(filterRule);

  // Prepare output string
  cssString = CssParser.stringify(css, { compress: true });
  return cssString;
}

// Read the unused selectors and merged css files and generate and save
// the stripped css file
function generateStrippedCss() {
  var startTime;
  var cssString;
  var unusedSelectors;
  var strippedCss;

  if (!Plugin) console.error('Cannot use generateCriticalCss() on client!');
  console.log('Generating critical css...');
  startTime = Date.now();

  cssString = getMergedCss();
  unusedSelectors = Plugin.fs.readFileSync(paths.unusedSelectors, 'utf8');
  strippedCss = stripUnused(cssString, unusedSelectors, false);

  Plugin.fs.writeFileSync(paths.strippedCss, strippedCss);

  console.log('Finished generating critical css in ' + (Date.now() - startTime) + 'ms');
}

exports.getMergedCss = getMergedCss;
exports.setMergedCss = setMergedCss;
exports.generateStrippedCss = generateStrippedCss;
exports.stripUnused = stripUnused;
