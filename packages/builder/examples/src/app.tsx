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
  basicDark,
  tailwind,
  generateSchema,
} from "@fab4m/fab4m";
import { componentForm, formBuilder } from "../../src";
import "react-datepicker/dist/react-datepicker.css";
import "@fab4m/autocomplete/src/style.css";
import "./index.css";
import {
  textFieldPlugin,
  textFieldWidgetPlugin,
  textAreaWidgetPlugin,
} from "../../src/types/text";
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
import {
  selectWidgetPlugin,
  radiosWidgetPlugin,
} from "../../src/widgets/options";
import { autocompleteWidgetPlugin } from "../../src/widgets/autocomplete";
import { minValidatorPlugin } from "../../src/validators/numbers";
import { existsValidatorPlugin } from "../../src/validators/exists";
import {
  allowedValuesValidatorPlugin,
  disallowedValuesValidatorPlugin,
} from "../../src/validators/values";
import {
  minLengthValidatorPlugin,
  maxLengthValidatorPlugin,
} from "../../src/validators/length";
import "@fab4m/fab4m/css/basic/basic.css";
import { localFormStorage } from "../../src/localstorage";
import { defaultIcons } from "../../src/defaultIcons";
import { setIcons } from "../../src/icons";
import sv from "date-fns/locale/sv";
setDefaultTheme(tailwind);
setLocales([sv]);
setIcons(defaultIcons);
const form = createForm({
  text: textField({ label: "Text" }),
});

const plugins = {
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
    selectWidgetPlugin,
    radiosWidgetPlugin,
    textAreaWidgetPlugin,
    autocompleteWidgetPlugin,
  ],
  validators: [
    minValidatorPlugin,
    existsValidatorPlugin,
    allowedValuesValidatorPlugin,
    disallowedValuesValidatorPlugin,
    minLengthValidatorPlugin,
    maxLengthValidatorPlugin,
  ],
};

generateSchema(
  componentForm({ type: textFieldPlugin, plugins, components: [] }),
);
const FormBuilder = formBuilder({
  plugins: {
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
      selectWidgetPlugin,
      radiosWidgetPlugin,
      textAreaWidgetPlugin,
      autocompleteWidgetPlugin,
    ],
    validators: [
      minValidatorPlugin,
      existsValidatorPlugin,
      allowedValuesValidatorPlugin,
      disallowedValuesValidatorPlugin,
      minLengthValidatorPlugin,
      maxLengthValidatorPlugin,
    ],
  },
  storage: localFormStorage("form", serialize(form)),
  themes: [basic, basicDark, tailwind, bulma],
});

export default function App() {
  return <div className="dark:bg-slate-900">{FormBuilder}</div>;
}
