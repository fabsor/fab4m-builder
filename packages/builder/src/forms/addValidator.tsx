import {
  createForm,
  fromFormData,
  group,
  selectWidget,
  textField,
  SerializedValidator,
} from "@fab4m/fab4m";
import { Plugins, ValidatorTypePlugin } from "..";
import { findComponentValidators, findPlugin, invariantReturn } from "../util";
import t from "../translations";

export function validatorForm(
  componentType: string,
  validatorPlugins: ValidatorTypePlugin[],
  validator?: string
) {
  let settings;
  const plugins = findComponentValidators(componentType, validatorPlugins);
  if (validator) {
    const plugin = findPlugin<ValidatorTypePlugin>(validator, plugins);
    if (plugin.editForm) {
      settings = group(
        {
          label: t("settings"),
        },
        plugin.editForm
      );
    }
  }
  return createForm(
    {
      validator: textField({
        label: t("validator"),
        required: true,
        widget: selectWidget(
          plugins.map((plugin) => [plugin.type.title, plugin.type.name])
        ),
      }),
      settings,
    },
    { description: "What a form", labels: { submit: "Add validator" } }
  );
}

export async function validatorFromFormData(
  fieldType: string,
  plugins: Plugins,
  request: Request
): Promise<SerializedValidator> {
  const plugin = findPlugin(fieldType, plugins.types);
  const formData = await request.formData();
  const validatorName = invariantReturn(formData.get("validator")?.toString());
  const data = fromFormData(
    validatorForm(fieldType, plugins.validators, validatorName),
    formData
  );
  return {
    type: plugin.type.name,
    settings: plugin.settingsFromForm
      ? plugin.settingsFromForm(data)
      : undefined,
  };
}
