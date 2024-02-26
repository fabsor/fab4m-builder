import { FormStorage } from "../src";
import { vi } from "vitest";
export function storageMock(storage: Partial<FormStorage>): FormStorage {
  return {
    loadForm: vi.fn(),
    addComponent: vi.fn(),
    editComponent: vi.fn(),
    saveForm: vi.fn(),
    getFlashMessage: vi.fn(),
    flash: vi.fn(),
    ...storage,
  };
}
