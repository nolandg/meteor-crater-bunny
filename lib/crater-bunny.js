import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import CraterBunny from './CraterBunny';

checkNpmVersions({
  'react': '^15.3.2',
  'react-helmet': '^3.1.0',
}, 'noland:crater-bunny');

export { CraterBunny };
