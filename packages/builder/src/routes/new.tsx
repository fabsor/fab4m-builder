import React from "react";
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { findComponentFromKey, findPlugin } from "../util";
import { FormBuilderContext, RouteArgs } from "../router";
import styles from "../styles";
import { serializeComponent, SerializedComponentsList } from "@fab4m/fab4m";

export function action({ plugins, storage }: RouteArgs) {
  return async ({ request }: ActionFunctionArgs) => {
    const data = await request.formData();
    const type = data.get("type");
    const parent = data.get("parent");
    if (!type) {
      throw new Error("Type not provided.");
    }
    const form = await storage.loadForm();
    const plugin = findPlugin(type.toString(), plugins.types);
    let list: SerializedComponentsList;
    if (parent) {
      const parentComponent = findComponentFromKey(
        form.components,
        parent.toString()
      );
      parentComponent.components ??= [];
      list = parentComponent.components;
    } else {
      list = form.components;
    }
    const component = plugin.init(`component__${list.length}`);
    component.label = plugin.type.title;
    list.push(serializeComponent(component));

    await storage.saveForm(form);
    return redirect(
      component.type.splitsForm
        ? ".."
        : `../edit/${
            parent ? `${parent.toString().replace("root:", "")}:` : "root:"
          }${component.name}`
    );
  };
}

export default function NewComponent() {
  const context = useOutletContext<FormBuilderContext>();
  const search = new URLSearchParams(useLocation().search);

  return (
    <Form className="flex flex-wrap" method="post">
      <input
        type="hidden"
        name="parent"
        value={search.get("parent")?.toString()}
      />
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
