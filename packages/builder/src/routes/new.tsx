import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FormBuilderContext } from "../components/FormBuilder";

export default function NewComponent() {
  const context = useOutletContext<FormBuilderContext>();
  return (
    <section>
      <h2>Add new component</h2>
      {context.plugins.types.map((type, i) => (
        <Link to={type.type.name} key={i}>
          {type.type.title}
        </Link>
      ))}
    </section>
  );
}
