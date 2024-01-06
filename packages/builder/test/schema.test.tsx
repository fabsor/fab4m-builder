import Ajv from "ajv";
import {
  formSchema,
  groupPlugin,
  groupWidgetPlugin,
  integerFieldPlugin,
  maxValidatorPlugin,
  minValidatorPlugin,
  numberFieldWidgetPlugin,
  textFieldPlugin,
  textFieldWidgetPlugin,
} from "../src";
import { expect, test } from "vitest";
import {
  createForm,
  integerField,
  textField,
  min,
  max,
  group,
  serialize,
  SerializedComponent,
} from "@fab4m/fab4m";

const form = createForm({
  number: integerField({
    label: "A number",
  }),
  text: textField({
    label: "Text",
    rules: [["number", min(5)]],
  }),
  group: group(
    {
      label: "A group",
    },
    {
      grouptext: textField({ label: "Group text" }),
    },
  ),
  variant: [
    [
      "number",
      max(5),
      textField({
        label: "Text 1",
      }),
    ],
    textField({
      label: "Text 2",
    }),
  ],
});

test("schema generation", () => {
  const definition = formSchema({
    types: [textFieldPlugin, integerFieldPlugin, groupPlugin],
    widgets: [
      textFieldWidgetPlugin,
      numberFieldWidgetPlugin,
      groupWidgetPlugin,
    ],
    validators: [minValidatorPlugin, maxValidatorPlugin],
  });
  const serializedForm = serialize(form);
  const ajv = new Ajv();
  const validate = ajv.compile(definition);
  const valid = validate(serializedForm);
  expect(valid).toBe(true);
  (serializedForm.components[0] as SerializedComponent).type = "float";
  const invalid = validate(serializedForm);
  expect(invalid).toBe(false);
});
