import * as React from "react";
import { group, groupType, groupWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const groupPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: groupType,
  init: (name) => group({ name }, []),
};

export const groupWidgetPlugin: WidgetTypePlugin = {
  type: groupWidgetType,
};
