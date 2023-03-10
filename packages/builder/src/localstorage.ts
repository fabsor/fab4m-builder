import { SerializedForm } from "@fab4m/fab4m";
import { FormStorage } from ".";
import { updateComponent } from "./util";
import invariant from "tiny-invariant";

export function localFormStorage(
  key: string,
  initialForm: SerializedForm
): FormStorage {
  let form: SerializedForm = initialForm;
  const saveForm = async (updatedForm: SerializedForm) => {
    localStorage.setItem(key, JSON.stringify(updatedForm));
    form = updatedForm;
    return form;
  };
  return {
    loadForm: async () => {
      const content = localStorage.getItem(key);
      if (!content) {
        form = initialForm;
      } else {
        form = JSON.parse(content) as SerializedForm;
      }
      return form;
    },
    addComponent: async (component) => {
      invariant(form);
      form.components.push(component);
      await saveForm(form);
    },
    editComponent: async (component) => {
      invariant(form);
      const updatedForm = updateComponent(form, component);
      console.log(component);
      await saveForm(updatedForm);
    },
    saveForm,
  };
}
