import {
  createForm,
  group,
  selectWidget,
  textAreaField,
  textField,
  fromFormData,
  useForm,
  FormComponentWithName,
  serializeComponent,
  SerializedForm,
  SerializedComponent,
  serializeWidget,
} from "@fab4m/fab4m";
import React, { useState } from "react";
import {
  ActionFunction,
  redirect,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { FormStorage } from "../";
import {
  ActionCreatorArgs,
  FormBuilderContext,
} from "../components/FormBuilder";
import invariant from "tiny-invariant";
import { findComponent, findPlugin, invariantReturn } from "../util";
import { FormRoute } from "@fab4m/routerforms";
import { componentForm } from "../forms/component";

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
  context,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ params, request }) => {
    const currentForm = await storage.loadForm();
    const currentComponent = findComponent(
      currentForm,
      invariantReturn(params.component)
    );
    const plugin = findPlugin(currentComponent.type, context.plugins.types);
    const formData = await request.formData();
    const widgetName = formData.get("widget")?.toString();
    const widgetPlugin = findPlugin(widgetName ?? "", context.plugins.widgets);
    const form = componentForm(plugin, widgetPlugin);
    const data = fromFormData<ComponentData>(form, formData);
    invariant(widgetPlugin.type.init);
    const widget =
      widgetPlugin.type.name != currentComponent.widget.type
        ? serializeWidget(widgetPlugin.type.init())
        : currentComponent.widget;
    await storage.editComponent({
      ...currentComponent,
      ...data,
      type: currentComponent.type,
      widget: widget,
    });
    return redirect("../..");
  };
}

export default function NewComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const { plugin, component } = useComponentInfo();
  const [data, changeData] = useState<Partial<ComponentData>>({
    label: component.label,
    name: component.name,
    required: component.required,
    description: component.description,
    widget: component.widget.type,
    widgetSettings: component.widget.settings as Record<string, unknown>,
  });
  const widgetType = data.widget
    ? findPlugin(data.widget, context.plugins.widgets)
    : undefined;
  const form = useForm(
    () => componentForm(plugin, widgetType),
    [plugin, widgetType]
  ).onDataChange(changeData);
  return (
    <section>
      <FormRoute form={form} data={data} useRouteAction={true} />
    </section>
  );
}

function useComponentInfo() {
  const params = useParams<{ component: string }>();
  const context = useOutletContext<FormBuilderContext>();
  invariant(params.component);
  const form = useRouteLoaderData("root") as SerializedForm;
  const component = findComponent(form, params.component);
  const plugin = findPlugin(component.type, context.plugins.types);
  return { plugin, component };
}
