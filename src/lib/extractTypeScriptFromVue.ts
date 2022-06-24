import { parse } from "node-html-parser";

export const extractTypeScriptFromVue = (source: string): [number, string] => {
  const script = parse(source).querySelector('script[lang="ts"]');
  if (!script) {
    return [0, ""];
  }

  const splittedSources = source.split(script.rawText);

  if (splittedSources.length === 0) {
    return [0, script.rawText];
  }

  const scriptStartLineCount = splittedSources[0].split("\n").length - 1;
  return [scriptStartLineCount, script.rawText];
};
