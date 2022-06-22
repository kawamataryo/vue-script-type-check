import type { Arguments, Argv } from "yargs";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { tsconfigExists } from "../lib/isExistTsConfig";
import { readFile } from "fs/promises";
import glob from "glob";
import { Project } from "ts-morph";
import { extractTypeScriptFromVue } from "../lib/extractTypeScriptFromVue";
import { collectTsErrors } from "../lib/collectTsErrors";

export const command = "* [targetPathPattern]";
export const desc = "Type-Checking for only the script part of Vue";

export const builder = (yargs: Argv<DefaultOptions>): Argv<DefaultOptions> =>
  yargs.options(DEFAULT_OPTIONS).check(tsconfigExists);

export const handler = async (
  argv: Arguments<DefaultOptions>
): Promise<void> => {
  const { targetPathPattern, tsconfigPath } = argv;

  // Extract script from vue files
  const filePaths = glob.sync(targetPathPattern);
  const allFiles = await Promise.all(
    filePaths.map(async (path) => {
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

  const errors = targetSourceFile
    .map(collectTsErrors)
    .flat()
    .filter((s) => s);

  const errorCount = errors.length;
  if (errorCount === 0) {
    process.exit(0);
  }

  errors.forEach((error) => {
    console.log(error);
  });

  console.log(`Found ${errorCount} errors in ${filePaths.length} files.`);
  process.exit(1);
};
