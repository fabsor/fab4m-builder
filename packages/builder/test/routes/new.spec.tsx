import { render, screen, waitFor } from "@testing-library/react";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import { storageMock } from "../util";
import userEvent from "@testing-library/user-event";
import New, { action } from "../../src/routes/new";
import {
  Plugins,
  groupPlugin,
  integerFieldPlugin,
  pageBreakPlugin,
  pageBreakWidgetPlugin,
  textFieldPlugin,
  textFieldWidgetPlugin,
} from "../../src";
import { basic, createForm, group, serialize } from "@fab4m/fab4m";
const plugins: Plugins = {
  types: [textFieldPlugin, integerFieldPlugin, groupPlugin, pageBreakPlugin],
  widgets: [textFieldWidgetPlugin, pageBreakWidgetPlugin],
  validators: [],
};

const form = serialize(createForm({ group: group({}, []) }));

describe("New component library", () => {
  const actionFn = vi.fn().mockImplementation(() => null);
  const getRouter = () => {
    return createMemoryRouter(
      [
        {
          path: "*",
          element: (
            <div>
              <Outlet context={{ plugins, themes: [basic], form }} />
            </div>
          ),
          children: [
            {
              element: <New />,
              action: actionFn,
              index: true,
            },
          ],
        },
      ],
      {
        initialEntries: ["/?parent=group"],
        initialIndex: 0,
      },
    );
  };
  test("Component library", async () => {
    render(<RouterProvider router={getRouter()} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Text field" })).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Integer field" }),
      ).toBeTruthy();
    });
  });
  test("Add component", async () => {
    render(<RouterProvider router={getRouter()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Text field" }),
    );
    expect(actionFn).toBeCalled();
    const formData = await actionFn.mock.lastCall[0].request.formData();
    expect(formData.get("type").toString()).toBe("text");
    expect(formData.get("parent").toString()).toBe("group");
  });
});

describe("Action function", () => {
  test("Add item", async () => {
    const saveForm = vi.fn();
    const actionFn = action({
      plugins,
      storage: storageMock({ loadForm: async () => form, saveForm }),
      themes: [basic],
    });
    const data = new FormData();
    data.append("type", "text");
    const result = await actionFn({
      params: {},
      request: new Request("http://localhost", { method: "POST", body: data }),
    });
    expect(saveForm).toBeCalled();
    expect(saveForm.mock.lastCall[0].components[1].type).toBe("text");
    expect(result.headers.get("location")).toBe("../edit/root:component__1");
  });
  test("Add item to group", async () => {
    const actionFn = action({
      plugins,
      storage: storageMock({ loadForm: async () => form }),
      themes: [basic],
    });
    const data = new FormData();
    data.append("type", "text");
    data.append("parent", "group");
    const result = await actionFn({
      params: {},
      request: new Request("http://localhost", { method: "POST", body: data }),
    });
    expect(result.headers.get("location")).toBe("../edit/group:component__0");
  });
  test("Add page break to group", async () => {
    const actionFn = action({
      plugins,
      storage: storageMock({ loadForm: async () => form }),
      themes: [basic],
    });
    const data = new FormData();
    data.append("type", "pagebreak");
    const result = await actionFn({
      params: {},
      request: new Request("http://localhost", { method: "POST", body: data }),
    });
    expect(result.headers.get("location")).toBe("..");
  });
});
