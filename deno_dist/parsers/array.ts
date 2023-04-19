import { ZodArrayDef, ZodFirstPartyTypeKind } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { ErrorMessages, setResponseValueAndErrors } from "../errorMessages.ts";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export type JsonSchema7ArrayType = {
  type: "array";
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
  errorMessages?: ErrorMessages<JsonSchema7ArrayType, "items">;
};

export function parseArrayDef(def: ZodArrayDef, refs: Refs) {
  const res: JsonSchema7ArrayType = {
    type: "array",
  };
  if (def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"],
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(
      res,
      "minItems",
      def.minLength.value,
      def.minLength.message,
      refs
    );
  }
  if (def.maxLength) {
    setResponseValueAndErrors(
      res,
      "maxItems",
      def.maxLength.value,
      def.maxLength.message,
      refs
    );
  }

  return res;
}
