import React from "react";
import {
  FormComponentType,
  Components,
  WidgetType,
  SerializedForm,
  SerializedComponent,
  ValidatorType,
  FormComponent,
  Theme,
} from "@fab4m/fab4m";
import { createBrowserRouter } from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { routes } from "./router";

export interface Plugin<SettingsType, SettingsFormData> {
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

export interface FlashMessage {
  title: string;
  description: string;
  type: "success" | "error";
}

export interface FormStorage {
  loadForm: () => Promise<SerializedForm>;
  addComponent: (newComponent: SerializedComponent) => Promise<void>;
  editComponent: (key: string, component: SerializedComponent) => Promise<void>;
  saveForm: (form: SerializedForm) => Promise<SerializedForm>;
  getFlashMessage: (reset: boolean) => Promise<FlashMessage | null>;
  flash: (message: FlashMessage) => Promise<void>;
}

export interface Plugins {
  types: FormComponentTypePlugin[];
  widgets: WidgetTypePlugin[];
  validators: ValidatorTypePlugin[];
}

export interface FormBuilderArgs {
  plugins: Plugins;
  themes: Theme[];
  storage: FormStorage;
}

export function formBuilder(args: FormBuilderArgs) {
  const router = createBrowserRouter(routes(args));
  return <FormBuilder router={router} />;
}

export * from "./components/FormBuilder";
export * from "./translations";
