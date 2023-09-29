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
import { ActionFunctionArgs, createBrowserRouter, LoaderFunctionArgs } from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { routes } from "./router";
export * from "./types";
export * from "./widgets";
export * from "./validators";

export { localFormStorage } from "./localstorage";
export { defaultIcons } from "./defaultIcons";
export * from "./util";

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
  loadForm: (context: LoaderFunctionArgs) => Promise<SerializedForm>;
  addComponent: (newComponent: SerializedComponent, context: ActionFunctionArgs) => Promise<void>;
  editComponent: (key: string, component: SerializedComponent, context: ActionFunctionArgs) => Promise<void>;
  saveForm: (form: SerializedForm, context: ActionFunctionArgs) => Promise<SerializedForm>;
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

export { routes };

export * from "./components/FormBuilder";
export * from "./translations";
