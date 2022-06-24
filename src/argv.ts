import chalk from "chalk";
import yargs from "yargs";

const isVueFilePaths = (argv: { targetFilePaths: string[] }) => {
  const targetFilePaths = argv.targetFilePaths;
  if (targetFilePaths.some((f) => !f.endsWith(".vue"))) {
    throw new Error(
      chalk.red("Error: A non-vue file is passed as the target file.")
    );
  } else {
    return true;
  }
};

export const argv = yargs
  .command(
    "* [targetFilePaths...]",
    "Command line Type-Checking tool for only the script part of Vue."
  )
  .positional("targetFilePaths", {
    describe:
      "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
    array: true,
    demandOption: true,
    type: "string",
  })
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
  .check(isVueFilePaths)
  .parseSync();
