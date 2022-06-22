#!/usr/bin/env node

import yargs from "yargs";
import { tsconfigExists } from "./lib/isExistTsConfig";
import { readFile } from "fs/promises";
import { Project } from "ts-morph";
import { extractTypeScriptFromVue } from "./lib/extractTypeScriptFromVue";
import { collectTsErrors } from "./lib/collectTsErrors";
import { generateProgressBar } from "./lib/progressBar";
import chalk from "chalk";

const argv = yargs
  .command(
    "* [target_files...]",
    "Command line Type-Checking tool for only the script part of Vue."
  )
  .positional("target_files", {
    describe:
      "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
    array: true,
    demandOption: true,
    type: "string",
  })
  .demandOption(["target_files"])
  .options({
    "tsconfig-path": {
      type: "string",
      default: "./tsconfig.json",
      alias: "t",
      describe: "Path to tsconfig.json",
      requiresArg: true,
    },
  })
  .strict()
  .help()
  .alias({ h: "help", v: "version" })
  .check((argv) => {
    const target_files = argv.target_files;
    if (target_files.some((f) => !f.endsWith(".vue"))) {
      throw new Error(
        chalk.red("Error: A non-vue file is passed as the target file.")
      );
    } else {
      return true;
    }
  })
  .parseSync();

const handler = async (argv: {
  tsconfigPath: string;
  target_files: string[];
}): Promise<void> => {
  tsconfigExists(argv);
  const { target_files, tsconfigPath } = argv;

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(target_files.length, 0);

  // Extract script from vue files
  const allFiles = await Promise.all(
    target_files.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const script = extractTypeScriptFromVue(fullText);
      return {
        path,
        fullText,
        script,
      };
    })
  );

  // Filter only files with script
  const targetFiles = allFiles.filter((file) => file.script !== "");

  const project = new Project({ tsConfigFilePath: tsconfigPath });

  const targetSourceFile = targetFiles.map((file) => {
    return project.createSourceFile(`${file.path}.ts`, file.script);
  });

  // Collect errors
  const errors = targetSourceFile
    .map((file) => {
      progressBar.increment();
      return collectTsErrors(file);
    })
    .flat()
    .filter((s) => s);

  progressBar.stop();

  const errorCount = errors.length;
  if (errorCount === 0) {
    console.log("\n✨ No type errors were found.");
    process.exit(0);
  }

  errors.forEach((error) => {
    console.log(error);
  });

  console.log(
    `\n🚨 Found ${chalk.red(errorCount + " errors")} in ${
      allFiles.length
    } files.`
  );
  process.exit(1);
};

handler(argv);
