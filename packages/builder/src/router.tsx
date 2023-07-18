import React from "react";
import { RouteObject } from "react-router-dom";
import { FormStorage, Plugins } from ".";
import * as root from "./routes";
import * as EditComponent from "./routes/edit_$component";
import * as NewComponent from "./routes/new";
import * as DeleteComponent from "./routes/delete_$component";
import Overlay from "./components/Overlay";
import { Theme } from "@fab4m/fab4m";

export interface RouteArgs {
  plugins: Plugins;
  storage: FormStorage;
  themes: Theme[];
}

export type LoaderCreatorArgs = RouteArgs;
export type ActionCreatorArgs = LoaderCreatorArgs;

export function routes(args: RouteArgs): RouteObject[] {
  return [
    {
      path: "/",
      loader: root.loader(args),
      action: root.action(args),
      id: "root",
      element: <root.default plugins={args.plugins} themes={args.themes} />,
      children: [
        {
          path: "edit/:component",
          action: EditComponent.action(args),
          element: <EditComponent.default />,
        },
        {
          element: <Overlay />,
          children: [
            {
              path: "delete/:component",
              action: DeleteComponent.action(args),
              element: <DeleteComponent.default />,
            },
          ],
        },

        {
          element: <Overlay />,
          children: [
            {
              path: "new",
              action: NewComponent.action(args),
              element: <NewComponent.default />,
            },
          ],
        },
      ],
    },
  ];
}

export interface FormBuilderContext {
  plugins: Plugins;
}
