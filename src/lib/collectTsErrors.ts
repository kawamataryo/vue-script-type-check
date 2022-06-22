import { Diagnostic, SourceFile } from "ts-morph";
import chalk from "chalk";

const getMessageText = (d: Diagnostic): string => {
  const maybeMessageText = d.getMessageText();

  if (typeof maybeMessageText === "string") {
    return maybeMessageText;
  }
  return maybeMessageText.getMessageText();
};

const createErrorMessageFromDiagnostics = (d: Diagnostic): string => {
  const lineNumber = d.getLineNumber();
  const errorCode = d.getCode();
  const messageText = getMessageText(d);
  const relativePath =
    d
      .getSourceFile()
      ?.getFilePath()
      .replace(`${process.cwd()}/`, "")
      .replace(/\.ts$/, "") ?? "";

  return `${chalk.green(relativePath)}:${chalk.yellow(
    lineNumber
  )} - ${chalk.red("error")} TS${errorCode}: ${messageText}`;
};

export const collectTsErrors = (sourceFile: SourceFile): string[] => {
  return sourceFile
    .getPreEmitDiagnostics()
    .map((d) => {
      const diagnosticCategory = d.getCategory();
      // Skip not error
      if (diagnosticCategory !== 1) {
        return "";
      }
      return createErrorMessageFromDiagnostics(d);
    })
    .filter((s) => s);
};
