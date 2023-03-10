import React from "react";
import {
  createBrowserRouter,
  Link,
  LoaderFunction,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { NewComponent } from "../routes/new";
import { FormStorage, Plugins } from "..";
import * as root from "../routes";
import * as EditComponent from "../routes/edit_$component";
import * as NewComponentType from "../routes/new_$type";
export interface LoaderCreatorArgs {
  context: FormBuilderContext;
  storage: FormStorage;
}

export type ActionCreatorArgs = LoaderCreatorArgs;
export type LoaderCreatorFn = (args: LoaderCreatorArgs) => LoaderFunction;

export function routes(
  context: FormBuilderContext,
  storage: FormStorage
): RouteObject[] {
  return [
    {
      path: "/",
      loader: root.loader({ context, storage }),
      id: "root",
      element: <root.default context={context} />,
      children: [
        {
          path: "",
          element: <Link to="new">New component</Link>,
        },
        {
          path: "edit/:component",
          action: EditComponent.action({ context, storage }),
          element: <EditComponent.default />,
        },
        {
          path: "new",
          element: <NewComponent />,
        },
        {
          path: "new/:type",
          action: NewComponentType.action(context, storage),
          element: <NewComponentType.NewComponentType />,
        },
      ],
    },
  ];
}

export interface FormBuilderContext {
  plugins: Plugins;
}

export function formBuilder(
  context: { plugins: Plugins },
  storage: FormStorage
) {
  const router = createBrowserRouter(routes(context, storage));
  return <RouterProvider router={router} />;
}
