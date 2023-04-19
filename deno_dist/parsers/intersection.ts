import { ZodIntersectionDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export type JsonSchema7AllOfType = {
  allOf: JsonSchema7Type[];
};

export function parseIntersectionDef(
  def: ZodIntersectionDef,
  refs: Refs
): JsonSchema7AllOfType | JsonSchema7Type | undefined {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"],
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"],
    }),
  ].filter((x): x is JsonSchema7Type => !!x);

  return allOf.length ? { allOf } : undefined;
}
