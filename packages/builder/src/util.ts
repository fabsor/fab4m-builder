import { SerializedComponent, SerializedForm } from "@fab4m/fab4m";
import invariant from "tiny-invariant";
import { Plugin, WidgetTypePlugin } from ".";
import { produce } from "immer";

export function invariantReturn<Type>(data: Type | undefined | null): Type {
  invariant(data);
  return data;
}

export function findPlugin<
  PluginType extends Plugin<unknown> & { type: { name: string } }
>(typeName: string, plugins: Array<PluginType>): PluginType {
  const pluginType = plugins.find((plugin) => plugin.type.name === typeName);
  return invariantReturn(pluginType);
}

export function findComponent(
  form: SerializedForm,
  name: string
): SerializedComponent {
  const component = form.components.find((c) => c.name === name);
  return invariantReturn(component);
}

export function findComponentWidgets(
  type: string,
  widgets: WidgetTypePlugin[]
) {
  return widgets.filter(
    (widget) => widget.type.components.indexOf(type) !== -1
  );
}

export function updateComponent(
  form: SerializedForm,
  component: SerializedComponent
): SerializedForm {
  return produce(form, (draft) => {
    const index = draft.components.findIndex((c) => c.name === component.name);
    if (index !== -1) {
      draft.components[index] = component;
    }
  });
}
