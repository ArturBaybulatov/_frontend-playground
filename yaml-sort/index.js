import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


const pathName = '../kubernetes.stage.content.yaml';
const file = fs.readFileSync(pathName, 'utf8');

const pathObj = path.parse(pathName);

pathObj.base = null;
pathObj.name = `${pathObj.name}-2`;

const doc = yaml.safeLoadAll(file);

const yamlString = yaml.safeDump(doc, {
  lineWidth: 200,
  sortKeys: true,
});

fs.writeFileSync(path.format(pathObj), yamlString);
