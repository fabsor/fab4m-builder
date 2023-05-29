import React from "react";
import {
  dateField,
  dateTimeFieldType,
  dateTimeField,
  dateFieldType,
  datePickerWidgetType,
  dateTimePickerWidgetType,
  dateRangeFieldType,
  dateRangeField,
  dateRangePickerWidgetType,
} from "@fab4m/date";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";

export const dateFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: dateFieldType,
  init: (name) => dateField({ name }),
};

export const dateTimeFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: dateTimeFieldType,
  init: (name) => dateTimeField({ name }),
};

export const dateRangeFieldPlugin: FormComponentTypePlugin = {
  icon: <>&#128441;</>,
  type: dateRangeFieldType,
  init: (name) => dateRangeField({ name }),
};

export const datePickerWidgetPlugin: WidgetTypePlugin = {
  type: datePickerWidgetType,
};

export const dateTimePickerWidgetPlugin: WidgetTypePlugin = {
  type: dateTimePickerWidgetType,
};

export const dateRangePickerWidgetPlugin: WidgetTypePlugin = {
  type: dateRangePickerWidgetType,
};
