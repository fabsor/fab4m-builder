import {
  createForm,
  fromFormData,
  group,
  selectWidget,
  textField,
  SerializedValidator,
  equals,
  Validator,
  detailsWidget,
} from "@fab4m/fab4m";
import { Plugins, ValidatorTypePlugin } from "..";
import {
  findComponent,
  findComponentValidators,
  findPlugin,
  invariantReturn,
} from "../util";
import t from "../translations";
import invariant from "tiny-invariant";
import { ActionCreatorArgs } from "../router";
import { ActionFunction, redirect } from "react-router-dom";

export function action({
  plugins,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ params, request }) => {
    const currentForm = await storage.loadForm();
    const currentComponent = findComponent(
      currentForm,
      invariantReturn(params.component)
    );
    const validator = await validatorFromFormData(
      currentComponent.type,
      plugins,
      request
    );
    await storage.editComponent({
      ...currentComponent,
      validators: [...currentComponent.validators, validator],
    });
    return redirect("../..");
  };
}
export function newValidatorForm(
  componentType: string,
  validatorPlugins: ValidatorTypePlugin[]
) {
  const plugins = findComponentValidators(componentType, validatorPlugins);
  const settings = plugins
    .filter((plugin) => plugin.editForm)
    .map((plugin) => {
      invariant(plugin.editForm);
      return [
        "validators.$.validator",
        equals(plugin.type.name),
        group(
          {
            label: plugin.type.title,
          },
          plugin.editForm
        ),
      ];
    });
  const form = createForm(
    {
      validators: group(
        {
          label: t("validators"),
          multiple: true,
        },
        {
          validator: textField({
            label: t("validator"),
            required: true,
            widget: selectWidget(
              plugins.map((plugin) => [plugin.type.title, plugin.type.name])
            ),
          }),
          settings: settings,
        }
      ),
    },
    { description: "What a form", labels: { submit: "Add validator" } }
  );
  console.log(form);
  return form;
}

export async function validatorFromFormData(
  fieldType: string,
  plugins: Plugins,
  request: Request
): Promise<SerializedValidator> {
  const plugin = findPlugin(fieldType, plugins.types);
  const formData = await request.formData();
  const data = fromFormData(
    newValidatorForm(fieldType, plugins.validators),
    formData
  );
  return {
    type: data.validator,
    settings: plugin.settingsFromForm
      ? plugin.settingsFromForm(data)
      : undefined,
  };
}
