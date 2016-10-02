/* eslint-disable */
Package.describe({
  name: 'noland:crash-landing',
  version: '0.0.1',
  summary: 'Inlines critical CSS and Javascript and makes the rest load async to render server-side rendered pages faster.',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'isobuild:minifier-plugin',
    'webapp',
  ]);
  api.mainModule('./lib/CrashLanding.js');
});

Npm.depends({
  css: '2.2.1',
  'fs-extra': '0.8.1',
  'inherits': '2.0.3',
})

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('noland:crash-landing');
  api.mainModule('crash-landing-tests.js');
});

Package.registerBuildPlugin({
  name: 'css-minifier',
  use: [
    'ecmascript',
    'minifier-css',
  ],
  npmDependencies: {
    'css': '2.2.1',
    'inherits': '2.0.3',
    'source-map': '0.5.6',
    'postcss': '5.0.21',
    'app-module-path': '1.0.6',
    'babel-preset-meteor': '6.12.0',
    'fs-extra': '0.8.1',
  },
  sources: [
    'plugin/css-minifier.js',
  ],
});

Package.registerBuildPlugin({
  name: 'js-minifier',
  use: [
    'ecmascript',
    'minifier-js'
  ],
  npmDependencies: {
    'inherits': '2.0.3',
  },
  sources: [
    'plugin/js-minifier.js',
    'lib/global-paths.js',
  ]
});
