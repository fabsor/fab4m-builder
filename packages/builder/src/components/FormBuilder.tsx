import { Form, SerializedForm } from "@fab4m/fab4m";
import React from "react";
import {
  createBrowserRouter,
  Link,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { NewComponent } from "../routes/new";
import { Plugins } from "..";
import { FormBuilder } from "../routes";
import { NewComponentType } from "../routes/new_$type";

export function routes(context: FormBuilderContext): RouteObject[] {
  return [
    {
      path: "/",
      element: <FormBuilder context={context} />,
      children: [
        {
          path: "",
          element: <Link to="new">New component</Link>,
        },
        {
          path: "new",
          element: <NewComponent />,
        },
        {
          path: "new/:type",
          element: <NewComponentType />,
        },
      ],
    },
  ];
}

export interface FormBuilderContext {
  form: Form;
  plugins: Plugins;
}

export function formBuilder(
  context: { plugins: Plugins },
  actions: {
    loadForm: () => Promise<SerializedForm>;
    saveForm: (form: SerializedForm) => Promise<SerializedForm>;
  }
) {
  const router = createBrowserRouter(routes(context, actions));
  return <RouterProvider router={router} />;
}
