import {
  FormComponentWithName,
  SerializedComponent,
  SerializedForm,
  StatefulFormView,
  tailwind,
} from "@fab4m/fab4m";
import React, { useState } from "react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export function action({ storage }: ActionCreatorArgs): ActionFunction {
  return async ({ request }) => {
    const data = await request.formData();
    const form = await storage.loadForm();
    const order = data.getAll("order");
    console.log(order);
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
  // Filter out any components that are variants, those are not supported in the form builder yet.
  const components = form.components.filter(
    (c) => !Array.isArray(c) && c.name
  ) as Array<Exclude<SerializedComponent, "name"> & { name: string }>;
  form.theme = "tailwind";
  const submit = useSubmit();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const items = components.map((c) => c.name);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());
      const formData = new FormData();
      arrayMove(items, oldIndex, newIndex).forEach((name) =>
        formData.append("order", name)
      );
      submit(formData, { method: "post" });
    }
  }
  return (
    <main className="lg:grid grid-cols-8 gap-5 min-h-screen">
      <section className="col-span-6 p-4">
        <h2 className={styles.h2}>{t("components")}</h2>
        <div className="mb-6">
          <Form method="post">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {components.map((component, i) => (
                  <SortableItem key={i} id={component.name}>
                    <article key={i} className={`${styles.item}`}>
                      <div
                        className={`${styles.insetBtn} w-10 text-l text-center mr-2 cursor-move`}
                      >
                        &#8645;
                      </div>
                      <h3 className="grow">
                        <Link
                          to={`edit/${component.name ?? ""}`}
                          className="block"
                        >
                          {!Array.isArray(component)
                            ? component.label ?? component.name
                            : null}
                        </Link>
                      </h3>
                    </article>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </Form>
        </div>
        <Outlet context={{ plugins: props.plugins }} />
      </section>
      <section className="col-span-2 border-l dark:border-slate-700 p-4 dark:bg-slate-800">
        <h2 className={styles.h2}>Preview</h2>
        <div className="max-h-screen overflow-auto">
          <StatefulFormView
            hideSubmit={true}
            form={unserializeForm(form, props.plugins)}
          />
        </div>
      </section>
    </main>
  );
}

function SortableItem(props: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
