import { ZodPromiseDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export function parsePromiseDef(
  def: ZodPromiseDef,
  refs: Refs
): JsonSchema7Type | undefined {
  return parseDef(def.type._def, refs);
}
