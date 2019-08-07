import fs from 'fs';

const defaultFundingYml = `open_collective: <YOUR-COLLECTIVE-SLUG>

`;

export function addFunding(filepath, collective) {
  console.log('> Adding .github/FUNDING.yml');
  const fundingYml = defaultFundingYml.replace(
    '<YOUR-COLLECTIVE-SLUG>',
    collective.slug,
  );
  fs.writeFileSync(filepath, fundingYml, 'utf8');
}
