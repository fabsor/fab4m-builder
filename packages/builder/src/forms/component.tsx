import {
  createForm,
  FormComponent,
  group,
  selectWidget,
  SerializedComponent,
  textAreaField,
  textField,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  settings?: Record<string, unknown>;
  widget: string;
  widgetSettings?: Record<string, unknown>;
}

export function componentForm(
  type: FormComponentTypePlugin,
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
      label: "Label",
    }),
    name: textField({
      label: "Name",
    }),
    description: textAreaField({
      label: "Description",
    }),
    widget: textField({
      label: "Widget",
      widget: selectWidget(["textfield"]),
    }),
    settings: settingsForm,
    widgetSettings: widgetSettingsForm,
  });
}
