import {
  createForm,
  group,
  selectWidget,
  textAreaField,
  textField,
  useForm,
} from "@fab4m/fab4m";
import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { FormComponentTypePlugin, WidgetTypePlugin } from "src";
import { FormBuilderContext } from "../components/FormBuilder";
import invariant from "tiny-invariant";
import { findPlugin } from "../util";
import { FormRoute } from "@fab4m/routerforms";

interface ComponentData {
  label: string;
  name: string;
  settings?: Record<string, unknown>;
  widget: string;
  widgetSettings?: Record<string, unknown>;
}

function newForm(type: FormComponentTypePlugin, widget?: WidgetTypePlugin) {
  let settingsForm = undefined;
  let widgetSettingsForm = undefined;
  if (type.editForm) {
    settingsForm = group(
      {
        label: "Component settings",
      },
      type.editForm
    );
  }
  if (widget?.editForm) {
    widgetSettingsForm = group(
      {
        label: "Widget settings",
      },
      widget.editForm
    );
  }
  return createForm({
    label: textField({
      label: "Label",
    }),
    name: textField({
      label: "Name",
    }),
    description: textAreaField({
      label: "Description",
    }),
    widget: textField({
      label: "Widget",
      widget: selectWidget(["textfield"]),
    }),
    settingsForm,
    widgetSettingsForm,
  });
}

export function NewComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const type = useComponentType();
  const [data, changeData] = useState<Partial<ComponentData>>({});
  const widgetType = data.widget
    ? findPlugin(data.widget, context.plugins.widgets)
    : undefined;
  const form = useForm(
    () => newForm(type, widgetType),
    [type, widgetType]
  ).onDataChange(changeData);
  return (
    <section>
      <FormRoute form={form} data={data} />
    </section>
  );
}

function useComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const params = useParams<{ type: string }>();
  invariant(params.type);
  return findPlugin(params.type, context.plugins.types);
}
