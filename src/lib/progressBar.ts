import cliProgress from "cli-progress";
import chalk from "chalk";

export const generateProgressBar = (): cliProgress.SingleBar =>
  new cliProgress.SingleBar(
    {
      format: `progress [${chalk.green(
        "{bar}"
      )}] {percentage}% | {value}/{total}`,
    },
    cliProgress.Presets.rect
  );
