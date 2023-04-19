import { ZodFirstPartyTypeKind, ZodTypeDef } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { JsonSchema7AnyType, parseAnyDef } from "./parsers/any.ts";
import { JsonSchema7ArrayType, parseArrayDef } from "./parsers/array.ts";
import { JsonSchema7BigintType, parseBigintDef } from "./parsers/bigint.ts";
import { JsonSchema7BooleanType, parseBooleanDef } from "./parsers/boolean.ts";
import { parseBrandedDef } from "./parsers/branded.ts";
import { parseCatchDef } from "./parsers/catch.ts";
import { JsonSchema7DateType, parseDateDef } from "./parsers/date.ts";
import { parseDefaultDef } from "./parsers/default.ts";
import { parseEffectsDef } from "./parsers/effects.ts";
import { JsonSchema7EnumType, parseEnumDef } from "./parsers/enum.ts";
import {
  JsonSchema7AllOfType,
  parseIntersectionDef,
} from "./parsers/intersection.ts";
import { JsonSchema7LiteralType, parseLiteralDef } from "./parsers/literal.ts";
import { JsonSchema7MapType, parseMapDef } from "./parsers/map.ts";
import {
  JsonSchema7NativeEnumType,
  parseNativeEnumDef,
} from "./parsers/nativeEnum.ts";
import { JsonSchema7NeverType, parseNeverDef } from "./parsers/never.ts";
import { JsonSchema7NullType, parseNullDef } from "./parsers/null.ts";
import { JsonSchema7NullableType, parseNullableDef } from "./parsers/nullable.ts";
import { JsonSchema7NumberType, parseNumberDef } from "./parsers/number.ts";
import { JsonSchema7ObjectType, parseObjectDef } from "./parsers/object.ts";
import { parseOptionalDef } from "./parsers/optional.ts";
import { parsePipelineDef } from "./parsers/pipeline.ts";
import { parsePromiseDef } from "./parsers/promise.ts";
import { JsonSchema7RecordType, parseRecordDef } from "./parsers/record.ts";
import { JsonSchema7SetType, parseSetDef } from "./parsers/set.ts";
import { JsonSchema7StringType, parseStringDef } from "./parsers/string.ts";
import { JsonSchema7TupleType, parseTupleDef } from "./parsers/tuple.ts";
import {
  JsonSchema7UndefinedType,
  parseUndefinedDef,
} from "./parsers/undefined.ts";
import { JsonSchema7UnionType, parseUnionDef } from "./parsers/union.ts";
import { JsonSchema7UnknownType, parseUnknownDef } from "./parsers/unknown.ts";
import { Refs, Seen } from "./Refs.ts";

type JsonSchema7RefType = { $ref: string };
type JsonSchema7Meta = { default?: any; description?: string };

export type JsonSchema7TypeUnion =
  | JsonSchema7StringType
  | JsonSchema7ArrayType
  | JsonSchema7NumberType
  | JsonSchema7BigintType
  | JsonSchema7BooleanType
  | JsonSchema7DateType
  | JsonSchema7EnumType
  | JsonSchema7LiteralType
  | JsonSchema7NativeEnumType
  | JsonSchema7NullType
  | JsonSchema7NumberType
  | JsonSchema7ObjectType
  | JsonSchema7RecordType
  | JsonSchema7TupleType
  | JsonSchema7UnionType
  | JsonSchema7UndefinedType
  | JsonSchema7RefType
  | JsonSchema7NeverType
  | JsonSchema7MapType
  | JsonSchema7AnyType
  | JsonSchema7NullableType
  | JsonSchema7AllOfType
  | JsonSchema7UnknownType
  | JsonSchema7SetType;

export type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Meta;

export function parseDef(
  def: ZodTypeDef,
  refs: Refs
): JsonSchema7Type | undefined {
  const seenItem = refs.seen.find((x) => Object.is(x.def, def));

  if (seenItem) {
    return get$ref(seenItem, refs);
  }

  const newItem: Seen = { def, path: refs.currentPath, jsonSchema: undefined };

  refs.seen.push(newItem);

  const jsonSchema = selectParser(def, (def as any).typeName, refs);

  if (jsonSchema) {
    addMeta(def, jsonSchema);
  }

  newItem.jsonSchema = jsonSchema;

  return jsonSchema;
}

const get$ref = (
  item: Seen,
  refs: Refs
):
  | {
      $ref: string;
    }
  | {}
  | undefined => {
  switch (refs.$refStrategy) {
    case "root":
      return {
        $ref:
          item.path.length === 0
            ? ""
            : item.path.length === 1
            ? `${item.path[0]}/`
            : item.path.join("/"),
      };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none": {
      if (
        item.path.length < refs.currentPath.length &&
        item.path.every((value, index) => refs.currentPath[index] === value)
      ) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return {};
      } else {
        return item.jsonSchema;
      }
    }
  }
};

const getRelativePath = (pathA: string[], pathB: string[]) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};

const selectParser = (
  def: any,
  typeName: ZodFirstPartyTypeKind,
  refs: Refs
): JsonSchema7Type | undefined => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef();
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef();
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return undefined;
    default:
      return ((_: never) => undefined)(typeName);
  }
};

const addMeta = (
  def: ZodTypeDef,
  jsonSchema: JsonSchema7Type
): JsonSchema7Type => {
  if (def.description) jsonSchema.description = def.description;
  return jsonSchema;
};
