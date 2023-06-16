import {
  FormComponent,
  SerializedComponent,
  SerializedComponentsList,
  SerializedForm,
  StatefulFormView,
} from "@fab4m/fab4m";
import React, { forwardRef, useState } from "react";
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
  useDroppable,
  DragEndEvent,
  DragOverEvent,
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

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export function action({ storage }: ActionCreatorArgs): ActionFunction {
  return async ({ request }) => {
    const data = await request.formData();
    const form = await storage.loadForm();
    const from = invariantReturn(data.get("from"));
    const to = invariantReturn(data.get("to"));
    const [source, sourceList, sourceIndex] = findComponent(
      form.components,
      from.toString()
    );
    const [, targetList, targetIndex] = findComponent(
      form.components,
      to.toString()
    );
    // We're dropping an item into an empty group.
    if (to.toString().startsWith("drop-")) {
    }

    if (source && targetList) {
      sourceList?.splice(sourceIndex, 1);
      targetList?.splice(targetIndex, 0, source);
    }
    return await storage.saveForm(form);
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  const params = useParams();
  const fetcher = useFetcher();
  const [activeItem, setActiveItem] = useState<SerializedComponent | null>(
    null
  );
  const [over, setOver] = useState<string | undefined>(undefined);

  function setActive(id: UniqueIdentifier) {
    const [component] = findComponent(form.components, id);
    if (component) {
      setActiveItem(component);
    }
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
    setOver(null);
    if (over && active.id !== over.id) {
      fetcher.submit(
        { from: active.id.toString(), to: over.id.toString() },
        { method: "post" }
      );
    }
  }

  function handleDragOver(event: DragOverEvent) {
    setOver(event.over?.id?.toString());
  }

  const outlet = <Outlet context={{ plugins: props.plugins }} />;

  return (
    <main className="lg:grid grid-cols-8 gap-5 min-h-screen">
      <section className="col-span-6 p-4">
        <h2 className={styles.h2}>{t("components")}</h2>
        <div className="mb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            onDragStart={(e) => setActive(e.active.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <Components
              over={over}
              components={form.components}
              outlet={outlet}
              activeItem={activeItem}
              id={""}
            />
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
  components: SerializedComponentsList;
  outlet: JSX.Element;
  activeItem: SerializedComponent | null;
  over?: string;
  id: string;
}

function Components({
  components,
  outlet,
  activeItem,
  id,
  over,
}: ComponentsProps) {
  // Filter out any components that are variants, those are not supported in the form builder yet.
  const params = useParams();
  const componentsList = components.filter(
    (c) => !Array.isArray(c) && c.name
  ) as Array<Exclude<SerializedComponent, "name"> & { name: string }>;
  console.log(activeItem, over);
  if (over && over.startsWith(id) && activeItem) {
    const [, , index] = findComponent(componentsList, over);
    if (
      index &&
      componentsList.findIndex((c) => c.name === activeItem.name) !== -1
    ) {
      componentsList.splice(index, 0, activeItem);
    }
  }

  const items = componentsList.map((c) => `${id}.${c.name}`);
  const renderedItems = items.map((name, i) => {
    const component = invariantReturn(
      componentsList.find((c) => `${id}.${c.name}` === name)
    );
    return (
      <React.Fragment key={i}>
        <SortableItem
          key={i}
          name={component.name}
          collection={id}
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
        {component.type === "group" && (
          <Droppable
            component={component}
            id={id}
            over={over}
            outlet={outlet}
            activeItem={activeItem}
          />
        )}
      </React.Fragment>
    );
  });

  return (
    <div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {renderedItems}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeItem ? <Item title={"wat"}></Item> : null}
        </DragOverlay>,
        document.body
      )}
    </div>
  );
}

export function Droppable(props: {
  id: string;
  activeItem: SerializedComponent | null;
  component: SerializedComponent;
  over?: string;
  outlet: JSX.Element;
}) {
  const { setNodeRef } = useDroppable({
    id: `drop-${props.id}.${props.component.name}`,
  });
  return (
    <div
      className="-mt-2 border border-t-0 dark:border-slate-600 p-2 h-64"
      ref={setNodeRef}
    >
      <Components
        over={props.over}
        outlet={props.outlet}
        components={props.component.components ?? []}
        activeItem={props.activeItem}
        id={props.component.name ?? ""}
      />
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

function findComponent(
  components: SerializedComponentsList,
  id: UniqueIdentifier
):
  | [SerializedComponent, SerializedComponentsList, number]
  | [null, null, null] {
  const path = id.toString().split(".");
  if (path[0] === "") {
    path.splice(0, 1);
  }
  let tree = components;
  let component: SerializedComponent | null = null;
  let componentIndex: number = -1;
  for (const node of path) {
    const matchIndex = tree.findIndex(
      (c) => !Array.isArray(c) && c.name === node
    );
    const match = tree[matchIndex];
    if (!match || Array.isArray(match)) {
      break;
    }
    componentIndex = matchIndex;
    component = match;
    if (!component.components) {
      break;
    }

    tree = component.components;
  }
  return component ? [component, tree, componentIndex] : [null, null, null];
}
