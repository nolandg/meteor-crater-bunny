/* eslint-disable no-param-reassign, vars-on-top, no-var, no-underscore-dangle, func-names, prefer-arrow-callback */
var CssParser = require('css');
var paths = require('../lib/global-paths');

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
  if (rule.type === 'font-face') {
    // Look for a white-listed font family to keep
    var keep = false;
    rule.declarations.forEach(function (dec) {
      if (dec.value.indexOf('fontello') !== -1) keep = true;
    });
    return keep;
  }
  return true; // keep anything else?
}

// Accept the full merged css and a string of unused selectors
// and return a string of css with unused selectors and rules removed.
function stripUnused(cssInputString, unusedSelectorsInputString) {
  if (!unusedSelectorsInputString) {
    unusedSelectorsInputString = paths.getUnusedCssSelectors();
  }
  var css = CssParser.parse(cssInputString);
  var unusedSelectors = unusedSelectorsInputString.trim();
  var strippedCssString;

  // Split the unused selector string into an array
  // Selectors can be separated by either a newline or a comma followed by space
  unusedSelectors = unusedSelectors.split(/[\r\n]+\s*|,+\s*/);

  // Remove all unused selectors from every rule
  css.stylesheet.rules.forEach(function (rule) { stripUnusedSelectors(rule, unusedSelectors); });
  // Remove all rules that no longer have any selectors
  css.stylesheet.rules = css.stylesheet.rules.filter(filterRule);

  // Prepare output string
  strippedCssString = CssParser.stringify(css, { compress: false });
  return strippedCssString;
}

exports.stripUnused = stripUnused;
