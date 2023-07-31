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
  DateFieldWidgetSettings,
  SerializedDateFieldSettings,
  setLocales as setDateLocales,
  DateRangeWidgetSettings,
  SerializedDateRangeSettings,
} from "@fab4m/date";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";
import {
  booleanField,
  equals,
  selectWidget,
  tagsWidget,
  textField,
  unavailable,
} from "@fab4m/fab4m";
import t from "../translations";
import { invariantReturn } from "../util";

export const dateFieldPlugin: FormComponentTypePlugin = {
  type: dateFieldType,
  init: (name) => dateField({ name }),
};

export const dateTimeFieldPlugin: FormComponentTypePlugin = {
  type: dateTimeFieldType,
  init: (name) => dateTimeField({ name }),
};

export const dateRangeFieldPlugin: FormComponentTypePlugin = {
  type: dateRangeFieldType,
  init: (name) => dateRangeField({ name }),
};

let availableLocales: Locale[] = [];

export function setLocales(locales: Locale[]) {
  availableLocales = locales;
  setDateLocales(availableLocales);
}

function datePickerForm() {
  return availableLocales.length > 0
    ? {
        useBrowserLocale: booleanField({
          label: t("useBrowserLocale"),
        }),
        locale: textField({
          label: t("locale"),
          widget: selectWidget(availableLocales.map((l) => l.code ?? "")),
          rules: [["widgetSettings.useBrowserLocale", unavailable()]],
        }),
        locales: textField({
          label: t("availableLocales"),
          widget: selectWidget(availableLocales.map((l) => l.code ?? "")),
          multiple: true,
          rules: [["widgetSettings.useBrowserLocale", equals(true)]],
          multipleWidget: tagsWidget(),
        }),
      }
    : {
        format: textField({
          label: t("format"),
        }),
      };
}

function datePickerSettingsFromForm(data: SerializedDateFieldSettings) {
  return {
    ...data,
    locale: data.locale
      ? availableLocales.find((l) => l.code === data.locale)
      : undefined,
    locales: data.locales?.map((locale) =>
      invariantReturn(availableLocales.find((l) => l.code === locale))
    ),
  };
}

const datePickerSettings: Partial<
  WidgetTypePlugin<DateFieldWidgetSettings, SerializedDateFieldSettings>
> = {
  editForm: datePickerForm,
  settingsFromForm: datePickerSettingsFromForm,
};

export const datePickerWidgetPlugin: WidgetTypePlugin<
  DateFieldWidgetSettings,
  SerializedDateFieldSettings
> = {
  type: datePickerWidgetType,
  ...datePickerSettings,
};

export const dateTimePickerWidgetPlugin: WidgetTypePlugin<
  DateFieldWidgetSettings,
  SerializedDateFieldSettings
> = {
  type: dateTimePickerWidgetType,
  ...datePickerSettings,
};

function dateRangePickerForm() {
  return {
    fromLabel: textField({
      label: t("fromLabel"),
      required: true,
    }),
    toLabel: textField({
      label: t("toLabel"),
      required: true,
    }),
    withTime: booleanField({
      label: t("withTime"),
    }),
    optionalEndDate: booleanField({
      label: t("optionalEndDate"),
    }),
    ...datePickerForm(),
  };
}

export const dateRangePickerWidgetPlugin: WidgetTypePlugin<
  DateRangeWidgetSettings,
  SerializedDateRangeSettings
> = {
  type: dateRangePickerWidgetType,
  editForm: dateRangePickerForm,
  settingsFromForm: (data) => {
    return {
      ...data,
      ...datePickerSettingsFromForm(data),
    };
  },
};
