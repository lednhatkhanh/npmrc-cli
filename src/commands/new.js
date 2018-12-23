const { getProfileFile } = require('../config');
const { ensureRootDirExists, ensureValidProfileName } = require('../utils');

module.exports = {
  name: 'new',
  alias: ['n'],
  run: async toolbox => {
    const {
      print: { error, success },
      filesystem: { exists, file },
      parameters: { string },
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
    if (exists(PROFILE_FILE)) {
      return error(`${PROFILE_FILE} exists.`);
    }

    file(PROFILE_FILE);

    success(`${PROFILE_FILE} created.`);
  },
};
