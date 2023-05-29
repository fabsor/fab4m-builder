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
import {
  dateFieldPlugin,
  datePickerWidgetPlugin,
  dateRangeFieldPlugin,
  dateRangePickerWidgetPlugin,
  dateTimeFieldPlugin,
  dateTimePickerWidgetPlugin,
} from "../../src/types/date";
import { fileFieldPlugin, fileUploadWidgetPlugin } from "../../src/types/file";

import { minValidatorPlugin } from "../../src/validators/numbers";
import { existsValidatorPlugin } from "../../src/validators/exists";
import "@fab4m/fab4m/css/basic/basic.css";
import { localFormStorage } from "../../src/localstorage";

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
    ],
    widgets: [
      textFieldWidgetPlugin,
      numberFieldWidgetPlugin,
      emailFieldWidgetPlugin,
      fileUploadWidgetPlugin,
      datePickerWidgetPlugin,
      dateTimePickerWidgetPlugin,
      dateRangePickerWidgetPlugin,
    ],
    validators: [minValidatorPlugin, existsValidatorPlugin],
  },
  localFormStorage("form", serialize(form))
);

export default function App() {
  return <div className="dark:bg-slate-900">{FormBuilder}</div>;
}
