import invariant from "tiny-invariant";
import { Plugin } from ".";
export function findPlugin<
  PluginType extends Plugin<unknown> & { type: { name: string } }
>(typeName: string, plugins: Array<PluginType>): PluginType {
  const pluginType = plugins.find((plugin) => plugin.type.name === typeName);
  invariant(pluginType);
  return pluginType;
}
