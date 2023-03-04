import { createForm, textField } from "@fab4m/fab4m";
import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { FormBuilderContext } from "../components/FormBuilder";

const form = createForm({
  label: textField({
    label: "Label",
  }),
  name: textField({
    label: "Name",
  }),
});

export function NewComponentType() {
  const context = useOutletContext<FormBuilderContext>();
  const params = useParams<{ type: string }>();
  const type = context.plugins.types.find(
    (plugin) => plugin.type.name === params.type
  );
  return (
    <section>
      <StatefulFormRoute form={form} />
    </section>
  );
}
