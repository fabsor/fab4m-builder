import {
  content,
  contentType,
  contentWidgetType,
  textAreaField,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const contentPlugin: FormComponentTypePlugin = {
  type: contentType,
  init: (name) => content({ name }, () => ""),
};

export const contentWidgetPlugin: WidgetTypePlugin<{ prefix?: string }> = {
  type: contentWidgetType,
  editForm: () => ({
    content: textAreaField({ required: true }),
  }),
};
