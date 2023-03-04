import { textFieldType, textFieldWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const textFieldPlugin: FormComponentTypePlugin = {
  type: textFieldType,
};

export const textFieldWidgetPlugin: WidgetTypePlugin = {
  type: textFieldWidgetType,
};
