import { FormComponent, FormComponentWithName } from "./component";
import { FormDefinition } from "./form";
import { AnyRule } from "./rule";
interface ErrorObject {
  schemaPath: string;
  message?: string;
  dataPath: string;
}
/**
 * Definition of a JSON schema property.
 * @group JSON Schema
 */
export type SchemaProperty =
  | {
      type: "string" | "integer" | "number";
      description?: string;
      title?: string;
      minLength?: number;
      maxLength?: number;
      minimum?: number;
      maximum?: number;
      const?: string | number | boolean | { $data: string };
      enum?: Array<string | number>;
      format?: string;
      not?: {
        minLength?: number;
        maxLength?: number;
        const?: string | number | boolean;
        enum?: Array<string | number>;
      };
      properties?: Record<string, SchemaProperty>;
      pattern?: string;
    }
  | {
      type: "boolean";

      properties?: Record<string, SchemaProperty>;
      title?: string;
      description?: string;
    }
  | {
      type: "object";
      description?: string;
      properties: Record<string, SchemaProperty>;
      title?: string;
      required?: string[];
    }
  | {
      type: "array";
      description?: string;
      title?: string;
      items: SchemaProperty | SchemaProperty[];
      minItems?: number;
      maxItems?: number;
    };

interface PartialProperties {
  properties: Record<string, Partial<SchemaProperty>>;
}

interface PartialSchema extends PartialProperties {
  required: string[];
}

export type CompoundType = "anyOf" | "allOf" | "not";

/**
 * Definition of a JSON Schema.
 * @group JSON Schema
 */
export interface Schema {
  title: string;
  description: string;
  type: string;
  properties: Record<string, SchemaProperty>;
  required: string[];
  dependencies?: Record<string, Partial<Schema>>;
  allOf?: Array<Partial<Schema>>;
  anyOf?: Array<Partial<Schema>>;
  not?: Partial<Schema>;
  if?: PartialProperties;
  then?: Partial<Schema>;
  else?: PartialSchema;
}

/**
 * Generate a default schema for a component based on it's definition.
 */
function defaultSchema(component: FormComponent): SchemaProperty | undefined {
  const properties: Record<string, SchemaProperty> = {};
  const required: string[] = [];

  switch (component.type.dataType) {
    case "string":
      return {
        type: "string",
        description: component.description,
        title: component.label,
        minLength:
          component.type.dataType === "string" && component.required
            ? 1
            : undefined,
      };
    case "integer":
      return {
        type: "integer",
        title: component.label,
        description: component.description,
      };
    case "float":
      return {
        type: "number",
        title: component.label,
        description: component.description,
      };
    case "object":
      if (component.components) {
        for (const child of component.components) {
          if (Array.isArray(child)) {
            continue;
          }
          const childSchema = generateComponentSchema(child);
          if (childSchema && child.name) {
            properties[child.name] = childSchema;
            if (child.required) {
              required.push(child.name);
            }
          }
        }
      }
      return {
        type: "object",
        title: component.label,
        description: component.description,
        properties,
        required,
      };
    case "boolean":
      return {
        type: "boolean",
        title: component.label,
        description: component.description,
      };
  }
  return undefined;
}

/**
 * Generate the schema for a specific component.
 * @group JSON Schema
 */
export function generateComponentSchema(
  component: FormComponent
): SchemaProperty | null {
  let componentSchema = component.type.schema
    ? component.type.schema(component, defaultSchema(component))
    : defaultSchema(component);
  if (!componentSchema) {
    return null;
  }
  for (const validator of component.validators) {
    if (componentSchema && componentSchema.type === "object") {
      componentSchema.properties = {
        ...componentSchema.properties,
        ...validator.type.schema(validator.settings, componentSchema),
      };
    } else {
      componentSchema = {
        ...componentSchema,
        ...validator.type.schema(validator.settings, componentSchema),
      };
    }
  }
  if (component.multiple && componentSchema) {
    return {
      type: "array",
      description: component.description,
      title: component.label,
      items: componentSchema,
      minItems: component.required ? component.minItems : 0,
      maxItems: component.maxItems,
    };
  }
  return componentSchema ?? null;
}

function schemaBase(form: FormDefinition): Schema {
  return {
    title: form.title ?? "Form data",
    description: form.description ?? "A form submission",
    type: "object",
    properties: {},
    required: [],
  };
}

/**
 * Generate a JSON schema for the provided form.
 * @param form The form to generate the schema for.
 * @return A JSON schema for the form.
 * @group JSON Schema
 */
