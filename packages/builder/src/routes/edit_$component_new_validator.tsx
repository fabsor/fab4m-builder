import { FormView, useForm } from "@fab4m/fab4m";
import React from "react";
import { useState } from "react";
import { ActionFunction, redirect, useOutletContext } from "react-router-dom";
import { findComponent, invariantReturn } from "../util";
import { validatorForm, validatorFromFormData } from "../forms/addValidator";
import { ActionCreatorArgs } from "../router";
import { ComponentContext } from "./edit_$component";
import { produce } from "immer";
import { FormRoute } from "@fab4m/routerforms";
import t from "../translations";

export function action({
  plugins,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ request, params }) => {
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
    await storage.editComponent(
      produce(currentComponent, (draft) => {
        draft.validators = draft.validators ?? [];
        draft.validators.push(validator);
      })
    );
    return redirect(".");
  };
}

export default function NewValidator() {
  const context = useOutletContext<ComponentContext>();
  const [data, changeData] = useState<{
    validator?: string;
    [key: string]: unknown;
  }>({});

  const newValidatorForm = useForm(
    () =>
      validatorForm(
        context.plugin.type.name,
        context.plugins.validators,
        data.validator
      ),
    [data.validator]
  ).onDataChange(changeData);
  return (
    <section>
      <h2>{t("validators")}</h2>
      {context.component.validators.map((validator, i) => (
        <div key={i}>{validator.type}</div>
      ))}
      <FormRoute useRouteAction={true} form={newValidatorForm} data={data} />
    </section>
  );
}
