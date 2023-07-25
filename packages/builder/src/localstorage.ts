import { SerializedForm } from "@fab4m/fab4m";
import { FlashMessage, FormStorage } from ".";
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
  const getFlashMessage = async (reset = true) => {
    const stored = sessionStorage.getItem(`${key}_flash`);
    const flash = stored ? JSON.parse(stored) : null;
    if (reset) {
      sessionStorage.removeItem(`${key}_flash`);
    }
    return flash;
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
    editComponent: async (key, component) => {
      invariant(form);
      const updatedForm = updateComponent(form, key, component);
      await saveForm(updatedForm);
    },
    getFlashMessage,
    flash: async (message: FlashMessage) => {
      sessionStorage.setItem(`${key}_flash`, JSON.stringify(message));
    },
    saveForm,
  };
}
