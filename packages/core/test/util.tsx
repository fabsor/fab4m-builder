import * as React from "react";
import { basic, FormComponentView, FormComponent } from "../src";
import { render, cleanup } from "@testing-library/react";
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const changeData = () => {
  // No-op.
};

export function inputElementOk(component: FormComponent, name = ""): void {
  test(`${name} standard element properties`, () => {
    if (!component.title) {
      return;
    }
    const { queryByLabelText } = render(
      <FormComponentView
        name={component.name ?? ""}
        onChange={changeData}
        component={component}
        theme={basic}
      />,
    );
    const input = queryByLabelText(component.title) as FormElement;

    expect(input).not.toBe(null);
    if (input) {
      expect(input.id).toBe(component.name);
      expect(input.name).toBe(component.name);
    }
    cleanup();
  });
  test(`${name} Custom element id`, async () => {
    if (!component.title) {
      return;
    }

    const { findByLabelText } = render(
      <FormComponentView
        name={component.name ?? ""}
        onChange={changeData}
        component={component}
        theme={basic}
        id="custom-id"
      />,
    );
    expect((await findByLabelText(component.title)).id).toBe("custom-id");
    cleanup();
  });
  test(`${name} Custom element name`, async () => {
    if (!component.title) {
      return;
    }
    const { findByLabelText } = render(
      <FormComponentView
        onChange={changeData}
        component={component}
        theme={basic}
        name="custom-name"
      />,
    );
    const customNameElement = (await findByLabelText(
      component.title,
    )) as FormElement;
    expect(customNameElement.name).toBe("custom-name");
    cleanup();
  });

  test(`${name} Hidden element label`, () => {
    if (!component.title) {
      return;
    }

    const { queryByLabelText } = render(
      <FormComponentView
        name={component.name ?? ""}
        onChange={changeData}
        component={component}
        theme={basic}
        hideLabel={true}
      />,
    );
    expect(queryByLabelText(component.title)).toBe(null);
    cleanup();
  });
  test("Disabled", async () => {
    if (!component.title) {
      return;
    }
    const disabled = { ...component, disabled: true };
    const { findByLabelText } = render(
      <FormComponentView
        onChange={changeData}
        name="choice"
        theme={basic}
        component={disabled}
      />,
    );
    expect(
      ((await findByLabelText(component.title)) as HTMLInputElement).disabled,
    ).toBe(true);
    cleanup();
  });
}

export function getFormElement(container: Element): HTMLFormElement {
  const form = container.querySelector("form");
  if (!form) {
    throw new Error("Could not find form");
  }
  return form;
}
