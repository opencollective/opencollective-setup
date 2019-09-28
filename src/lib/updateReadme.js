import debug from 'debug';
import path from 'path';
import fs from 'fs';
import { error, detectBadge } from '../lib/utils';

const debugUpdateReadme = debug('opencollective-setup:updateReadme');

export function updateReadme(filepath, collective) {
  const templateFile = filepath.slice(filepath.lengh -1) == "t" ? path.join(__dirname, '../templates/README.rst') : path.join(__dirname, '../templates/README.md');

  const badgesmd = `[![Financial Contributors on Open Collective](https://opencollective.com/${collective.slug}/all/badge.svg?label=financial+contributors)](https://opencollective.com/${collective.slug})`;
  const badgeshtml = `<a href="https://opencollective.com/${collective.slug}" alt="Financial Contributors on Open Collective"><img src="https://opencollective.com/${collective.slug}/all/badge.svg?label=financial+contributors" /></a>`;
  const badgesrst = `.. image:: https://opencollective.com/${collective.slug}/all/badge.svg?label=financial+contributors
    :alt: Financial Contributors on Open Collective
    :target: https://opencollective.com/${collective.slug}`

  let readme;
  try {
    readme = fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    console.log('> Unable to open your README file');
    debugUpdateReadme(e);
    return Promise.reject(e);
  }

  if (
    readme.indexOf(
      `https://opencollective.com/${collective.slug}/all/badge.svg`,
    ) !== -1
  ) {
    error(
      'Looks like you already have Open Collective added to your README.md',
    );
    return Promise.reject(
      new Error('Open Collective already added in README.md'),
    );
  }

  let template;
  try {
    template = fs.readFileSync(templateFile, 'utf8');
  } catch (e) {
    debug(e);
    return Promise.reject(e);
  }

  const placeholders = template.replace(
    /{{([^}]+)}}/g,
    (str, attr) => collective[attr],
  );

  const lines = readme.split('\n');
  const newLines = [];

  let firstBadgeDetected = false,
    placeholdersPlaced = false;
  lines.forEach(line => {
    if (!firstBadgeDetected && detectBadge(line)) {
      firstBadgeDetected = true;
      if (line.match(/<img src/i)) {
        line = line.replace(/<img src/i, `${badgeshtml} <img src`);
      } else if (line.match(/.. image::/i)) {
        line = line.replace(/.. image::/i,`${badgesrst} .. image::`);
      } else {
        line = line.replace(/(\[!|!\[)/i, `${badgesmd} $1`);
      }
    }

    // We place the placeholders just above the license section if any
    if (!placeholdersPlaced) {
      if (line.match(/^#+.*License.*/i)) {
        newLines.push(placeholders);
        placeholdersPlaced = true;
      }
    }
    newLines.push(line);
  });

  if (!placeholdersPlaced) {
    newLines.push(placeholders);
  }

  readme = newLines.join('\n');
  console.log(
    '> Adding badges and placeholders for backers and sponsors on your README.md',
  );
  try {
    fs.writeFileSync(filepath, readme, 'utf8');
    return Promise.resolve(readme);
  } catch (e) {
    return Promise.reject(e);
  }
}
