/* eslint-disable no-var, object-shorthand, func-names, no-throw-literal, vars-on-top */

var baseDirs = {
  userFs: 'private/noland_crater-bunny/',
  userAssets: 'noland_crater-bunny/',
};
var fileNames = {
  userInlineJs: 'inline.js',
  unusedCssSelectors: 'unused-css-selectors.txt',
};

/** Generics **************************/
function readUserFile(path, Assets) {
  if (typeof Plugin !== 'undefined') return Plugin.fs.readFileSync(baseDirs.userFs + path, 'utf8');
  else if (Assets) return Assets.getText(baseDirs.userAssets + path);
  throw 'If not running in build plugin context, you must pass Assets to readUserFile()';
}

/** Specifics ***************/
function getUnusedCssSelectors() {
  return readUserFile(fileNames.unusedCssSelectors);
}

function getUserInlineJs(Assets) {
  return readUserFile(fileNames.userInlineJs, Assets);
}

module.exports.getUnusedCssSelectors = getUnusedCssSelectors;
module.exports.getUserInlineJs = getUserInlineJs;
