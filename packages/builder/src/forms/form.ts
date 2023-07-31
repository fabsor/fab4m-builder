import {
  createForm,
  detailsWidget,
  group,
  Labels,
  selectWidget,
  textField,
  Theme,
} from "@fab4m/fab4m";
import t from "../translations";

export interface FormSettings {
  title?: string;
  description?: string;
  theme: string;
  labels: Labels;
}

export function formSettingsForm(themes: Theme[]) {
  return createForm({
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
          required: true,
        }),
        next: textField({
          label: t("formsettings.next"),
          required: true,
        }),
        previous: textField({
          label: t("formsettings.previous"),
          required: true,
        }),
        complete: textField({
          label: t("formsettings.complete"),
          required: true,
        }),
        required: textField({
          label: t("formsettings.required"),
          required: true,
        }),
      }
    ),
  });
}
