/* eslint-disable */
Package.describe({
  name: 'noland:crater-bunny',
  version: '0.0.1',
  summary: 'Makes landing pages bunny-fast by inlining critical CSS and Javascript.',
  git: '',
  documentation: 'README.md',
});

Package.onUse(function(api){
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'isobuild:minifier-plugin',
    'webapp',
  ]);
  api.mainModule('./lib/crater-bunny.js');
});

Package.registerBuildPlugin({
  name: 'css-minifier',
  use: [
    'ecmascript',
    'minifier-css',
  ],
  npmDependencies: {
    'css': '2.2.1',
    'source-map': '0.5.6',
    'postcss': '5.0.21',
    'app-module-path': '1.0.6',
    'babel-preset-meteor': '6.12.0',
  },
  sources: [
    'plugin/css-minifier.js',
  ],
});
