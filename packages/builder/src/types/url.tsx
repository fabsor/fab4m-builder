import React from "react";
import { urlField, urlFieldType, linkFieldWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const urlFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: urlFieldType,
  init: (name) => urlField({ name }),
};

export const linkFieldWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: linkFieldWidgetType,
};
