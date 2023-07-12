import * as React from "react";
import {
  createForm,
  StatefulFormView,
  bulma,
  basic,
  FormComponentView,
  textField,
  selectWidget,
  setDefaultTheme,
  useForm,
  serialize,
  groupWidgetType,
} from "@fab4m/fab4m";
import { formBuilder } from "../../src";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { textFieldPlugin, textFieldWidgetPlugin } from "../../src/types/text";
import {
  floatFieldPlugin,
  integerFieldPlugin,
  numberFieldWidgetPlugin,
} from "../../src/types/number";
import {
  emailFieldPlugin,
  emailFieldWidgetPlugin,
} from "../../src/types/email";
import { urlFieldPlugin, linkFieldWidgetPlugin } from "../../src/types/url";

import {
  pageBreakPlugin,
  pageBreakWidgetPlugin,
} from "../../src/types/pagebreak";

import {
  groupPlugin,
  groupWidgetPlugin,
  detailsWidgetPlugin,
  fieldsetWidgetPlugin,
  horizontalGroupWidgetPlugin,
} from "../../src/types/group";

import {
  dateFieldPlugin,
  datePickerWidgetPlugin,
  dateRangeFieldPlugin,
  dateRangePickerWidgetPlugin,
  dateTimeFieldPlugin,
  dateTimePickerWidgetPlugin,
  setLocales,
} from "../../src/types/date";
import { fileFieldPlugin, fileUploadWidgetPlugin } from "../../src/types/file";

import { minValidatorPlugin } from "../../src/validators/numbers";
import { existsValidatorPlugin } from "../../src/validators/exists";
import "@fab4m/fab4m/css/basic/basic.css";
import { localFormStorage } from "../../src/localstorage";
import sv from "date-fns/locale/sv";

setLocales([sv]);

const form = createForm({
  text: textField({ label: "Text" }),
});

const FormBuilder = formBuilder(
  {
    types: [
      textFieldPlugin,
      integerFieldPlugin,
      floatFieldPlugin,
      emailFieldPlugin,
      fileFieldPlugin,
      dateFieldPlugin,
      dateTimeFieldPlugin,
      dateRangeFieldPlugin,
      pageBreakPlugin,
      urlFieldPlugin,
      groupPlugin,
    ],
    widgets: [
      textFieldWidgetPlugin,
      numberFieldWidgetPlugin,
      emailFieldWidgetPlugin,
      fileUploadWidgetPlugin,
      datePickerWidgetPlugin,
      dateTimePickerWidgetPlugin,
      dateRangePickerWidgetPlugin,
      pageBreakWidgetPlugin,
      linkFieldWidgetPlugin,
      groupWidgetPlugin,
      detailsWidgetPlugin,
      fieldsetWidgetPlugin,
      horizontalGroupWidgetPlugin,
    ],
    validators: [minValidatorPlugin, existsValidatorPlugin],
  },
  localFormStorage("form", serialize(form))
);

export default function App() {
  return <div className="dark:bg-slate-900">{FormBuilder}</div>;
}
