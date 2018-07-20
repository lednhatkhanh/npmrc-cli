#!/usr/bin/env node

import fs from "fs";
import childProcess from "child_process";

import program from "commander";
import chalk from "chalk";
import clipboardy from "clipboardy";

import { NPMRC_PATH, HOME_DIR, getFilePath } from "./utils";

program.version(process.env.npm_package_version as string, "-v, --version");

program
    .command("create")
    .alias("c")
    .arguments("<name>")
    .description("Create a new .npmrc file")
    .action((name: string) => {
        const filePath = getFilePath(name);

        if (fs.existsSync(filePath)) {
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

        if (!fs.existsSync(filePath)) {
            console.log(chalk.red(`.npmrc.${name} does not exist.`));
            return;
        }

        if (fs.existsSync(NPMRC_PATH)) {
            fs.unlinkSync(NPMRC_PATH);
            console.log(chalk.blue(`.npmrc has been removed.`));
        }

        fs.copyFileSync(filePath, NPMRC_PATH);
        console.log(chalk.blue(`.npmrc.${name} has been renamed to .npmrc.`));
    });

program
    .command("open")
    .alias("o")
    .arguments("[name]")
    .description("Edit a file. Leave [name] empty to open .npmrc")
    .option("-e [editorName]", "Editor to open the file.", "vim")
    .action((name: string | undefined, cmd: { E: string }) => {
        const filePath = name ? getFilePath(name) : NPMRC_PATH;

        if (!fs.existsSync(filePath)) {
            console.log(chalk.red(name ? `.npmrc.${name} does not exist.` : `.npmrc does not exist.`));
            return;
        }

        childProcess.spawn(cmd.E, [filePath], {
            stdio: "inherit",
        });
    });

program
    .command("clear")
    .alias("cl")
    .description("Remove the currently active .npmrc file.")
    .action(() => {
        if (!fs.existsSync(NPMRC_PATH)) {
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

        if (!fs.existsSync(filePath)) {
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

program
    .command("copy")
    .alias("cp")
    .arguments("[name]")
    .description("Copy content of a file. Leave [name] empty to open .npmrc")
    .action((name: string | undefined) => {
        if (!name) {
            const doesMainFileExist = fs.existsSync(NPMRC_PATH);
            if (!doesMainFileExist) {
                console.log(chalk.red(`.npmrc does not exist.`));
            }

            const buffer = fs.readFileSync(NPMRC_PATH);
            clipboardy.writeSync(buffer.toString());
        }
    });

program.parse(process.argv);
