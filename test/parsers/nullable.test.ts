import { z } from "zod";
import { parseObjectDef } from "../../src/parsers/object";
import { getRefs } from "../../src/Refs";

describe("nullable", () => {
  it("should be possible to properly reference nested nullable primitives", () => {
    const nullablePrimitive = z.string().nullable();

    const schema = z.object({
      one: nullablePrimitive,
      two: nullablePrimitive,
    });

    const jsonSchema: any = parseObjectDef(schema._def, getRefs());

    expect(jsonSchema.properties.one.type).toStrictEqual(["string", "null"]);
    expect(jsonSchema.properties.two.$ref).toStrictEqual("#/properties/one");
  });

  it("should be possible to properly reference nested nullable primitives", () => {
    const three = z.string();

    const nullableObject = z
      .object({
        three,
      })
      .nullable();

    const schema = z.object({
      one: nullableObject,
      two: nullableObject,
      three,
    });

    const jsonSchema: any = parseObjectDef(schema._def, getRefs());

    expect(jsonSchema.properties.one).toStrictEqual({
      anyOf: [
        {
          type: "object",
          additionalProperties: false,
          required: ["three"],
          properties: {
            three: {
              type: "string",
            },
          },
        },
        {
          type: "null",
        },
      ],
    });
    expect(jsonSchema.properties.two.$ref).toStrictEqual("#/properties/one");
    expect(jsonSchema.properties.three.$ref).toStrictEqual(
      "#/properties/one/anyOf/0/properties/three"
    );
  });
});
