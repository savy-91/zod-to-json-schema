import { ZodLiteralDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { Refs } from "../Refs.ts";

export type JsonSchema7LiteralType =
  | {
      type: "string" | "number" | "integer" | "boolean";
      const: string | number | boolean;
    }
  | {
      type: "object" | "array";
    };

export function parseLiteralDef(
  def: ZodLiteralDef,
  refs: Refs
): JsonSchema7LiteralType {
  const parsedType = typeof def.value;
  if (
    parsedType !== "bigint" &&
    parsedType !== "number" &&
    parsedType !== "boolean" &&
    parsedType !== "string"
  ) {
    return {
      type: Array.isArray(def.value) ? "array" : "object",
    };
  }

  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value],
    } as any;
  }

  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value,
  };
}
