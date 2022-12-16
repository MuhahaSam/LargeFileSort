const fs = require('fs')
import {plainToClass} from 'class-transformer';
import {validateSync} from 'class-validator';
import {load} from 'js-yaml';

import { Settings } from './settings';

const SETTINGS_PARSING_ERROR = '\n\nSETTINGS PARSING ERROR';

function parseYml(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return load(content);
  } catch (e) {
    console.error("\x1b[31m", `${SETTINGS_PARSING_ERROR} ${filePath}`);
    console.error("\x1b[31m", e);
    process.exit(1);
  }
}

function validateSettings(settings: Settings): Settings {
    const errors = validateSync(settings);
  
    if (errors.length) {
      console.error("\x1b[31m", SETTINGS_PARSING_ERROR);
      console.error("\x1b[31m", errors.join('\n'));
      process.exit(1);
    }
  
    return settings;
  }

function getSettings(settingsFilePath = './settings.yml'): Settings {
    let settings = parseYml(settingsFilePath);

    if (!settings) {
        console.error("\x1b[31m", `${SETTINGS_PARSING_ERROR} empty file content`);
        process.exit(1);
    }

    settings = validateSettings(plainToClass(Settings, settings));

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    settings.apiVersion = packageJson.version;

    console.log(settings)

    return settings;
}
  
  const settings = getSettings();
  
  export default settings;