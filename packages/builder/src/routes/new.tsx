import React from "react";
import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { findComponentFromKey, findPlugin } from "../util";
import { ActionCreatorArgs, FormBuilderContext } from "../router";
import styles from "../styles";
import { serializeComponent, SerializedComponentsList } from "@fab4m/fab4m";
import t from "../translations";
import { icons } from "../icons";

export function action({ plugins, storage }: ActionCreatorArgs) {
  return async (args: ActionFunctionArgs) => {
    const data = await args.request.formData();
    const type = data.get("type");
    const parent = data.get("parent");
    if (!type) {
      throw new Error("Type not provided.");
    }
    const form = await storage.loadForm(args);
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

    await storage.saveForm(form, args);
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
    <>
      <h2 className={styles.h2}>{t("addNewComponent")}</h2>
      <div className="p-4 mt-4 bg-slate-100 border rounded dark:border-slate-400 dark:bg-slate-700">
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
              className={`${styles.insetBtn} mr-4 py-2 w-40 mb-4 text-base flex font-bold rounded`}
              key={i}
            >
              {icons[type.type.name] && (
                <span className="text-3xl mr-2">{icons[type.type.name]}</span>
              )}
              <span className="my-auto">{type.type.title}</span>
            </button>
          ))}
        </Form>
        <Link className={`${styles.dangerBtn} inline-block mt-2`} to="../..">
          {t("cancel")}
        </Link>
      </div>
    </>
  );
}
