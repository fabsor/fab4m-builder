import {
  FormComponentType,
  Components,
  WidgetType,
  SerializedForm,
  SerializedComponent,
} from "@fab4m/fab4m";

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

export interface FormStorage {
  loadForm: () => Promise<SerializedForm>;
  addComponent: (newComponent: SerializedComponent) => Promise<void>;
  editComponent: (component: SerializedComponent) => Promise<void>;
  saveForm: (form: SerializedForm) => Promise<SerializedForm>;
}

export interface Plugins {
  types: FormComponentTypePlugin[];
  widgets: WidgetTypePlugin[];
}

export * from "./components/FormBuilder";
