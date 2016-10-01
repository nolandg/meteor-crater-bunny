/* eslint-disable no-var, object-shorthand, func-names */
var crypto = require('crypto');

var baseDir = 'private/noland_crash-landing/';
var assetsBaseDir = baseDir.replace('private/', '');
var hashesFileName = 'hashes.json';
var hashKeySeparator = '__';

module.exports.unusedSelectors = baseDir + 'unused-css-selectors.txt';

module.exports.addHash = function (key, data) {
  var hashes = JSON.parse(Plugin.fs.readFileSync(baseDir + hashesFileName), 'utf8');
  var hash = crypto.createHash('md5').update(data).digest('hex');
  hashes[key] = hash;
  Plugin.fs.writeFileSync(baseDir + hashesFileName, JSON.stringify(hashes));
  return hash;
};

module.exports.saveAsset = function (name, extension, data) {
  var hash = module.exports.addHash(name + hashKeySeparator + extension, data);
  Plugin.fs.writeFileSync(baseDir + name + '.' + hash + '.' + extension, data);
};

module.exports.getAsset = function (name, extension, Assets) {
  var hashes = JSON.parse(Assets.getText(assetsBaseDir + hashesFileName), 'utf8');
  var hash = hashes[name + hashKeySeparator + extension];
  var path = assetsBaseDir + name + '.' + hash + '.' + extension;
  var data = Assets.getText(path);
  return data;
};
