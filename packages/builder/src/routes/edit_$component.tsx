import { useForm, SerializedComponent } from "@fab4m/fab4m";
import React, { useEffect, useState } from "react";
import {
  ActionFunction,
  redirect,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { FormComponentTypePlugin } from "../";
import invariant from "tiny-invariant";
import { findComponentFromKey, findPlugin, invariantReturn } from "../util";
import { FormRoute } from "@fab4m/routerforms";
import { componentForm, componentFromFormData } from "../forms/component";
import { ActionCreatorArgs, FormBuilderContext } from "src/router";
import { useFormBuilderContext } from ".";
import t from "../translations";

interface ComponentData {
  label: string;
  name: string;
  required: boolean;
  description?: string;
  settings?: Record<string, unknown>;
  widget: string;
  validators: Array<Record<string, unknown>>;
  rules: Array<{
    component: string;
    rule: string;
    settings?: Record<string, unknown>;
  }>;
  widgetSettings?: Record<string, unknown>;
}

export function action({
  plugins,
  storage,
}: ActionCreatorArgs): ActionFunction {
  return async ({ params, request }) => {
    const currentForm = await storage.loadForm();
    invariant(params.component);
    const currentComponent = findComponentFromKey(
      currentForm.components,
      params.component
    );
    const component = await componentFromFormData(
      currentComponent.type,
      plugins,
      request,
      currentForm
    );

    component.components = currentComponent.components;
    await storage.editComponent(params.component, component);
    await storage.flash({
      title: t("componentXSaved", {
        component: invariantReturn(component.label ?? component.name),
      }),
      description: t("componentSaved"),
      type: "success",
    });
    return redirect("../..");
  };
}

export interface ComponentContext extends FormBuilderContext {
  plugin: FormComponentTypePlugin;
  component: SerializedComponent;
}

export default function EditComponent() {
  const context = useOutletContext<FormBuilderContext>();
  const { plugin, component, currentForm } = useComponentInfo();
  const [data, changeData] = useState<Partial<ComponentData>>({});
  useEffect(() => {
    const widgetPlugin = findPlugin(
      component.widget.type,
      context.plugins.widgets
    );

    changeData({
      label: component.label,
      name: component.name,
      required: component.required,
      description: component.description,
      widget: component.widget.type,
      validators: component.validators.map((validator) => {
        const plugin = findPlugin(validator.type, context.plugins.validators);
        return {
          type: validator.type,
          settings: plugin.formData
            ? plugin.formData(validator.settings)
            : undefined,
        };
      }),
      rules: component.rules.map((rule) => {
        if (!Array.isArray(rule)) {
          throw new Error("Unexpected rule");
        }
        const plugin = findPlugin(rule[1].type, context.plugins.validators);
        return {
          component: rule[0],
          rule: rule[1].type,
          settings: plugin.formData
            ? plugin.formData(rule[1].settings)
            : undefined,
        };
      }),
      widgetSettings: widgetPlugin.formData
        ? widgetPlugin.formData(component.widget.settings)
        : (component.widget.settings as Record<string, unknown>),
    });
  }, [component.name]);
  const form = useForm(
    () =>
      componentForm({
        type: plugin,
        plugins: context.plugins,
        formData: currentForm,
        currentComponent: component,
      }),
    [plugin]
  ).onDataChange(changeData);
  return (
    <section className="-mb-8">
      <FormRoute
        form={form}
        data={data}
        useRouteAction={true}
        hideSubmit={true}
      />
    </section>
  );
}

function useComponentInfo() {
  const params = useParams<{ component: string }>();
  const context = useFormBuilderContext();
  invariant(params.component);
  const component = findComponentFromKey(
    context.form.components,
    params.component
  );

  const plugin = findPlugin<FormComponentTypePlugin>(
    component.type,
    context.plugins.types
  );
  return {
    plugin,
    component,
    currentForm: context.form,
  };
}
