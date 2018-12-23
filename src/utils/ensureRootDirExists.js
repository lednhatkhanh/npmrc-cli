const { filesystem } = require('gluegun');

const { ROOT_DIR } = require('../config');

function ensureRootDirExists() {
  if (!filesystem.exists(ROOT_DIR)) {
    return `${ROOT_DIR} doesn't exist, run 'npmrc-cli init' first.`;
  }
}

module.exports = ensureRootDirExists;
