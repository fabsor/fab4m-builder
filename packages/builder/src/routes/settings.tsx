import { SerializedForm, fromFormData, useForm } from "@fab4m/fab4m";
import { StatefulFormRoute } from "@fab4m/routerforms";
import React from "react";
import {
  ActionFunctionArgs,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import { formSettingsForm } from "../forms/form";
import t from "../translations";
import { useFormBuilderContext } from ".";
import { ActionCreatorArgs } from "../router";

export function action({ storage, themes }: ActionCreatorArgs) {
  return async ({ request }: ActionFunctionArgs) => {
    const form = await storage.loadForm();
    const settingsForm = formSettingsForm(themes);
    const data = fromFormData(settingsForm, await request.formData());
    form.labels = data.labels;
    form.theme = data.theme;
    await storage.saveForm(form);
    await storage.flash({
      title: t("settingsSaved"),
      description: t("formSettingsSaved"),
      type: "success",
    });
    return redirect("../..");
  };
}

export default function Settings() {
  const form = useRouteLoaderData("root") as SerializedForm;
  const context = useFormBuilderContext();
  const settingsForm = useForm(
    () => formSettingsForm(context.themes),
    [context.themes]
  );
  return (
    <StatefulFormRoute
      form={settingsForm}
      data={{
        theme: form.theme,
        labels: {
          submit: form.labels?.submit ?? t("submit"),
          next: form.labels?.next ?? t("next"),
          previous: form.labels?.previous ?? t("previous"),
          complete: form.labels?.complete ?? t("complete"),
          required: form.labels?.required ?? t("required"),
        },
      }}
      useRouteAction={true}
    />
  );
}
