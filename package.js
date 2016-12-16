/* eslint-disable */
Package.describe({
  name: 'noland:crater-bunny',
  version: '0.1.8',
  summary: 'Make landing pages super fast with SSR, async, inline, and auto-cleaned CSS',
  git: 'https://github.com/nolandg/meteor-crater-bunny',
  documentation: 'README.md',
});

Package.onUse(function(api){
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'isobuild:minifier-plugin@1.0.0',
    'webapp',
  ]);
  api.mainModule('./lib/crater-bunny.js');
});

Package.registerBuildPlugin({
  name: 'css-minifier',
  use: [
    'ecmascript',
    'minifier-css@1.0.0',
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
