import {
  floatField,
  floatFieldType,
  integerField,
  integerFieldType,
  numberFieldWidgetType,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const integerFieldPlugin: FormComponentTypePlugin = {
  type: integerFieldType,
  init: (name) => integerField({ name }),
};

export const floatFieldPlugin: FormComponentTypePlugin = {
  type: floatFieldType,
  init: (name) => floatField({ name }),
};

export const numberFieldWidgetPlugin: WidgetTypePlugin = {
  type: numberFieldWidgetType,
};
