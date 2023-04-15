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
  editForm?: Components<unknown>;
  settingsFromForm?: (data: Record<string, unknown>) => SettingsType;
  formData?: (settings: SettingsType) => Record<string, unknown>;
}

export interface FormComponentTypePlugin<SettingsType = unknown>
  extends Plugin<SettingsType> {
  type: FormComponentType;
}

export interface WidgetTypePlugin<SettingsType = unknown>
  extends Plugin<SettingsType> {
  type: WidgetType;
}

export interface ValidatorTypePlugin<SettingsType = unknown>
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
