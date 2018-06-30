#!/usr/bin/env node

import os from "os";
import fs from "fs";
import path from "path";
import childProcess from "child_process";

// import * as inquirer from "inquirer";
import program from "commander";
import chalk from "chalk";

const HOME_DIR = os.homedir();
const NPMRC_NAME = ".npmrc";
const NPMRC_PATH = path.join(HOME_DIR, NPMRC_NAME);
const EDITOR = "vim";

program
    .version("1.0.0", "-v, --version")
    .option("create <name>", "Create a new .npmrc file", (name: string) => {
        const filePath = getFilePath(name);

        if (checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} exists, please choose another name or remove this file first.`));
            return;
        }

        fs.writeFileSync(filePath, "");
        console.log(chalk.blue(`.npmrc.${name} has been created.`));
    })
    .option("remove <name>", "Remove a .npmrc file", (name: string) => {
        const filePath = getFilePath(name);

        if (!checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        fs.unlinkSync(filePath);
        console.log(chalk.blue(`.npmrc.${name} has been removed.`));
    })
    .option("use <name>", "Use a created .npmrc file.", (name: string) => {
        const filePath = getFilePath(name);

        if (!checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        if (checkActiveFileExists()) {
            fs.unlinkSync(NPMRC_PATH);
            console.log(chalk.blue(`.npmrc has been removed.`));
        }

        fs.copyFileSync(filePath, NPMRC_PATH);
        console.log(chalk.blue(`.npmrc.${name} has been renamed to .npmrc.`));
    })
    .option("open <name>", "Edit a file.", (name: string) => {
        const filePath = getFilePath(name);

        if (!checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        const child = childProcess.spawn(EDITOR, [filePath], {
            stdio: "inherit",
        });

        child.on("exit", () => {
            console.log(chalk.blue("Process has been ended."));
        });
    })
    .option("open-main", "Edit .npmrc file.", () => {
        if (!checkActiveFileExists()) {
            console.log(chalk.red(`.npmrc does not exist.`));
            return;
        }

        const child = childProcess.spawn(EDITOR, [NPMRC_PATH], {
            stdio: "inherit",
        });

        child.on("exit", () => {
            console.log(chalk.blue("Process has been ended."));
        });
    })
    .option("list", "Get a list of all created .npmrc files.", () => {
        const doesMainFileExist = fs.existsSync(NPMRC_PATH);

        if (doesMainFileExist) {
            console.log(`There is a active .npmrc file.`);
        }

        const files: string[] = fs.readdirSync(HOME_DIR, { encoding: "utf-8" }) as string[];

        console.log(chalk.blue("List of available files:"));

        files.forEach((fileName: string) => {
            const isMatch = /^.npmrc\..*/.test(fileName);
            if (isMatch) {
                console.log(chalk.white(fileName));
            }
        });
    })
    .parse(process.argv);

function getFilePath(name: string): string {
    return `${NPMRC_PATH}.${name}`;
}

function checkFileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}

function checkActiveFileExists(): boolean {
    return fs.existsSync(NPMRC_PATH);
}
