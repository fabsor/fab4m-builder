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
import { minValidatorPlugin } from "../../src/validators/numbers";
import "@fab4m/fab4m/css/basic/basic.css";
import { localFormStorage } from "../../src/localstorage";

const form = createForm({
  text: textField({ label: "Text" }),
});

const FormBuilder = formBuilder(
  {
    types: [textFieldPlugin, integerFieldPlugin, floatFieldPlugin],
    widgets: [textFieldWidgetPlugin, numberFieldWidgetPlugin],
    validators: [minValidatorPlugin],
  },
  localFormStorage("form", serialize(form))
);

export default function App() {
  return (
    <div style={{ maxWidth: "900px", padding: "1em", margin: "0 auto" }}>
      {FormBuilder}
    </div>
  );
}
