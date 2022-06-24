import { tsconfigExists } from "./lib/isExistTsConfig";
import { readFile } from "fs/promises";
import { Project } from "ts-morph";
import { extractTypeScriptFromVue } from "./lib/extractTypeScriptFromVue";
import { collectTsErrors } from "./lib/collectTsErrors";
import { generateProgressBar } from "./lib/progressBar";
import chalk from "chalk";

export const handler = async (argv: {
  tsconfigPath: string;
  targetFilePaths: string[];
}): Promise<void> => {
  tsconfigExists(argv);
  const { targetFilePaths, tsconfigPath } = argv;

  // Extract script from vue files
  const allFiles = await Promise.all(
    targetFilePaths.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const [scriptStartLineCount, script] = extractTypeScriptFromVue(fullText);
      return {
        path,
        fullText,
        script,
        scriptStartLineCount,
      };
    })
  );

  // Filter only files with script
  const targetFiles = allFiles.filter((file) => file.script !== "");

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(targetFiles.length, 0);

  const project = new Project({ tsConfigFilePath: tsconfigPath });

  const targetSourceFile = targetFiles.map((file) => {
    return {
      sourceFile: project.createSourceFile(`${file.path}.ts`, file.script),
      scriptStartLineCount: file.scriptStartLineCount,
    };
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
      targetFiles.length
    } files.`
  );
  process.exit(1);
};
