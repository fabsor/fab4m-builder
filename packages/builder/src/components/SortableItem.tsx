import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import styles from "../styles";
import { CSS } from "@dnd-kit/utilities";
export default function SortableItem(props: {
  name: string;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const { active, attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <article ref={setNodeRef} style={style} {...attributes} className="mb-2">
      <header className={`${styles.item} mb-0`}>
        <div
          className={`${styles.insetBtn} w-10 text-l text-center mr-2 cursor-move`}
          {...listeners}
        >
          &#8645;
        </div>
        <h3 className="grow my-auto">{props.header}</h3>
      </header>
      <div className={active ? "hidden" : ""}>{props.children}</div>
    </article>
  );
}
