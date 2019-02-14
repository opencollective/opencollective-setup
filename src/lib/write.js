import fs from 'fs';
import path from 'path';
import debug from 'debug';
import detectIndent from 'detect-indent';

const debugWrite = debug('opencollective-setup:write');

export function writeJSONFile(file, json) {
  file = path.resolve(file.replace(/^~/, process.env.HOME));
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(file, 'utf8');
  } catch (e) {
    debugWrite(e);
  }
  try {
    const indent = detectIndent(fileContent).indent || '  ';
    fs.writeFileSync(file, JSON.stringify(json, null, indent));
  } catch (e) {
    debugWrite('Unable to write JSON file', file);
    debugWrite(e);
  }
}
