import {
  createForm,
  fromFormData,
  group,
  selectWidget,
  serializeComponent,
  SerializedComponent,
  textAreaField,
  textField,
} from "@fab4m/fab4m";
import { findComponentWidgets, findPlugin } from "../util";
import { FormComponentTypePlugin, Plugins, WidgetTypePlugin } from "..";
import invariant from "tiny-invariant";

export interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  settings?: Record<string, unknown>;
  widget: string;
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
  const form = componentForm(type, plugins, widget);
  const data = fromFormData(form, formData);
  const serializedComponent = serializeComponent({
    ...data,
    type: type.type,
    widget: widget.type.init(),
    validators: [],
    rules: [],
    settings: undefined,
  });
  serializedComponent.settings = data.settings;
  serializedComponent.widget.settings = data.widgetSettings;
  return serializedComponent;
}

export function componentForm(
  type: FormComponentTypePlugin,
  plugins: Plugins,
  widget?: WidgetTypePlugin
) {
  let settingsForm = undefined;
  let widgetSettingsForm = undefined;
  if (type.editForm) {
    settingsForm = group(
      {
        label: "Component settings",
      },
      type.editForm
    );
  }
  if (widget?.editForm) {
    widgetSettingsForm = group(
      {
        label: "Widget settings",
      },
      widget.editForm
    );
  }
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
    settings: settingsForm,
    widgetSettings: widgetSettingsForm,
  });
}
