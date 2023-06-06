import {
  SerializedComponent,
  SerializedForm,
  StatefulFormView,
} from "@fab4m/fab4m";
import React, { useState } from "react";
import t from "../translations";
import {
  ActionFunction,
  Link,
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
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
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem";

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
    const newOrder = order.map((name) => {
      return invariantReturn(
        form.components.find((o) => !Array.isArray(o) && o.name === name)
      );
    });
    form.components = newOrder;
    await storage.saveForm(form);
    return order;
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  const params = useParams();
  const location = useLocation();
  const fetcher = useFetcher<string[]>();
  // Filter out any components that are variants, those are not supported in the form builder yet.
  const components = form.components.filter(
    (c) => !Array.isArray(c) && c.name
  ) as Array<Exclude<SerializedComponent, "name"> & { name: string }>;
  form.theme = "tailwind";
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const items = [...components.map((c) => c.name)];
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());
      const formData = new FormData();
      const newOrder = arrayMove(items, oldIndex, newIndex);
      newOrder.forEach((name) => formData.append("order", name));
      fetcher.submit(formData, { method: "post" });
    }
  }
  const outlet = <Outlet context={{ plugins: props.plugins }} />;
  const renderedItems = items.map((name, i) => {
    const component = invariantReturn(components.find((c) => c.name === name));
    return (
      <SortableItem
        key={i}
        name={component.name}
        header={
          <>
            {component.type !== "pagebreak" ? (
              <Link to={`edit/${component.name}`} className="block">
                {component.label ?? component.name}
              </Link>
            ) : (
              t("pageBreak")
            )}
          </>
        }
      >
        {params.component === component.name && (
          <div className="border -mt-1 dark:border-slate-600 p-3 pl-5 dark:bg-slate-800">
            {outlet}
          </div>
        )}
      </SortableItem>
    );
  });

  return (
    <main className="lg:grid grid-cols-8 gap-5 min-h-screen">
      <section className="col-span-6 p-4">
        <h2 className={styles.h2}>{t("components")}</h2>
        <div className="mb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              disabled={location.pathname !== "/"}
              strategy={verticalListSortingStrategy}
            >
              {renderedItems}
            </SortableContext>
          </DndContext>
        </div>
        <a href="new" className={styles.primaryBtn}>
          {t("newComponent")}
        </a>
        {!params.component && outlet}
      </section>
      <section className="col-span-2 border-l dark:border-slate-700 p-4 dark:bg-slate-800">
        <h2 className={styles.h2}>Preview</h2>
        <div>
          <StatefulFormView
            hideSubmit={true}
            form={unserializeForm(form, props.plugins)}
          />
        </div>
      </section>
    </main>
  );
}
