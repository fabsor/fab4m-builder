import React from "react";
import { RouterProvider, RouterProviderProps } from "react-router-dom";

export function FormBuilder(props: { router: RouterProviderProps["router"] }) {
  return <RouterProvider router={props.router} />;
}
