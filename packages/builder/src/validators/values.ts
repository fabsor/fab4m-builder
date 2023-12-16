import {
  ValuesSettings,
  allowedValuesValidator,
  disallowedValuesValidator,
  textAreaField,
} from "@fab4m/fab4m";
import t from "../translations";
import { ValidatorTypePlugin } from "..";

export const allowedValuesValidatorPlugin: ValidatorTypePlugin<
  ValuesSettings,
  string
> = {
  type: allowedValuesValidator,
  formData: (settings) => settings.values.join(","),
  settingsFromForm: (value) => ({
    values: value.split(","),
    message: "",
  }),
  component: () =>
    textAreaField({
      description: t("allowedValues.description"),
      required: true,
    }),
};

export const disallowedValuesValidatorPlugin: ValidatorTypePlugin<
  ValuesSettings,
  string
> = {
  type: disallowedValuesValidator,
  formData: (settings) => settings.values.join(","),
  settingsFromForm: (value) => ({
    values: value.split(","),
    message: "",
  }),
  component: () =>
    textAreaField({
      description: t("allowedValues.description"),
      required: true,
    }),
};
