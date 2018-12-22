const { filesystem } = require('gluegun');

const ROOT_DIR = `${filesystem.homedir()}${filesystem.separator}.npmrc-cli`;
const CONFIG_FILE = `${ROOT_DIR}${filesystem.separator}.config`;
const PROFILE_NAME_REGEX = /^[a-z]+(-[a-z]+)*$/;

function getProfileFile(name) {
  return `${ROOT_DIR}${filesystem.separator}.npmrc.${name}`;
}

module.exports = {
  ROOT_DIR,
  CONFIG_FILE,
  PROFILE_NAME_REGEX,
  getProfileFile,
};
