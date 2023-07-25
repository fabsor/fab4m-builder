import { ReactNode } from "react";

let icons: Record<string, ReactNode> = {};

export function setIcons(iconSet: Record<string, ReactNode>) {
  icons = iconSet;
}

export { icons };
