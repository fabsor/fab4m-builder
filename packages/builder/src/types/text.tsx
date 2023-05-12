import React from "react";
import { textFieldType, textFieldWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const textFieldPlugin: FormComponentTypePlugin = {
  icon: <>&hellip;</>,
  type: textFieldType,
};

export const textFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: textFieldWidgetType,
};
