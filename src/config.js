const { filesystem } = require('gluegun');

const ROOT_DIR = `${filesystem.homedir()}${filesystem.separator}.npmrc-cli`;
const CONFIG_FILE = `${ROOT_DIR}${filesystem.separator}.config.json`;
const NPMRC_FILE = `${filesystem.homedir()}${filesystem.separator}.npmrc`;

const PROFILE_NAME_REGEX = /^[a-z]+(-[a-z]+)*$/;
const ACTIVE_PROFILE_CONFIG = 'activeProfile';

function getProfileFile(name) {
  return `${ROOT_DIR}${filesystem.separator}.npmrc.${name}`;
}

module.exports = {
  ROOT_DIR,
  CONFIG_FILE,
  PROFILE_NAME_REGEX,
  getProfileFile,
  NPMRC_FILE,
  ACTIVE_PROFILE_CONFIG,
};
