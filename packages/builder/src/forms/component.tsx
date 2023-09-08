import React from "react";
import {
  booleanField,
  content,
  createForm,
  equals,
  exists,
  fromFormData,
  group,
  hiddenFieldWidget,
  horizontalGroupWidget,
  integerField,
  selectWidget,
  serializeComponent,
  SerializedComponent,
  SerializedForm,
  submit,
  tailwind,
  textAreaField,
  textField,
  textFieldWidget,
  VariantDefinition,
} from "@fab4m/fab4m";
import {
  findComponentValidators,
  findComponentWidgets,
  findPlugin,
} from "../util";
import { FormComponentTypePlugin, Plugins } from "..";
import invariant from "tiny-invariant";
import t from "../translations";
import styles from "../styles";

export interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  multiple: boolean;
  minItems?: number;
  maxItems?: number;
  actions: unknown;
  settings?: Record<string, unknown>;
  widget: string;
  validators: Array<{ type: string; settings: Record<string, unknown> }>;
  rules: Array<{
    component: string;
    rule: string;
    settings: Record<string, unknown>;
  }>;
  widgetSettings?: Record<string, unknown>;
}

export async function componentFromFormData(
  typeName: string,
  plugins: Plugins,
  request: Request,
  editForm: SerializedForm
): Promise<SerializedComponent> {
  const type = findPlugin(typeName, plugins.types);
  const formData = await request.formData();
  const widgetName = formData.get("widget")?.toString();
  const widget = findPlugin(widgetName ?? "", plugins.widgets);
  invariant(widget.type.init);
  const form = componentForm({ type, plugins, formData: editForm });
  const data = fromFormData(form, formData);
  const serializedComponent = serializeComponent({
    ...data,
    type: type.type,
    widget: widget.type.init(),
    rules: [],
    validators: [],
    settings: undefined,
  });
  serializedComponent.settings = data.settings;
  if (data.widgetSettings) {
    serializedComponent.widget.settings = widget.settingsFromForm
      ? widget.settingsFromForm(data.widgetSettings)
      : data.widgetSettings;
  }
  serializedComponent.validators = data.validators.map((validator) => {
    const plugin = findPlugin(validator.type, plugins.validators);
    return {
      type: validator.type,
      settings: plugin.settingsFromForm
        ? plugin.settingsFromForm(validator.settings)
        : undefined,
    };
  });
  serializedComponent.rules = data.rules.map((rule) => {
    const plugin = findPlugin(rule.rule, plugins.validators);
    return [
      rule.component,
      {
        type: plugin.type.name,
        settings: plugin.settingsFromForm
          ? plugin.settingsFromForm(rule.settings)
          : undefined,
      },
    ];
  });
  return serializedComponent;
}

export function componentForm(args: {
  type: FormComponentTypePlugin;
  plugins: Plugins;
  formData: SerializedForm;
  currentComponent?: SerializedComponent;
  withMachineName?: boolean;
}) {
  const components: SerializedComponent[] = args.formData.components.filter(
    (c) => !Array.isArray(c) && c.name !== args.currentComponent?.name
  ) as SerializedComponent[];
  const settingsForm = args.type.editForm
    ? group(
        {
          label: t("componentSettings"),
        },
        args.type.editForm()
      )
    : undefined;
  const widgetSettingsForm = findComponentWidgets(
    args.type.type.name,
    args.plugins.widgets
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
          plugin.editForm()
        ),
      ];
    });
  return createForm<ComponentData>(
    {
      label: textField({
        required: true,
        label: t("label"),
      }),
      name: textField({
        required: true,
        label: t("machineName"),
        widget: args.withMachineName ? textFieldWidget() : hiddenFieldWidget(),
      }),
      required: booleanField({
        label: t("required"),
      }),
      description: textAreaField({
        label: t("description"),
      }),
      multiple: booleanField({
        label: t("multiple"),
      }),
      minItems: integerField({
        label: t("minItems"),
        rules: [["multiple", exists()]],
      }),
      maxItems: integerField({
        label: t("maxItems"),
        rules: [["multiple", exists()]],
      }),
      settings: settingsForm ?? undefined,
      widget: textField({
        label: "Widget",
        required: true,
        widget: selectWidget(
          findComponentWidgets(args.type.type.name, args.plugins.widgets).map(
            (widget) => [widget.type.title, widget.type.name]
          )
        ),
      }),
      widgetSettings: widgetSettingsForm,
      validators: group(
        {
          label: t("validators"),
          multiple: true,
          widget: horizontalGroupWidget(),
        },
        {
          type: textField({
            label: t("validator"),
            required: true,
            widget: selectWidget(
              findComponentValidators(
                args.type.type.name,
                args.plugins.validators
              ).map((plugin) => [plugin.type.title, plugin.type.name])
            ),
          }),
          settings: args.plugins.validators
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
                  plugin.editForm()
                ),
              ];
            }),
        }
      ),
      rules: group(
        {
          label: t("rules"),
          multiple: true,
          widget: horizontalGroupWidget(),
        },
        {
          component: textField({
            label: t("component"),
            widget: selectWidget(
              components.map((component) => [
                component.label ?? component.name ?? "",
                component.name ?? "",
              ])
            ),
          }),
          rule: components.map((component) => [
            "rules.$.component",
            equals(component.name ?? ""),
            textField({
              label: t("rule"),
              widget: selectWidget(
                findComponentValidators(
                  component.type,
                  args.plugins.validators
                ).map((plugin) => [plugin.type.title, plugin.type.name])
              ),
            }),
          ]),
          settings: args.plugins.validators
            .filter((plugin) => plugin.editForm)
            .map((plugin) => {
              invariant(plugin.editForm);
              return [
                "rules.$.rule",
                equals(plugin.type.name),
                group(
                  {
                    label: plugin.type.title,
                  },
                  plugin.editForm()
                ),
              ];
            }),
        }
      ),
      actions: group(
        { widget: horizontalGroupWidget() },
        {
          save: submit({ label: "Save" }, { title: "Save" }),
          cancel: content({}, () => (
            <a
              href=".."
              className="text-red-600 ml-2 mt-2 inline-block hover:text-red-700 hover:underline"
            >
              {t("cancel")}
            </a>
          )),
        }
      ),
    },
    { theme: tailwind }
  );
}
