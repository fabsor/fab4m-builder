import React from "react";
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
  icon: <>&#35;</>,
  init: (name) => integerField({ name }),
};

export const floatFieldPlugin: FormComponentTypePlugin = {
  icon: <>#.#</>,
  type: floatFieldType,
  init: (name) => floatField({ name }),
};

export const numberFieldWidgetPlugin: WidgetTypePlugin = {
  type: numberFieldWidgetType,
};
