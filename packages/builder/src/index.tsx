import { FormComponentType, Components, WidgetType } from "@fab4m/fab4m";

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

export interface Plugins {
  types: FormComponentTypePlugin[];
  widgets: WidgetTypePlugin[];
}

export * from "./components/FormBuilder";
