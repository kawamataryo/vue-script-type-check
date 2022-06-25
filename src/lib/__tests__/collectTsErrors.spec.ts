import { Project, ts } from "ts-morph";
import { describe, it, expect, beforeAll } from "vitest";
import { collectTsErrors } from "../collectTsErrors";
import chalk from "chalk";

describe("collectTsErrors", () => {
  let project: Project;
  beforeAll(() => {
    project = new Project({
      compilerOptions: { strict: true, jsx: "React" as unknown as ts.JsxEmit },
    });
  });

  it.each([
    {
      text: `
        const a: string = 1;
      `,
      fileName: "target.ts",
      expected: [
        `${chalk.green("target")}:${chalk.yellow("2")} - ${chalk.red(
          "error"
        )} TS2322: Type 'number' is not assignable to type 'string'.`,
      ],
    },
    {
      text: `
        const func = (num: number) => num
        func('a')
      `,
      fileName: "target.ts",
      expected: [
        `${chalk.green("target")}:${chalk.yellow("3")} - ${chalk.red(
          "error"
        )} TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
      ],
    },
    {
      text: `
        const func = (num: number) => num
        func('a')

        let a: string = 1;
      `,
      fileName: "target.ts",
      expected: [
        `${chalk.green("target")}:${chalk.yellow("3")} - ${chalk.red(
          "error"
        )} TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
        `${chalk.green("target")}:${chalk.yellow("5")} - ${chalk.red(
          "error"
        )} TS2322: Type 'number' is not assignable to type 'string'.`,
      ],
    },
    {
      text: `
        const a: number = 1;
      `,
      fileName: "target.ts",
      commentType: 1,
      expected: [],
    },
  ])("get ts errors", ({ text, fileName, expected }) => {
    const sourceFile = project.createSourceFile(fileName, text, {
      overwrite: true,
    });

    const result = collectTsErrors({ sourceFile, scriptStartLineCount: 0 });

    expect(result).toEqual(expected);
  });
});
