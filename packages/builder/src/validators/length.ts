import {
  floatField,
  maxLengthValidator,
  minLengthValidator,
} from "@fab4m/fab4m";
import t from "../translations";
import { ValidatorTypePlugin } from "..";

export const minLengthValidatorPlugin: ValidatorTypePlugin<
  number,
  { minLength: number }
> = {
  type: minLengthValidator,
  settingsFromForm: ({ minLength }) => minLength,
  editForm: () => ({
    minLength: floatField({
      required: true,
      label: t("length.minLength"),
    }),
  }),
};

export const maxLengthValidatorPlugin: ValidatorTypePlugin<
  number,
  { maxLength: number }
> = {
  type: maxLengthValidator,
  settingsFromForm: ({ maxLength }) => maxLength,
  editForm: () => ({
    maxLength: floatField({
      required: true,
      label: t("length.maxLength"),
    }),
  }),
};
