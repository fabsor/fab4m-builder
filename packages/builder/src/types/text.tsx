import {
  textAreaWidgetType,
  textField,
  textFieldType,
  textFieldWidgetType,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const textFieldPlugin: FormComponentTypePlugin = {
  type: textFieldType,
  init: (name) => textField({ name }),
};

export const textFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: textFieldWidgetType,
};

export const textAreaWidgetPlugin: WidgetTypePlugin = {
  type: textAreaWidgetType,
};
