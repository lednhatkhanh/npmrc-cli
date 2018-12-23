const {
  CONFIG_FILE,
  getProfileFile,
  NPMRC_FILE,
  ACTIVE_PROFILE_CONFIG,
} = require('../config');
const { ensureRootDirExists, ensureValidProfileName } = require('../utils');

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
    let errorMessage;

    errorMessage = ensureRootDirExists();
    if (errorMessage) {
      return error(errorMessage);
    }

    errorMessage = ensureValidProfileName(string);
    if (errorMessage) {
      return error(errorMessage);
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
