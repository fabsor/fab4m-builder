import { pageBreakType, pageBreak, pageBreakWidgetType } from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "..";

export const pageBreakPlugin: FormComponentTypePlugin = {
  type: pageBreakType,
  init: (name) => pageBreak({ name }),
};

export const pageBreakWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: pageBreakWidgetType,
};
