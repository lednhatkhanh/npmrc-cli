module.exports = {
  name: 'npmrc-cli',
  run: async toolbox => {
    const { print } = toolbox;

    print.info(
      'npmrc-cli is a small tool to help you manage multiple .npmrc profiles.',
    );
  },
};
