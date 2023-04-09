import {
  createForm,
  equals,
  fromFormData,
  group,
  selectWidget,
  serializeComponent,
  SerializedComponent,
  textAreaField,
  textField,
  VariantDefinition,
} from "@fab4m/fab4m";
import { findComponentWidgets, findPlugin } from "../util";
import { FormComponentTypePlugin, Plugins } from "..";
import invariant from "tiny-invariant";
import t from "../translations";

export interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  settings?: Record<string, unknown>;
  widget: string;
  validators: Array<{ type: string; settings: Record<string, unknown> }>;
  widgetSettings?: Record<string, unknown>;
}

export async function componentFromFormData(
  typeName: string,
  plugins: Plugins,
  request: Request
): Promise<SerializedComponent> {
  const type = findPlugin(typeName, plugins.types);
  const formData = await request.formData();
  const widgetName = formData.get("widget")?.toString();
  const widget = findPlugin(widgetName ?? "", plugins.widgets);
  invariant(widget.type.init);
  const form = componentForm(type, plugins);
  const data = fromFormData(form, formData);
  console.log(data, JSON.parse(formData.get("_definition")));
  const serializedComponent = serializeComponent({
    ...data,
    type: type.type,
    widget: widget.type.init(),
    rules: [],
    validators: [],
    settings: undefined,
  });
  serializedComponent.settings = data.settings;
  serializedComponent.widget.settings = data.widgetSettings;
  serializedComponent.validators = data.validators.map((validator) => {
    const plugin = findPlugin(validator.type, plugins.validators);
    console.log(validator);
    return {
      type: validator.type,
      settings: plugin.settingsFromForm
        ? plugin.settingsFromForm(validator.settings)
        : undefined,
    };
  });
  return serializedComponent;
}

export function componentForm(type: FormComponentTypePlugin, plugins: Plugins) {
  const settingsForm = type.editForm
    ? group(
        {
          label: t("componentSettings"),
        },
        type.editForm
      )
    : undefined;

  const widgetSettingsForm = findComponentWidgets(
    type.type.name,
    plugins.widgets
  )
    .filter((plugin) => plugin.editForm)
    .map((plugin): VariantDefinition => {
      invariant(plugin.editForm);
      return [
        "widget",
        equals(plugin.type.name),
        group(
          {
            label: t("widgetSettings"),
          },
          plugin.editForm
        ),
      ];
    });
  return createForm<ComponentData>({
    label: textField({
      required: true,
      label: "Label",
    }),
    name: textField({
      required: true,
      label: "Name",
    }),
    description: textAreaField({
      label: "Description",
    }),
    settings: settingsForm ?? undefined,
    widget: textField({
      label: "Widget",
      required: true,
      widget: selectWidget(
        findComponentWidgets(type.type.name, plugins.widgets).map((widget) => [
          widget.type.title,
          widget.type.name,
        ])
      ),
    }),
    widgetSettings: widgetSettingsForm,
    validators: group(
      {
        label: t("validators"),
        multiple: true,
      },
      {
        type: textField({
          label: t("validator"),
          required: true,
          widget: selectWidget(
            plugins.validators.map((plugin) => [
              plugin.type.title,
              plugin.type.name,
            ])
          ),
        }),
        settings: plugins.validators
          .filter((plugin) => plugin.editForm)
          .map((plugin) => {
            invariant(plugin.editForm);
            return [
              "validators.$.type",
              equals(plugin.type.name),
              group(
                {
                  label: plugin.type.title,
                },
                plugin.editForm
              ),
            ];
          }),
      }
    ),
  });
}
