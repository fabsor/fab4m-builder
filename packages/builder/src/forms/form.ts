import {
  createForm,
  detailsWidget,
  group,
  Labels,
  selectWidget,
  textAreaField,
  textField,
  Theme,
  useForm,
} from "@fab4m/fab4m";
import t from "../translations";

export interface FormSettings {
  title?: string;
  description?: string;
  theme: string;
  labels: Labels;
}

export function useFormSettingsForm(themes: Theme[]) {
  return useForm(
    () =>
      createForm({
        title: textField({
          label: t("formsettings.title"),
        }),
        description: textAreaField({
          label: t("formsettings.description"),
        }),
        theme: textField({
          label: t("formsettings.theme"),
          widget: selectWidget(themes.map((theme) => theme.name)),
        }),
        labels: group<Labels>(
          {
            label: t("formsettings.labels"),
            widget: detailsWidget(),
          },
          {
            submit: textField({
              label: t("formsettings.submit"),
            }),
            next: textField({
              label: t("formsettings.next"),
            }),
            previous: textField({
              label: t("formsettings.previous"),
            }),
            complete: textField({
              label: t("formsettings.complete"),
            }),
            required: textField({
              label: t("formsettings.required"),
            }),
          }
        ),
      }),
    [themes]
  );
}
