const { ROOT_DIR, CONFIG_FILE } = require('../config');

module.exports = {
  name: 'init',
  alias: ['i'],
  run: async toolbox => {
    const {
      print: { error, success },
      filesystem: { exists, dir, file },
    } = toolbox;

    if (exists(ROOT_DIR)) {
      return error(`${ROOT_DIR} exists.`);
    }

    dir(ROOT_DIR);
    file(CONFIG_FILE);

    success(`${ROOT_DIR} created.`);
  },
};
