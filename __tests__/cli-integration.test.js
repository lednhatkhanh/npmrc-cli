const { system, filesystem } = require('gluegun');
const { resolve } = require('path');
const { CONFIG_FILE, ROOT_DIR } = require('../src/config');

const src = resolve(__dirname, '..');

const cli = async cmd =>
  system.run('node ' + resolve(src, 'bin', 'npmrc-cli') + ` ${cmd}`);

test('outputs version', async () => {
  const output = await cli('--version');
  expect(output).toContain('0.0.1');
});

test('outputs help', async () => {
  const output = await cli('--help');
  expect(output).toContain('0.0.1');
});

afterEach(() => {
  filesystem.remove(ROOT_DIR);
});

describe('init', () => {
  test('should create ~/.npmrc-cli folder and ~/.npmrc-cli/.config', async () => {
    const output = await cli('init');

    expect(filesystem.exists(ROOT_DIR)).toEqual('dir');
    expect(filesystem.exists(CONFIG_FILE)).toEqual('file');
    expect(output).toContain(`${ROOT_DIR} created.`);
  });

  test('should throw error when ~/.npmrc-cli exists', async () => {
    filesystem.dir(ROOT_DIR);

    const output = await cli('init');

    expect(output).toContain(`${ROOT_DIR} exists.`);
  });
});

describe('new', () => {
  const profileName = 'test';
  const profileFile = `${ROOT_DIR}${filesystem.separator}.npmrc.${profileName}`;

  test("should throw error when ~/.npmrc-cli doesn't exist", async () => {
    const output = await cli(`new ${profileName}`);

    expect(output).toContain(
      `${ROOT_DIR} doesn't exist, run 'npmrc-cli init' first.`,
    );
  });

  test('should throw error when profile name is empty', async () => {
    filesystem.dir(ROOT_DIR);

    const output = await cli(`new`);

    expect(output).toContain('Profile name cannot be empty.');
  });

  test('should throw error when profile name is invalid', async () => {
    filesystem.dir(ROOT_DIR);

    const output = await cli(`new WRONG_NAME`);

    expect(output).toContain(
      'Profile name should contain only lowercase letters and use dashes to separate words.',
    );
  });

  test('should throw error when profile with the same name exists', async () => {
    filesystem.dir(ROOT_DIR);
    filesystem.file(profileFile);

    const output = await cli(`new ${profileName}`);

    expect(output).toContain(`${profileFile} exists.`);
  });

  test('should create correct file with passed profile name', async () => {
    filesystem.dir(ROOT_DIR);
    filesystem.file(CONFIG_FILE);

    const output = await cli(`new ${profileName}`);

    expect(filesystem.exists(profileFile)).toBe('file');
    expect(filesystem.read(CONFIG_FILE)).toBe(`ACTIVE_PROFILE=${profileName}`);

    expect(output).toContain(`${profileFile} created.`);
  });
});
