import { ZodNullableDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";
import { JsonSchema7NullType } from "./null.ts";
import { primitiveMappings } from "./union.ts";

export type JsonSchema7NullableType =
  | {
      anyOf: [JsonSchema7Type, JsonSchema7NullType];
    }
  | {
      type: [string, "null"];
    };

export function parseNullableDef(
  def: ZodNullableDef,
  refs: Refs
): JsonSchema7NullableType | undefined {
  if (
    ["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
      def.innerType._def.typeName
    ) &&
    (!def.innerType._def.checks || !def.innerType._def.checks.length)
  ) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[
          def.innerType._def.typeName as keyof typeof primitiveMappings
        ],
        nullable: true,
      } as any;
    }

    return {
      type: [
        primitiveMappings[
          def.innerType._def.typeName as keyof typeof primitiveMappings
        ],
        "null",
      ],
    };
  }

  const type = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"],
  });

  return type
    ? refs.target === "openApi3"
      ? ({ ...type, nullable: true } as any)
      : {
          anyOf: [
            type,
            {
              type: "null",
            },
          ],
        }
    : undefined;
}
