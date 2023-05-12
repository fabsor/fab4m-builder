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
            className={`${styles.insetBtn} mr-4 p-4 text-base flex font-bold rounded`}
            to={type.type.name}
            key={i}
          >
            {type.icon && <span className="text-3xl mr-1">{type.icon}</span>}
            <span className="my-auto">{type.type.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
