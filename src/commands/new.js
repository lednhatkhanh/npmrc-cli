const { ROOT_DIR, PROFILE_NAME_REGEX, getProfileFile } = require('../config');

module.exports = {
  name: 'new',
  alias: ['n'],
  run: async toolbox => {
    const {
      print: { error, success },
      filesystem: { exists, file },
      parameters: { string },
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
    if (exists(PROFILE_FILE)) {
      return error(`${PROFILE_FILE} exists.`);
    }

    file(PROFILE_FILE);

    success(`${PROFILE_FILE} created.`);
  },
};
