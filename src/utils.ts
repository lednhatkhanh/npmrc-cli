import os from "os";
import path from "path";

export const HOME_DIR = os.homedir();
export const NPMRC_NAME = ".npmrc";
export const NPMRC_PATH = path.join(HOME_DIR, NPMRC_NAME);

export function getFilePath(name: string): string {
    return `${NPMRC_PATH}.${name}`;
}
