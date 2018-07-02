#!/usr/bin/env node

import fs from "fs";
import childProcess from "child_process";

import program from "commander";
import chalk from "chalk";

import { NPMRC_PATH, HOME_DIR, getFilePath, checkFileExists, checkActiveFileExists } from "./utils";

program.version("1.0.0", "-v, --version");

program
    .command("create")
    .alias("c")
    .arguments("<name>")
    .description("Create a new .npmrc file")
    .action((name: string) => {
        const filePath = getFilePath(name);

        if (checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} exists, please choose another name or remove this file first.`));
            return;
        }

        fs.writeFileSync(filePath, "");
        console.log(chalk.blue(`.npmrc.${name} has been created.`));
    });

program
    .command("use")
    .alias("u")
    .arguments("<name>")
    .description("Use a created .npmrc file.")
    .action((name: string) => {
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
    });

program
    .command("open")
    .alias("o")
    .arguments("<name>")
    .description("Edit a file.")
    .option("--editor [editorName]", "Editor to open the file.", "vim")
    .action((name: string, cmd: { editor: string }) => {
        const filePath = getFilePath(name);

        if (!checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        childProcess.spawn(cmd.editor, [filePath], {
            stdio: "inherit",
        });
    });

program
    .command("open-main")
    .alias("om")
    .description("Edit .npmrc file.")
    .option("--editor [name]", "Editor to open the file.", "vim")
    .action((cmd: { editor: string }) => {
        if (!checkActiveFileExists()) {
            console.log(chalk.red(`.npmrc does not exist.`));
            return;
        }

        const child = childProcess.spawn(cmd.editor, [NPMRC_PATH], {
            stdio: "inherit",
        });

        child.on("exit", () => {
            console.log(chalk.blue("Process has been ended."));
        });
    });

program
    .command("clear")
    .alias("cl")
    .description("Remove the currently active .npmrc file.")
    .action(() => {
        if (!checkActiveFileExists()) {
            console.log(chalk.red(`.npmrc does not exist.`));
            return;
        }

        fs.unlinkSync(NPMRC_PATH);
        console.log(chalk.blue(`.npmrc has been removed.`));
    });

program
    .command("remove")
    .alias("rm")
    .arguments("<name>")
    .description("Remove a file")
    .action((name: string) => {
        const filePath = getFilePath(name);

        if (!checkFileExists(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        fs.unlinkSync(filePath);
        console.log(chalk.blue(`.npmrc.${name} has been removed.`));
    });

program
    .command("list")
    .alias("ls")
    .description("List all created files.")
    .action(() => {
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
    });

program.parse(process.argv);
