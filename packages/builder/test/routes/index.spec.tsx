import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { storageMock } from "../util";
import { describe, expect, test, vi } from "vitest";
import FormBuilder, {
  LoaderData,
  action,
  loader,
} from "../../src/routes/index";
import {
  FormStorage,
  Plugins,
  textFieldPlugin,
  textFieldWidgetPlugin,
} from "../../src";
import {
  FormDefinition,
  basic,
  createForm,
  serialize,
  textField,
} from "@fab4m/fab4m";

const plugins: Plugins = {
  types: [textFieldPlugin],
  widgets: [textFieldWidgetPlugin],
  validators: [],
};

describe("Form builder component", () => {
  const getRouter = (data: {
    message?: LoaderData["message"];
    form?: FormDefinition;
  }) => {
    return createMemoryRouter([
      {
        path: "*",
        element: <FormBuilder plugins={plugins} themes={[basic]} />,
        loader: () => ({
          message: data.message ?? null,
          form: data.form ? serialize(data.form) : serialize(createForm({})),
        }),
      },
    ]);
  };
  test("Flash message", async () => {
    render(
      <RouterProvider
        router={getRouter({
          message: {
            type: "error",
            description: "Message description",
            title: "Flash message",
          },
        })}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByText("Flash message")).toBeTruthy();
    });
  });
  test("Form preview", async () => {
    const router = getRouter({
      form: createForm({
        text: textField({ label: "A label" }),
      }),
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByLabelText("A label")).toBeTruthy();
      expect(screen.queryByLabelText("Submit")).toBeFalsy();
    });
  });

  test("Settings", async () => {
    const router = getRouter({});
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(
        screen
          .getByRole("link", { name: "Form settings" })
          .getAttribute("href"),
      ).toBe("/settings");
    });
  });

  test("Form elements", async () => {
    const router = getRouter({
      form: createForm({
        first: textField({ label: "First" }),
        second: textField({ label: "Second element" }),
        third: textField({ label: "Third" }),
      }),
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "First" })).toBeTruthy();
      expect(
        screen.queryByRole("heading", { name: "Second element" }),
      ).toBeTruthy();
      expect(screen.queryByRole("heading", { name: "Third" })).toBeTruthy();
    });
  });
});

describe("Form builder action", () => {
  const form = serialize(
    createForm({
      first: textField({ label: "First" }),
      second: textField({ label: "Second" }),
    }),
  );
  const saveForm = vi.fn();
  const fakeStorage = storageMock({
    loadForm: async () => form,
    saveForm: saveForm,
  });
  const actionFn = action({ storage: fakeStorage, plugins, themes: [basic] });
  test("Move item", async () => {
    const formData = new FormData();
    formData.append("from", "root:first");
    formData.append("to", "root:second");
    await actionFn({
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
    });
    expect(saveForm.mock.lastCall[0].components[0].label).toBe("Second");
    expect(saveForm.mock.lastCall[0].components[1].label).toBe("First");
  });
});

describe("loader function", () => {
  const form = serialize(createForm({}));
  const fakeStorage: FormStorage = {
    loadForm: async () => form,
    addComponent: vi.fn(),
    editComponent: vi.fn(),
    saveForm: vi.fn(),
    getFlashMessage: async () => ({
      description: "description",
      title: "title",
      type: "error",
    }),
    flash: vi.fn(),
  };
  test("Loader function data", async () => {
    const loaderFn = loader({ storage: fakeStorage, plugins, themes: [basic] });
    const result = await loaderFn({
      params: {},
      request: new Request("http://localhost/"),
    });
    expect(result.form).toBe(form);
    expect(result.message.description).toBe("description");
  });
});
