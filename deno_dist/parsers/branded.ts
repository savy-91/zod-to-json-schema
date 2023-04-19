import { ZodBrandedDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export function parseBrandedDef(_def: ZodBrandedDef<any>, refs: Refs) {
  return parseDef(_def.type._def, refs);
}
