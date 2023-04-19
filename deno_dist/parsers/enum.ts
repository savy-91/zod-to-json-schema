import { ZodEnumDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export type JsonSchema7EnumType = {
  type: "string";
  enum: string[];
};

export function parseEnumDef(def: ZodEnumDef): JsonSchema7EnumType {
  return {
    type: "string",
    enum: def.values,
  };
}
