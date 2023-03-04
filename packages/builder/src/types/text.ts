import { textField, textFieldType, textFieldWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const textFieldPlugin: FormComponentTypePlugin = {
  type: textFieldType,
};

export const textFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: textFieldWidgetType,
  editForm: {
    prefix: textField({
      label: "Prefix",
    }),
  },
};
