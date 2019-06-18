import debug from 'debug';

import { readJSONFile } from '../lib/utils';
import { writeJSONFile } from '../lib/write';

const debugAddPostInstall = debug('opencollective-setup:addPostInstall');

export function addPostInstall(projectPackageJSON, collective) {
  const pkg = readJSONFile(projectPackageJSON);
  if (!pkg) {
    console.log('Cannot load the `package.json` of your project');
    console.log(
      'Please make sure you are running `opencollective-postinstall` from the root directory of your project.',
    );
    console.log('');
    return;
  } else if (
    pkg.scripts &&
    pkg.scripts.postinstall &&
    pkg.scripts.postinstall.match(/opencollective-postinstall/)
  ) {
    debug('Open Collective postinstall already configured 👌');
    return;
  }

  console.log('> Updating your package.json');
  pkg.collective = {
    type: 'opencollective',
    url: `https://opencollective.com/${collective.slug}`,
  };

  const postinstall = 'opencollective-postinstall';
  pkg.scripts = pkg.scripts || {};
  if (
    pkg.scripts.postinstall &&
    pkg.scripts.postinstall.indexOf(postinstall) === -1
  ) {
    pkg.scripts.postinstall = `${pkg.scripts.postinstall} && ${postinstall}`;
  } else {
    pkg.scripts.postinstall = `${postinstall} || true`;
  }
  if (!pkg.dependencies || !pkg.dependencies['opencollective-postinstall']) {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['opencollective-postinstall'] = '^2.0.2';
  }
  debugAddPostInstall('Writing to package.json', {
    collective: pkg.collective,
    scripts: pkg.scripts,
  });
  return writeJSONFile(projectPackageJSON, pkg);
}
