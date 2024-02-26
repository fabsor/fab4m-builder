import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashMessage } from "../src";
import { describe, expect, test } from "vitest";
import ToastMessage from "../src/components/Toasts";

describe("Toasts", () => {
  const toast: FlashMessage = {
    title: "My toast",
    description: "Toast description",
    type: "error",
  };
  test("show message", () => {
    render(<ToastMessage toast={toast} />);
    expect(screen.getByText("My toast")).toBeTruthy();
  });

  test("close message", async () => {
    render(<ToastMessage toast={toast} />);
    expect(screen.getByText("My toast")).toBeTruthy();
    userEvent.click(screen.getByLabelText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("My toast")).toBeNull();
    });
  });
});
