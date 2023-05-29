import React from "react";
import {
  fileField,
  fileFieldType,
  fileUploadWidgetType,
  FileUploadSettings,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const fileFieldPlugin: FormComponentTypePlugin<FileUploadSettings> = {
  icon: <>&#128441;</>,
  type: fileFieldType,
  init: (name) => fileField({ name }),
};

export const fileUploadWidgetPlugin: WidgetTypePlugin<undefined> = {
  type: fileUploadWidgetType,
};
