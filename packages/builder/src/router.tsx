import React from "react";
import { Link, RouteObject } from "react-router-dom";
import { FormStorage, Plugins } from ".";
import * as root from "./routes";
import * as EditComponent from "./routes/edit_$component";
import * as NewComponentType from "./routes/new_$type";
import NewComponent from "./routes/new";
import * as NewValidator from "./routes/edit_$component_new_validator";

export interface RouteArgs {
  plugins: Plugins;
  storage: FormStorage;
}

export type LoaderCreatorArgs = RouteArgs;
export type ActionCreatorArgs = LoaderCreatorArgs;

export function routes(args: RouteArgs): RouteObject[] {
  return [
    {
      path: "/",
      loader: root.loader(args),
      id: "root",
      element: <root.default plugins={args.plugins} />,
      children: [
        {
          path: "",
          element: <Link to="new">New component</Link>,
        },
        {
          path: "edit/:component",
          action: EditComponent.action(args),
          element: <EditComponent.default />,
          children: [
            {
              index: true,
              action: NewValidator.action(args),
              element: <NewValidator.default />,
            },
          ],
        },
        {
          path: "new",
          element: <NewComponent />,
        },
        {
          path: "new/:type",
          action: NewComponentType.action(args),
          element: <NewComponentType.NewComponentType />,
        },
      ],
    },
  ];
}

export interface FormBuilderContext {
  plugins: Plugins;
}
