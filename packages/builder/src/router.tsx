import React from "react";
import { RouteObject } from "react-router-dom";
import { FormBuilderArgs, Plugins } from ".";
import * as root from "./routes";
import * as EditComponent from "./routes/edit_$component";
import * as NewComponent from "./routes/new";
import * as DeleteComponent from "./routes/delete_$component";
import * as SettingsComponent from "./routes/settings";
import Overlay from "./components/Overlay";
import { SerializedForm, Theme } from "@fab4m/fab4m";

export type LoaderCreatorArgs = FormBuilderArgs;
export type ActionCreatorArgs = LoaderCreatorArgs;

export function routes(args: FormBuilderArgs): RouteObject[] {
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
              path: "settings",
              action: SettingsComponent.action(args),
              element: <SettingsComponent.default />,
            },
          ],
        },
        {
          path: "new",
          action: NewComponent.action(args),
          element: <NewComponent.default />,
        },
      ],
    },
  ];
}

export interface FormBuilderContext {
  plugins: Plugins;
  themes: Theme[];
  form: SerializedForm;
}
