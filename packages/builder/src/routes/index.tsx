import {
  SerializedComponent,
  SerializedForm,
  StatefulFormView,
} from "@fab4m/fab4m";
import React, { forwardRef, useCallback, useRef, useState } from "react";
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
import {
  draggableItems,
  findKey,
  invariantReturn,
  unserializeForm,
} from "../util";
import styles from "../styles";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
  UniqueIdentifier,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export function action({ storage }: ActionCreatorArgs): ActionFunction {
  return async ({ request }) => {
    const data = await request.formData();
    const form = await storage.loadForm();
    const from = invariantReturn(data.get("from")).toString();
    const to = invariantReturn(data.get("to")).toString();
    const [sourceList, sourceIndex] = findKey(form.components, from);
    if (to.startsWith("drop-")) {
      const parentKey = to.split("drop-")[1];
      const parent = form.components.find(
        (c) => !Array.isArray(c) && c.name === parentKey
      );
      if (parent && !Array.isArray(parent)) {
        parent.components ??= [];
        parent.components.push(form.components[sourceIndex]);
        form.components.splice(sourceIndex, 1);
      }
    } else {
      const [targetList, targetIndex] = findKey(form.components, to);
      if (sourceList && targetList) {
        const item = sourceList[sourceIndex];
        if (sourceIndex !== -1 && targetIndex !== -1) {
          sourceList.splice(sourceIndex, 1);
          targetList.splice(targetIndex, 0, item);
        }
      }
    }
    return await storage.saveForm(form);
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  const params = useParams();
  const fetcher = useFetcher();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const items = draggableItems(form.components);
  function setActive(id: UniqueIdentifier) {
    setActiveItem(id.toString());
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);
    if (over && active.id !== over.id) {
      fetcher.submit(
        { from: active.id.toString(), to: over.id.toString() },
        { method: "post" }
      );
    }
  }
  console.log(fetcher.state);
  const outlet = <Outlet context={{ plugins: props.plugins }} />;
  return (
    <main className="lg:grid grid-cols-8 gap-5 min-h-screen">
      <section className="col-span-6 p-4 relative">
        {fetcher.state === "submitting" && (
          <div className="absolute h-full w-full dark:bg-slate-900 flex justify-center dark:text-white text-3xl">
            Loading...
          </div>
        )}
        <h2 className={styles.h2}>{t("components")}</h2>
        <div className="mb-6">
          <DndContext
            sensors={sensors}
            onDragStart={(e) => setActive(e.active.id)}
            onDragEnd={handleDragEnd}
          >
            <Components
              items={items}
              parent="root:"
              outlet={outlet}
              activeItem={activeItem}
            />
            {createPortal(
              <DragOverlay>
                {activeItem ? (
                  <Item title={items.get(activeItem)?.label ?? ""}></Item>
                ) : null}
              </DragOverlay>,
              document.body
            )}
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

interface ComponentsProps {
  parent: string;
  items: Map<string, SerializedComponent>;
  outlet: JSX.Element;
  activeItem: string | null;
}

function Components(props: ComponentsProps) {
  const renderedItems: JSX.Element[] = [];
  const params = useParams();
  console.log(props.parent);
  for (const [key, component] of props.items.entries()) {
    if (key === `${props.parent}${component.name}`) {
      renderedItems.push(
        <React.Fragment key={key}>
          <SortableItem
            name={component.name ?? ""}
            parent={props.parent}
            header={
              <>
                {component.type !== "pagebreak" ? (
                  <Link to={`edit/${key}`} className="block">
                    {component.label ?? component.name}
                  </Link>
                ) : (
                  t("pageBreak")
                )}
              </>
            }
          >
            {params.component === key && (
              <div className="border -mt-1 dark:border-slate-600 p-3 pl-5 dark:bg-slate-800">
                {props.outlet}
              </div>
            )}
            {component.type === "group" && (
              <div className="border -mt-3 dark:border-slate-600 p-3 pl-5 dark:bg-slate-800">
                <Components
                  parent={
                    props.parent !== "root:"
                      ? `${props.parent}${component.name}:`
                      : `${component.name}:`
                  }
                  items={props.items}
                  outlet={props.outlet}
                  activeItem={props.activeItem}
                />
                <div className="mt-6">
                  <Link
                    to={`/new?parent=${key}`}
                    className={`${styles.primaryBtn}`}
                  >
                    {t("newComponent")}
                  </Link>
                </div>
              </div>
            )}
          </SortableItem>
        </React.Fragment>
      );
    }
  }
  return (
    <div>
      <SortableContext
        items={[...props.items.keys()].filter((k) =>
          k.startsWith(props.parent)
        )}
        strategy={verticalListSortingStrategy}
      >
        {renderedItems}
      </SortableContext>
    </div>
  );
}

export const Item = forwardRef<HTMLDivElement, { title: string }>(
  ({ title, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        <div className={`${styles.item} mb-0`}>{title}</div>
      </div>
    );
  }
);
