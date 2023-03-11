import { fromFormData, useForm, serializeComponent } from "@fab4m/fab4m";
import React, { useState } from "react";
import {
  ActionFunction,
  redirect,
  useOutletContext,
  useParams,
} from "react-router-dom";
import invariant from "tiny-invariant";
import { findPlugin } from "../util";
import { FormRoute } from "@fab4m/routerforms";
import { ActionCreatorArgs, FormBuilderContext } from "../router";
import {
  ComponentData,
  componentForm,
  componentFromFormData,
} from "../forms/component";

export function action({
  plugins,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ params, request }) => {
    invariant(params.type);
    const component = await componentFromFormData(
      params.type,
      plugins,
      request
    );
    await storage.addComponent(component);
    return redirect("../..");
  };
}

export function NewComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const type = useComponentType();
  const [data, changeData] = useState<Partial<ComponentData>>({});
  const widgetType = data.widget
    ? findPlugin(data.widget, context.plugins.widgets)
    : undefined;
  const form = useForm(
    () => componentForm(type, context.plugins, widgetType),
    [type, widgetType]
  ).onDataChange(changeData);
  return <FormRoute form={form} data={data} useRouteAction={true} />;
}

function useComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const params = useParams<{ type: string }>();
  invariant(params.type);
  return findPlugin(params.type, context.plugins.types);
}
