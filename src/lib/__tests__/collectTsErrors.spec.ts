import { Project, ts } from "ts-morph";
import { describe, it, expect, beforeAll } from "vitest";
import { collectTsErrors } from "../collectTsErrors";

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
        "\x1B[32mtarget\x1B[39m:\x1B[33m2\x1B[39m - \x1B[31merror\x1B[39m TS2322: Type 'number' is not assignable to type 'string'.",
      ],
    },
    {
      text: `
        const func = (num: number) => num
        func('a')
      `,
      fileName: "target.ts",
      expected: [
        "\x1B[32mtarget\x1B[39m:\x1B[33m3\x1B[39m - \x1B[31merror\x1B[39m TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",
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
        "\x1B[32mtarget\x1B[39m:\x1B[33m3\x1B[39m - \x1B[31merror\x1B[39m TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",
        "\x1B[32mtarget\x1B[39m:\x1B[33m5\x1B[39m - \x1B[31merror\x1B[39m TS2322: Type 'number' is not assignable to type 'string'.",
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
