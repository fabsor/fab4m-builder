import React from "react";
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useOutletContext,
} from "react-router-dom";
import { findPlugin } from "../util";
import { FormBuilderContext, RouteArgs } from "../router";
import styles from "../styles";
import { serializeComponent } from "@fab4m/fab4m";

export function action({ plugins, storage }: RouteArgs) {
  return async ({ request }: ActionFunctionArgs) => {
    const data = await request.formData();
    const type = data.get("type");
    if (!type) {
      throw new Error("Type not provided.");
    }
    const form = await storage.loadForm();
    const plugin = findPlugin(type.toString(), plugins.types);
    const component = plugin.init(`component__${form.components.length}`);
    component.label = plugin.type.title;
    form.components.push(serializeComponent(component));
    await storage.saveForm(form);
    return redirect(`../edit/${component.name}`);
  };
}

export default function NewComponent() {
  const context = useOutletContext<FormBuilderContext>();
  return (
    <Form className="flex flex-wrap" method="post">
      {context.plugins.types.map((type, i) => (
        <button
          name="type"
          value={type.type.name}
          className={`${styles.insetBtn} mr-4 p-4 text-base flex font-bold rounded`}
          key={i}
        >
          {type.icon && <span className="text-3xl mr-1">{type.icon}</span>}
          <span className="my-auto">{type.type.title}</span>
        </button>
      ))}
    </Form>
  );
}
