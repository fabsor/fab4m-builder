import React from "react";
import {
  FormComponentType,
  Components,
  WidgetType,
  SerializedForm,
  SerializedComponent,
  ValidatorType,
  FormComponent,
  Theme,
  SchemaProperty,
} from "@fab4m/fab4m";
import {
  ActionFunctionArgs,
  createBrowserRouter,
  LoaderFunctionArgs,
} from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { routes } from "./router";
export * from "./types";
export * from "./widgets";
export * from "./validators";

export { localFormStorage } from "./localstorage";
export { defaultIcons } from "./defaultIcons";
export * from "./util";

export interface Plugin<SettingsType, SettingsFormData> {
  editForm?: () => Components<SettingsFormData>;
  settingsFromForm?: (data: SettingsFormData) => SettingsType;
  formData?: (settings: SettingsType) => SettingsFormData;
  settingsSchema?: () => SchemaProperty;
}

export interface FormComponentTypePlugin<
  SettingsType = unknown,
  SettingsFormData = Record<string, unknown>,
> extends Plugin<SettingsType, SettingsFormData> {
  type: FormComponentType<SettingsType>;
  init: (name: string) => FormComponent;
}

export interface WidgetTypePlugin<
  SettingsType = unknown,
  SettingsFormData = Record<string, unknown>,
> extends Plugin<SettingsType, SettingsFormData> {
  type: WidgetType;
}

export type ValidatorTypePlugin<
  SettingsType = unknown,
  SettingsFormData = unknown,
> = Plugin<SettingsType, SettingsFormData> & {
  component?: () => FormComponent<SettingsFormData>;
  type: ValidatorType;
};

export interface FlashMessage {
  title: string;
  description: string;
  type: "success" | "error";
}

export interface FormStorage {
  loadForm: (context: LoaderFunctionArgs) => Promise<SerializedForm>;
  addComponent: (
    newComponent: SerializedComponent,
    context: ActionFunctionArgs,
  ) => Promise<void>;
  editComponent: (
    key: string,
    component: SerializedComponent,
    context: ActionFunctionArgs,
  ) => Promise<void>;
  saveForm: (
    form: SerializedForm,
    context: ActionFunctionArgs,
  ) => Promise<SerializedForm>;
  getFlashMessage: (reset: boolean) => Promise<FlashMessage | null>;
  flash: (message: FlashMessage) => Promise<void>;
}

export interface Plugins {
  types: FormComponentTypePlugin[];
  widgets: WidgetTypePlugin[];
  validators: ValidatorTypePlugin[];
}

export interface FormBuilderArgs {
  plugins: Plugins;
  themes: Theme[];
  storage: FormStorage;
}

export function formBuilder(args: FormBuilderArgs) {
  const router = createBrowserRouter(routes(args));
  return <FormBuilder router={router} />;
}

function pluginSchema<SettingsType, SettingsFormData>(
  name: string,
  plugin: Plugin<SettingsType, SettingsFormData>,
): SchemaProperty {
  const schema: SchemaProperty = {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: [name],
      },
    },
    required: ["type"],
  };
  if (plugin.settingsSchema) {
    schema.properties.settings = plugin.settingsSchema();
    if (schema.required) {
      schema.required.push("settings");
    }
  }
  return schema;
}

export function formSchema(plugins: Plugins) {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      theme: {
        type: "string",
      },
      labels: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      components: {
        $ref: "#/definitions/SerializedComponentsList",
      },
    },
    required: ["theme", "components"],
    definitions: {
      SerializedComponent: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          type: {
            type: "string",
            enum: plugins.types.map((t) => t.type.name),
          },
          label: {
            type: "string",
          },
          description: {
            type: "string",
          },
          attributes: {
            type: "object",
            additionalProperties: true,
          },
          minItems: {
            type: "number",
          },
          maxItems: {
            type: "number",
          },
          required: {
            type: "boolean",
          },
          disabled: {
            type: "boolean",
          },
          splitsForm: {
            type: "boolean",
          },
          widget: {
            $ref: "#/definitions/SerializedWidget",
          },
          multipleWidget: {
            $ref: "#/definitions/SerializedWidget",
          },
          settings: {
            type: "object",
            additionalProperties: true,
          },
          components: {
            $ref: "#/definitions/SerializedComponentsList",
          },
          validators: {
            type: "array",
            items: {
              $ref: "#/definitions/SerializedValidator",
            },
          },
          rules: {
            type: "array",
            items: {
              oneOf: [
                { $ref: "#/definitions/SerializedRuleGroup" },
                { $ref: "#/definitions/SerializedRule" },
              ],
            },
          },
          dataType: {
            type: "string",
          },
        },
        required: ["type", "splitsForm", "widget", "validators", "rules"],
      },
      SerializedWidget: {
        oneOf: plugins.widgets.map((w) => pluginSchema(w.type.name, w)),
      },
      SerializedComponentsList: {
        type: "array",
        items: {
          oneOf: [
            { $ref: "#/definitions/SerializedVariant" },
            { $ref: "#/definitions/SerializedComponent" },
          ],
        },
      },
      SerializedVariant: {
        type: "array",
        items: {
          type: "object",
          properties: {
            component: { $ref: "#/definitions/SerializedComponent" },
            rule: { $ref: "#/definitions/SerializedRule" },
          },
          required: ["component"],
          additionalProperties: false,
        },
      },
      SerializedValidator: {
        oneOf: plugins.validators.map((v) => pluginSchema(v.type.name, v)),
      },
      SerializedRuleGroup: {
        type: "object",
        properties: {
          type: {
            type: "string",
          },
          rules: {
            type: "array",
            items: {
              oneOf: [
                { $ref: "#/definitions/SerializedRuleGroup" },
                { $ref: "#/definitions/SerializedRule" },
              ],
            },
          },
        },
      },
      SerializedRule: {
        type: "array",
        items: [
          {
            type: "string",
          },
          {
            $ref: "#/definitions/SerializedValidator",
          },
        ],
        minItems: 2,
        maxItems: 2,
      },
    },
  };
}

export { routes };
export * from "./forms/component";
export * from "./components/FormBuilder";
export * from "./translations";
