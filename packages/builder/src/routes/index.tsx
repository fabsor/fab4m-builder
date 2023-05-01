import { SerializedForm, StatefulFormView } from "@fab4m/fab4m";
import React, { useEffect, useState } from "react";
import t from "../translations";
import {
  ActionFunction,
  Form,
  Link,
  Outlet,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { Plugins } from "..";
import { ActionCreatorArgs, LoaderCreatorArgs } from "../router";
import { invariantReturn, unserializeForm } from "../util";
import styles from "../styles";
import { produce } from "immer";

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export function action({ storage }: ActionCreatorArgs): ActionFunction {
  return async ({ request }) => {
    const data = await request.formData();
    const form = await storage.loadForm();
    const up = data.get("move_up");
    if (up) {
      await storage.saveForm(
        produce(form, (draft) => {
          const index = parseInt(up.toString(), 10);
          const moveElement = draft.components[index];
          draft.components[index] = draft.components[index - 1];
          draft.components[index - 1] = moveElement;
        })
      );
    }
    const down = data.get("move_down");
    if (down) {
      await storage.saveForm(
        produce(form, (draft) => {
          const index = parseInt(down.toString(), 10);
          const moveElement = draft.components[index];
          draft.components[index] = draft.components[index + 1];
          draft.components[index + 1] = moveElement;
        })
      );
    }
    const order = data.getAll("order");
    if (order.length === form.components.length) {
      const newOrder = order.map((name) => {
        return invariantReturn(
          form.components.find((o) => !Array.isArray(o) && o.name === name)
        );
      });
      form.components = newOrder;
      await storage.saveForm(form);
    }
    return null;
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  const submit = useSubmit();
  const [dragIndex, changeDragIndex] = useState(-1);
  const [dropTargetIndex, changeDropTargetIndex] = useState(-1);

  const start = (e: React.DragEvent<HTMLElement>, i: number) => {
    changeDragIndex(i);
  };
  const drop = (e: React.DragEvent<HTMLElement>) => {
    const newOrder = [...form.components];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropTargetIndex, 0, form.components[dragIndex]);
    changeDragIndex(-1);
    changeDropTargetIndex(-1);
    const data = new FormData();
    newOrder.forEach((component) => {
      if (!Array.isArray(component) && component.name) {
        data.append("order", component.name);
      }
    });
    submit(data, { method: "post" });
  };
  return (
    <main className="lg:grid grid-cols-8 gap-5 min-h-screen">
      <section className="col-span-6 p-4">
        <h2 className={styles.h2}>{t("components")}</h2>
        <div>
          <Form method="post">
            {form.components.map((component, i) => (
              <React.Fragment key={i}>
                <article
                  draggable
                  onDragStart={(e) => start(e, i)}
                  onDragEnd={() => changeDragIndex(-1)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={drop}
                  onDragEnter={() => changeDropTargetIndex(i)}
                  onDragLeave={() => changeDropTargetIndex(-1)}
                  key={i}
                  className={`${styles.item}`}
                >
                  <div className="border w-10 h-fill bg-slate-300 mr-2 cursor-move"></div>
                  <h3>
                    <Link to={`edit/${component.name ?? ""}`} className="block">
                      {!Array.isArray(component)
                        ? component.label ?? component.name
                        : null}
                    </Link>
                  </h3>
                  <div className="ml-auto flex">
                    {i !== 0 && (
                      <button
                        name="move_up"
                        value={i}
                        className="mr-2 border p-2 text-xs h-fill bg-slate-300"
                      >
                        Move up
                      </button>
                    )}
                    {i !== form.components.length - 1 && (
                      <button
                        name="move_down"
                        value={i}
                        className="mr-2 border p-2 text-xs h-fill bg-slate-300"
                      >
                        Move down
                      </button>
                    )}
                  </div>
                </article>
                {dropTargetIndex === i && <div className={styles.shadowItem} />}
              </React.Fragment>
            ))}
          </Form>
        </div>
        <Outlet context={{ plugins: props.plugins }} />
      </section>
      <section className="col-span-2 border-l p-4 bg-slate-50">
        <h2 className={styles.h2}>Preview</h2>
        <StatefulFormView
          hideSubmit={true}
          form={unserializeForm(form, props.plugins)}
        />
      </section>
    </main>
  );
}
