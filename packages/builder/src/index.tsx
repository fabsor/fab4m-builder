import React from "react";
import {
  FormComponentType,
  Components,
  WidgetType,
  SerializedForm,
  SerializedComponent,
  ValidatorType,
} from "@fab4m/fab4m";
import { createBrowserRouter } from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { routes } from "./router";

export interface Plugin<SettingsType> {
  editForm?: Components<SettingsType>;
  settingsFromForm?: (data: Record<string, unknown>) => SettingsType;
}

export interface FormComponentTypePlugin<SettingsType = never>
  extends Plugin<SettingsType> {
  type: FormComponentType;
}

export interface WidgetTypePlugin<SettingsType = never>
  extends Plugin<SettingsType> {
  type: WidgetType;
}

export interface ValidatorTypePlugin<SettingsType = never>
  extends Plugin<SettingsType> {
  type: ValidatorType;
}

export interface FormStorage {
  loadForm: () => Promise<SerializedForm>;
  addComponent: (newComponent: SerializedComponent) => Promise<void>;
  editComponent: (component: SerializedComponent) => Promise<void>;
  saveForm: (form: SerializedForm) => Promise<SerializedForm>;
}

export interface Plugins {
  types: FormComponentTypePlugin[];
  widgets: WidgetTypePlugin[];
  validators: ValidatorTypePlugin[];
}

export function formBuilder(plugins: Plugins, storage: FormStorage) {
  const router = createBrowserRouter(routes({ plugins, storage }));
  return <FormBuilder router={router} />;
}

export * from "./components/FormBuilder";
