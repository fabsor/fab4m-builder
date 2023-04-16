import { SerializedForm, StatefulFormView } from "@fab4m/fab4m";
import React, { useEffect } from "react";
import t from "../translations";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { Plugins } from "..";
import { LoaderCreatorArgs } from "../router";
import { unserializeForm } from "../util";

export function loader({ storage }: LoaderCreatorArgs) {
  return () => {
    return storage.loadForm();
  };
}

export default function FormBuilder(props: { plugins: Plugins }) {
  const form = useLoaderData() as SerializedForm;
  return (
    <main className="grid grid-cols-8 gap-2">
      <section className="col-span-6">
        <h2>{t("components")}</h2>
        {form.components.map((component, i) => (
          <article draggable key={i}>
            <h3>
              <Link to={`edit/${component.name ?? ""}`}>
                {component.label ?? component.name}
              </Link>
            </h3>
          </article>
        ))}
        <Outlet context={{ plugins: props.plugins }} />
      </section>
      <section className="col-span-2">
        <h2>Preview</h2>
        <StatefulFormView form={unserializeForm(form, props.plugins)} />
      </section>
    </main>
  );
}
