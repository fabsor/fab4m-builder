import { SerializedForm } from "@fab4m/fab4m";
import React from "react";
import t from "../translations";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { FormBuilderContext, LoaderCreatorFn } from "../components/FormBuilder";

export const loader: LoaderCreatorFn = ({ storage }) => {
  return () => {
    return storage.loadForm();
  };
};

export default function FormBuilder(props: { context: FormBuilderContext }) {
  const form = useLoaderData() as SerializedForm;
  return (
    <main>
      <section>
        <h2>{t("components")}</h2>
        {form.components.map((component, i) => (
          <>
            <article draggable>
              <h3>
                <Link to={`edit/${component.name}`}>{component.label}</Link>
              </h3>
            </article>
          </>
        ))}
      </section>
      <Outlet context={props.context} />
    </main>
  );
}
