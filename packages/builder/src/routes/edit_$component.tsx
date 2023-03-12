import { useForm, SerializedForm, SerializedComponent } from "@fab4m/fab4m";
import React, { useEffect, useState } from "react";
import {
  ActionFunction,
  Outlet,
  redirect,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { FormComponentTypePlugin, WidgetTypePlugin } from "../";
import invariant from "tiny-invariant";
import { findComponent, findPlugin, invariantReturn } from "../util";
import { FormRoute } from "@fab4m/routerforms";
import { componentForm, componentFromFormData } from "../forms/component";
import { ActionCreatorArgs, FormBuilderContext } from "src/router";

interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  settings?: Record<string, unknown>;
  widget: string;
  widgetSettings?: Record<string, unknown>;
}

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
    const component = await componentFromFormData(
      currentComponent.type,
      plugins,
      request
    );
    await storage.editComponent(component);
    return redirect("../..");
  };
}

export interface ComponentContext extends FormBuilderContext {
  plugin: FormComponentTypePlugin;
  component: SerializedComponent;
}

export default function EditComponent() {
  const context = useOutletContext<FormBuilderContext>();
  const { plugin, component } = useComponentInfo();
  const [data, changeData] = useState<Partial<ComponentData>>({});
  const componentContext: ComponentContext = {
    ...context,
    plugin,
    component,
  };
  useEffect(() => {
    changeData({
      label: component.label,
      name: component.name,
      required: component.required,
      description: component.description,
      widget: component.widget.type,
      widgetSettings: component.widget.settings as Record<string, unknown>,
    });
  }, [component]);
  const widgetType = data.widget
    ? findPlugin<WidgetTypePlugin>(data.widget, context.plugins.widgets)
    : undefined;

  const form = useForm(
    () => componentForm(plugin, context.plugins, widgetType),
    [plugin, widgetType]
  ).onDataChange(changeData);
  return (
    <section>
      <FormRoute
        form={form}
        data={data}
        useRouteAction={true}
        hideSubmit={true}
      />
      <Outlet context={componentContext} />
    </section>
  );
}

function useComponentInfo() {
  const params = useParams<{ component: string }>();
  const context = useOutletContext<FormBuilderContext>();
  invariant(params.component);
  const form = useRouteLoaderData("root") as SerializedForm;
  const component = findComponent(form, params.component);
  const plugin = findPlugin<FormComponentTypePlugin>(
    component.type,
    context.plugins.types
  );
  return { plugin, component };
}
