import { Form } from "@fab4m/fab4m";
import React from "react";
import { Link, LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import { FormBuilderContext } from "../components/FormBuilder";

export function FormBuilder(props: { context: FormBuilderContext }) {
  return (
    <main>
      <section>
        <h2>Components</h2>
        {props.context.form.components.map((component, i) => (
          <article key={i}>{component.label}</article>
        ))}
      </section>
      <Outlet context={props.context} />
    </main>
  );
}