export function generateSchema(form: FormDefinition): Schema {
  const schema: Schema = schemaBase(form);
  const componentSchemas: Record<string, SchemaProperty> = {};
  const hasRules: FormComponentWithName[] = [];
  const rules: Map<string, Array<Partial<Schema>>> = new Map();
  const groupRules = [];
  for (const component of form.components) {
    if (Array.isArray(component)) {
      continue;
    }
    const componentSchema = generateComponentSchema(component);
    if (!componentSchema || !component.name) {
      continue;
    }
    componentSchemas[component.name] = componentSchema;
    schema.properties[component.name] = componentSchema;
    const required =
      component.required ||
      component.validators.findIndex(
        (validator) => validator.type.forceRequired
      ) !== -1;
    if (required) {
      // If this component has rules, then we need to add required only
      // when it exists.
      if (component.rules.length === 0) {
        schema.required.push(component.name);
      } else {
        hasRules.push(component);
      }
    }
  }
  for (const component of hasRules) {
    for (const rule of component.rules) {
      const ruleSchema = generateComponentRuleSchema(
        rule,
        component,
        componentSchemas
      );
      if (!ruleSchema) {
        continue;
      }
      if (Array.isArray(rule)) {
        const dependencyRules = rules.get(rule[0]) ?? [];
        dependencyRules.push(ruleSchema);
        rules.set(rule[0], dependencyRules);
      } else {
        groupRules.push(ruleSchema);
      }
    }
  }
  schema.dependencies = {};
  for (const [dependency, dependencyRules] of rules.entries()) {
    schema.dependencies[dependency] = { allOf: dependencyRules };
  }
  if (groupRules.length > 0) {
    schema.allOf = [];
    for (const group of groupRules) {
      schema.allOf.push(group);
    }
  }
  return schema;
}

function generateComponentRuleSchema(
  rule: AnyRule,
  component: FormComponentWithName,
  componentSchemas: Record<string, SchemaProperty>
): Partial<Schema> | null {
  if (Array.isArray(rule)) {
    if (!componentSchemas[rule[0]] || !componentSchemas[component.name]) {
      return null;
    }
    return {
      if: {
        properties: {
          [rule[0]]: rule[1].type.schema(
            rule[1].settings,
            componentSchemas[rule[0]]
          ),
        },
      },
      then: {
        required: component.required ? [component.name] : [],
      },
    };
  }
  const groupRules: Array<Partial<Schema>> = [];
  for (const childRule of rule.rules) {
    const schema = generateComponentRuleSchema(
      childRule,
      component,
      componentSchemas
    );
    if (!schema) {
      continue;
    }
    if (Array.isArray(childRule)) {
      groupRules.push({ dependencies: { [childRule[0]]: schema } });
    } else {
      groupRules.push(schema);
    }
  }
  if (rule.type.schema) {
    return rule.type.schema(groupRules);
  } else {
    return { [rule.type.schemaCompoundKeyword]: groupRules };
  }
}

/**
 * Generate a JSON schema for each form part.
 * @param form The form to generate the part schemas for.
 * @return A list JSON schemas for each part of the form.
 * @group JSON Schema
 */
export function generatePartSchemas(form: FormDefinition): Schema[] {
  let part = 0;
  const partSchemas = [{ ...schemaBase(form) }];
  for (const component of form.components) {
    if (Array.isArray(component)) {
      continue;
    }
    const componentSchema = generateComponentSchema(component);
    if (componentSchema && component.name) {
      partSchemas[part].properties[component.name] = componentSchema;
      if (component.required) {
        partSchemas[part].required.push(component.name);
      }
    }
    if (component.type.splitsForm) {
      partSchemas.push({ ...schemaBase(form) });
      part++;
    }
  }
  return partSchemas;
}

/**
 * Get custom error messages for form components.
 * @param form The form to get messages for.
 * @return an object with the json path as the key and the message as the value.
 * @group JSON Schema
 */
export function schemaMessages(form: FormDefinition): Record<string, string> {
  const messages: Record<string, string> = {};
  for (const component of form.components) {
    if (Array.isArray(component)) {
      continue;
    }
    if (component.type.schemaErrorMessages) {
      const componentMessages = component.type.schemaErrorMessages(component);
      for (const key in componentMessages) {
        messages[`#/properties/${component.name}/${key}`] =
          componentMessages[key]();
      }
    }
    for (const validator of component.validators) {
      if (validator.type.schemaErrorMessages) {
        const validatorMessages = validator.type.schemaErrorMessages(
          validator.settings,
          component
        );
        for (const key in validatorMessages) {
          messages[`#/properties/${component.name}/${key}`] =
            validatorMessages[key]();
        }
      }
    }
  }
  return messages;
}

/**
 * Get all error messages based on a list of errors as an object where the key is the JSON path
 * and the value is the error message.
 * @param form  The form to get the messages for.
 * @param errors The list of errors.
 * @return An object with the json path as the key and the message as the value.
 * @group JSON Schema
 */
export function errorMessages(
  form: FormDefinition,
  errors: ErrorObject[]
): Record<string, string> {
  const messages = schemaMessages(form);
  const errorsToReturn: Record<string, string> = {};
  for (const error of errors) {
    if (messages[error.schemaPath]) {
      errorsToReturn[error.dataPath] = messages[error.schemaPath];
    } else if (error.message) {
      errorsToReturn[error.dataPath] = error.message;
    }
  }
  return errorsToReturn;
}
