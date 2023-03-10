import { SerializedForm } from "@fab4m/fab4m";
import React from "react";
import t from "../translations";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { Plugins } from "..";
import { LoaderCreatorArgs } from "../router";

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  return (
    <main>
      <section>
        <h2>{t("components")}</h2>
        {form.components.map((component, i) => (
          <article draggable key={i}>
            <h3>
              <Link to={`edit/${component.name}`}>{component.label}</Link>
            </h3>
          </article>
        ))}
      </section>
      <Outlet context={{ plugins: props.plugins }} />
    </main>
  );
}
