import React from "react";
import { emailField, emailFieldType, emailWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const emailFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: emailFieldType,
  init: (name) => emailField({ name }),
};

export const emailFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: emailWidgetType,
};
