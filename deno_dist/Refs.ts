import { ZodTypeDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { getDefaultOptions, Options } from "./Options.ts";
import { JsonSchema7Type } from "./parseDef.ts";

export type Refs = {
  seen: Seen[];
  currentPath: string[];
  propertyPath: string[] | undefined;
} & Options<"jsonSchema7" | "openApi3">;

export type Seen = {
  def: ZodTypeDef;
  path: string[];
  jsonSchema: JsonSchema7Type | undefined;
};

export const getRefs = (
  options?: string | Partial<Options<"jsonSchema7" | "openApi3">>
): Refs => {
  const _options = getDefaultOptions(options);
  const currentPath =
    _options.name !== undefined
      ? [..._options.basePath, _options.definitionPath, _options.name]
      : _options.basePath;
  return {
    ..._options,
    currentPath: currentPath,
    propertyPath: undefined,
    seen: [],
  };
};
