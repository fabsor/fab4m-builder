import { integerField, minValidator, maxValidator } from "@fab4m/fab4m";
import t from "../translations";
import { ValidatorTypePlugin } from "..";

export const minValidatorPlugin: ValidatorTypePlugin<number, { min: number }> =
  {
    type: minValidator,
    editForm: () => ({
      min: integerField({
        label: t("numbers.minValue"),
        required: true,
      }),
    }),
    formData: (settings: number) => ({
      min: settings,
    }),
    settingsFromForm: (data) => data.min as number,
  };

export const maxValidatorPlugin: ValidatorTypePlugin<number, { min: number }> =
  {
    type: maxValidator,
    editForm: () => ({
      min: integerField({
        label: t("length.maxValue"),
        required: true,
      }),
    }),
    formData: (settings: number) => ({
      min: settings,
    }),
    settingsFromForm: (data) => data.min as number,
  };
