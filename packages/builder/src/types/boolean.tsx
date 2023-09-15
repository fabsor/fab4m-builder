import {
  booleanField,
  booleanFieldType,
  checkboxWidgetType,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const booleanFieldPlugin: FormComponentTypePlugin = {
  type: booleanFieldType,
  init: (name) => booleanField({ name }),
};

export const checkboxWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: checkboxWidgetType,
};
