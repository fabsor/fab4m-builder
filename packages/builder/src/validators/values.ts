import {
  allowedValuesValidator,
  disallowedValuesValidator,
  textAreaField,
  textField,
  ValuesSettings,
} from "@fab4m/fab4m";
import t from "../translations";
import { ValidatorTypePlugin } from "..";

export const allowedValuesValidatorPlugin: ValidatorTypePlugin<
  ValuesSettings,
  { message: string; values: string[] }
> = {
  type: allowedValuesValidator,
  editForm: () => ({
    message: textAreaField({
      required: true,
      label: t("allowedValues.message"),
    }),
    values: textField({ multiple: true, label: t("allowedValues.items") }),
  }),
};

export const disallowedValuesValidatorPlugin: ValidatorTypePlugin<
  ValuesSettings,
  { message: string; values: string[] }
> = {
  type: disallowedValuesValidator,
  editForm: () => ({
    message: textAreaField({
      required: true,
      label: t("disallowedValues.message"),
    }),
    values: textField({ multiple: true, label: t("disallowedValues.items") }),
  }),
};
