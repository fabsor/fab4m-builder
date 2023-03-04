import React from "react";
import { Outlet } from "react-router-dom";
import { FormBuilderContext } from "../components/FormBuilder";

export function FormBuilder(props: { context: FormBuilderContext }) {
  return (
    <main>
      <section>
        <h2>Components</h2>
      </section>
      <Outlet context={props.context} />
    </main>
  );
}
