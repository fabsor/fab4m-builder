import { createForm } from "@fab4m/fab4m";
import { findPlugin } from "../util";
import { ValidatorTypePlugin } from "../index";
export function validatorForm(plugins: ValidatorTypePlugin[]) {

  return createForm(plugin.editForm);
}