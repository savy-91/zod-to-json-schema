import { ZodPipelineDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";
import { JsonSchema7AllOfType } from "./intersection.ts";

export const parsePipelineDef = (
  def: ZodPipelineDef<any, any>,
  refs: Refs
): JsonSchema7AllOfType | JsonSchema7Type | undefined => {
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"],
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"],
  });

  return {
    allOf: [a, b].filter((x): x is JsonSchema7Type => x !== undefined),
  };
};
