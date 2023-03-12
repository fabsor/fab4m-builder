import { integerField, minValidator } from "@fab4m/fab4m";
import { ValidatorTypePlugin } from "..";

export const minValidatorPlugin: ValidatorTypePlugin<number> = {
  type: minValidator,
  editForm: {
    min: integerField({
      label: "Min value",
      required: true,
    }),
  },
  settingsFromForm: (data) => data.min as number,
};
