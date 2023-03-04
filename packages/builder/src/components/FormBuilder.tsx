import { Form } from "@fab4m/fab4m";
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
      ],
    },
  ];
}

export interface FormBuilderContext {
  form: Form;
  plugins: Plugins;
}

export function formBuilder(context: { form: Form; plugins: Plugins }) {
  const router = createBrowserRouter(routes(context));
  return <RouterProvider router={router} />;
}
