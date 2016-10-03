/* eslint-disable no-var, object-shorthand, func-names, no-throw-literal, vars-on-top */
var crypto = require('crypto');
// var fs = require('fs-extra');

var baseDirs = {
  libFs: 'private/noland_crater-bunny/.lib/',
  libAssets: 'noland_crater-bunny/.lib/',
  userFs: 'private/noland_crater-bunny/',
  userAssets: 'noland_crater-bunny/',
};
var fileNames = {
  userInlineJs: 'inline.js',
  unusedCssSelectors: 'unused-css-selectors.txt',
  hashes: 'hashes.json',
  strippedCss: 'stripped.css',
};
var hashKeySeparator = '__';

/** Generics **************************/

function writeLibFile(path, data) {
  if (typeof Plugin !== 'undefined') Plugin.fs.writeFileSync(baseDirs.libFs + path, data);
  else throw 'Can only use writeLibFile() in build plugin context';
}

function readLibFile(path, Assets) {
  if (typeof Plugin !== 'undefined') return Plugin.fs.readFileSync(baseDirs.libFs + path, 'utf8');
  else if (Assets) return Assets.getText(baseDirs.libAssets + path);
  throw 'If not running in build plugin context, you must pass Assets to readLibFile()';
}

function readUserFile(path, Assets) {
  if (typeof Plugin !== 'undefined') return Plugin.fs.readFileSync(baseDirs.userFs + path, 'utf8');
  else if (Assets) return Assets.getText(baseDirs.userAssets + path);
  throw 'If not running in build plugin context, you must pass Assets to readUserFile()';
}

function constructHashKey(name, extension) {
  return name + hashKeySeparator + extension;
}

function constructHashedFilename(name, extension, hash) {
  return name + '.' + hash + '.' + extension;
}

function setHash(name, extension, data) {
  if (typeof Plugin === 'undefined') throw 'Can only use setHash() in build plugin context';
  var hashes = JSON.parse(readLibFile(fileNames.hashes, Assets));
  var hash = crypto.createHash('md5').update(data).digest('hex');
  hashes[constructHashKey(name, extension)] = hash;
  writeLibFile(fileNames.hashes, JSON.stringify(hashes));
  return hash;
}

function getHash(name, extension, Assets) {
  var hashes = JSON.parse(readLibFile(fileNames.hashes, Assets));
  return hashes[constructHashKey(name, extension)];
}

function saveHashedLibFile(name, extension, data) {
  var hash = setHash(name, extension, data);
  console.log('Hash: ', hash);
  writeLibFile(constructHashedFilename(name, extension, hash), data);
}

function readHashedLibFile(name, extension, Assets) {
  var filename = constructHashedFilename(name, extension, getHash(name, extension, Assets));
  return readLibFile(filename, Assets);
}

/** Specifics ***************/
function getUnusedCssSelectors() {
  return readUserFile(fileNames.unusedCssSelectors);
}

function getUserInlineJs(Assets) {
  return readUserFile(fileNames.userInlineJs, Assets);
}

function saveStrippedCss(data) {
  writeLibFile(fileNames.strippedCss, data);
  // saveHashedLibFile('stylesheets', 'css', data);
}
function getStrippedCss(Assets) {
  return readLibFile(fileNames.strippedCss, Assets);
  // return readHashedLibFile('stylesheets', 'css', Assets);
}

function saveMinifiedScripts(data) {
  console.log('save minified scripts');
  saveHashedLibFile('scripts', 'js', data);
}
function getMinifiedScripts(Assets) {
  return readHashedLibFile('scripts', 'js', Assets);
}


module.exports.getUnusedCssSelectors = getUnusedCssSelectors;
module.exports.getUserInlineJs = getUserInlineJs;
module.exports.saveMinifiedScripts = saveMinifiedScripts;
module.exports.getMinifiedScripts = getMinifiedScripts;
module.exports.saveStrippedCss = saveStrippedCss;
module.exports.getStrippedCss = getStrippedCss;
