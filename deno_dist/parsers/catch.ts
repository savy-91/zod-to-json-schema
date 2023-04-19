import { ZodCatchDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
