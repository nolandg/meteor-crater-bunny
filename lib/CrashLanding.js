import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import InlineStrippedCss from './InlineStrippedCss.jsx';

checkNpmVersions({
  'react': '^15.3.2',
  'react-helmet': '^3.1.0',
}, 'noland:crash-landing');

export { InlineStrippedCss };
