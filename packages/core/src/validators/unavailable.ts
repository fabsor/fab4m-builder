import { SchemaProperty } from "../schema";
import { Validator, ValidatorType, validator } from "../validator";

/**
 * Exists validator type.
 * @group Validators
 */
type UnavailableType = ValidatorType<unknown, null, SchemaProperty>;

/**
 * This validator let's you ensure that a value is not present.
 * @group Validators
 */
export const unavailableValidator: UnavailableType = {
  name: "unavailable",
  title: "Unavailable",
  defaultSettings: null,
  schema: (settings, schema) => {
    if (schema.type === "string") {
      return { maxLength: 0, type: "string" };
    }
    return {};
  },
  valid: (value) => {
    return !value;
  },
};

/**
 * This validator let's you ensure that one value is not present.
 * @group Validators
 */
export function unavailable(): Validator<UnavailableType, null> {
  return validator({
    type: unavailableValidator,
    settings: null,
  });
}
