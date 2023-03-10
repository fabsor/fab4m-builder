import {
  floatFieldType,
  integerFieldType,
  numberFieldWidgetType,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const integerFieldPlugin: FormComponentTypePlugin = {
  type: integerFieldType,
};

export const floatFieldPlugin: FormComponentTypePlugin = {
  type: floatFieldType,
};

export const numberFieldWidgetPlugin: WidgetTypePlugin = {
  type: numberFieldWidgetType,
};
