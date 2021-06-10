import { readFileSync } from "fs";
import { compile } from "handlebars";

interface ITemplateData {
  path: string;
  variables: {
    [key: string]: string | number;
  };
}

export async function parseTemplate({
  path,
  variables,
}: ITemplateData): Promise<string> {
  const html = readFileSync(path, "utf-8");
  return compile(html)(variables);
}
