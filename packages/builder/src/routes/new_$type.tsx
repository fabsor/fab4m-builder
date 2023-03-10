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
import { ComponentData, componentForm } from "../forms/component";

export function action({
  plugins,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ params, request }) => {
    const type = findPlugin(params.type ?? "", plugins.types);
    const formData = await request.formData();
    const widgetName = formData.get("widget")?.toString();
    const widget = findPlugin(widgetName ?? "", plugins.widgets);
    invariant(widget.type.init);
    const form = componentForm(type, plugins, widget);
    const data = fromFormData(form, formData);
    await storage.addComponent(
      serializeComponent({
        ...data,
        type: type.type,
        widget: widget.type.init(),
        validators: [],
        rules: [],
        settings: undefined,
      })
    );
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
