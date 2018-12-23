const { PROFILE_NAME_REGEX } = require('../config');

function ensureValidProfileName(name) {
  if (!name) {
    return 'Profile name cannot be empty.';
  }

  if (!PROFILE_NAME_REGEX.test(name)) {
    return 'Profile name should contain only lowercase letters and use dashes to separate words.';
  }

  return undefined;
}

module.exports = ensureValidProfileName;
