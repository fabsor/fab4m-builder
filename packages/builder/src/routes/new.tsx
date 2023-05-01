import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FormBuilderContext } from "../router";
import styles from "../styles";

export default function NewComponent() {
  const context = useOutletContext<FormBuilderContext>();
  return (
    <section>
      <h2 className={styles.h2}>Add new component</h2>
      <div className="flex flex-wrap">
        {context.plugins.types.map((type, i) => (
          <Link
            className="bg-slate-300 p-3 mr-2 rounded hover:bg-slate-500"
            to={type.type.name}
            key={i}
          >
            {type.type.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
