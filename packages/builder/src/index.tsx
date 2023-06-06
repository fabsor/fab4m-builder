import React from "react";
import {
  FormComponentType,
  Components,
  WidgetType,
  SerializedForm,
  SerializedComponent,
  ValidatorType,
  FormComponent,
} from "@fab4m/fab4m";
import { createBrowserRouter } from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { routes } from "./router";

export interface Plugin<SettingsType, SettingsFormData> {
  icon?: React.ReactNode;
  editForm?: () => Components<SettingsFormData>;
  settingsFromForm?: (data: SettingsFormData) => SettingsType;
  formData?: (settings: SettingsType) => SettingsFormData;
}

export interface FormComponentTypePlugin<
  SettingsType = unknown,
  SettingsFormData = Record<string, unknown>
> extends Plugin<SettingsType, SettingsFormData> {
  type: FormComponentType<SettingsType>;
  init: (name: string) => FormComponent;
}

export interface WidgetTypePlugin<
  SettingsType = unknown,
  SettingsFormData = Record<string, unknown>
> extends Plugin<SettingsType, SettingsFormData> {
  type: WidgetType;
}

export interface ValidatorTypePlugin<
  SettingsType = unknown,
  SettingsFormData = Record<string, unknown>
> extends Plugin<SettingsType, SettingsFormData> {
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
