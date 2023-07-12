import * as React from "react";
import {
  group,
  groupType,
  groupWidgetType,
  detailsWidgetType,
  DetailsSettings,
  textField,
  booleanField,
  fieldsetWidgetType,
  horizontalGroupWidgetType,
} from "@fab4m/fab4m";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";
import t from "../translations";

export const groupPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: groupType,
  init: (name) => group({ name }, []),
};

export const groupWidgetPlugin: WidgetTypePlugin = {
  type: groupWidgetType,
};

export const fieldsetWidgetPlugin: WidgetTypePlugin = {
  type: fieldsetWidgetType,
};

export const detailsWidgetPlugin: WidgetTypePlugin<
  DetailsSettings<Record<string, unknown>>,
  { open?: boolean }
> = {
  type: detailsWidgetType,
  editForm: () => ({
    open: booleanField({ label: t("open") }),
  }),
};

export const horizontalGroupWidgetPlugin: WidgetTypePlugin = {
  type: horizontalGroupWidgetType,
};
