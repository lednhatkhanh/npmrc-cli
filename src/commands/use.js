const {
  ROOT_DIR,
  PROFILE_NAME_REGEX,
  CONFIG_FILE,
  getProfileFile,
  NPMRC_FILE,
  ACTIVE_PROFILE_CONFIG,
} = require('../config');

module.exports = {
  name: 'use',
  alias: ['u'],
  run: async toolbox => {
    const {
      print: { error, success },
      filesystem: { exists, file, symlink, write },
      parameters: { string },
      patching: { update },
    } = toolbox;

    if (!exists(ROOT_DIR)) {
      return error(`${ROOT_DIR} doesn't exist, run 'npmrc-cli init' first.`);
    }

    if (!string) {
      return error('Profile name cannot be empty.');
    }

    if (!PROFILE_NAME_REGEX.test(string)) {
      return error(
        'Profile name should contain only lowercase letters and use dashes to separate words.',
      );
    }

    const PROFILE_FILE = getProfileFile(string);
    if (!exists(PROFILE_FILE)) {
      return error(`${PROFILE_FILE} doesn't exist.`);
    }

    symlink(PROFILE_FILE, NPMRC_FILE);

    if (!exists(CONFIG_FILE)) {
      file(CONFIG_FILE);
      write(CONFIG_FILE, '{}');
    }

    await update(CONFIG_FILE, config => {
      config[ACTIVE_PROFILE_CONFIG] = string;
      return config;
    });

    success(`Symlink created: ${PROFILE_FILE} -> ${NPMRC_FILE}.`);
  },
};
