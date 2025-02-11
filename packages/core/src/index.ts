import { Theme } from "./theme";
import { basic, basicDark } from "./themes/basic";
export * from "./component";
export { default as FormView } from "./components/FormView";
export { default as StatefulFormView } from "./components/StatefulFormView";
export { default as FormComponentView } from "./components/FormComponentView";
export { default as FormComponentWrapper } from "./components/FormComponentWrapper";
export { default as FormPart } from "./components/FormPart";
export { default as FormWrapper } from "./components/FormWrapper";
export { default as FormPager } from "./components/FormPager";
export { default as Input } from "./components/Input";
export { default as FormElement } from "./components/FormElement";
export * from "./form";
export * from "./types/text";
export * from "./types/boolean";
export * from "./serializer";
export * from "./types/email";
export * from "./types/group";
export * from "./types/pagebreak";
export * from "./types/file";
export * from "./types/submit";
export * from "./schema";
export * from "./widget";
export * from "./theme";
export * from "./validator";
export * from "./validators/equals";
export * from "./validators/length";
export * from "./validators/values";
export * from "./validators/numbers";
export * from "./validators/exists";
export * from "./validators/callback";
export * from "./validators/unavailable";
export * from "./rules/or";
export * from "./rules/and";
export * from "./rules/not";
export * from "./rule";
export * from "./widgets/options";
export * from "./types/number";
export * from "./types/content";
export * from "./types/url";
export * from "./widgets/multiple";
export * from "./hooks";
export * from "./formview";
export * from "./formdata";
export * from "./widgets/hidden";
export * from "./widgets/custom";

let defaultTheme: Theme = basic;
export { defaultTheme, basic, basicDark };

export function setDefaultTheme(theme: Theme) {
  defaultTheme = theme;
}

export { default as bulma } from "./themes/bulma";
export { default as tailwind, createTailwindTheme } from "./themes/tailwind";
export type { TailwindSettings } from "./themes/tailwind";
