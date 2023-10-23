import {
  allowedValuesValidator,
  disallowedValuesValidator,
  exists,
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
    values: textField({ multiple: true, label: t("allowedValues.items") }),
    message: textAreaField({
      required: true,
      label: t("allowedValues.message"),
    }),
  }),
};

export const disallowedValuesValidatorPlugin: ValidatorTypePlugin<
  ValuesSettings,
  { message: string; values: string[] }
> = {
  type: disallowedValuesValidator,
  editForm: () => ({
    values: textField({ multiple: true, label: t("disallowedValues.items") }),
    message: textAreaField({
      required: true,
      label: t("disallowedValues.message"),
    }),
  }),
};
