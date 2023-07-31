import { emailField, emailFieldType, emailWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const emailFieldPlugin: FormComponentTypePlugin = {
  type: emailFieldType,
  init: (name) => emailField({ name }),
};

export const emailFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: emailWidgetType,
};
