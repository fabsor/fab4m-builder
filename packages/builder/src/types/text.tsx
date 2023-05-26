import React from "react";
import { textField, textFieldType, textFieldWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const textFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: textFieldType,
  init: (name) => textField({ name }),
};

export const textFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: textFieldWidgetType,
};
