import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field, Input } from "./field";

describe("Field", () => {
  it("labels its control and links the hint", () => {
    render(
      <Field label="Name on certificate" hint="Exactly as employers will read it.">
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Name on certificate" });
    expect(input).toHaveAccessibleDescription("Exactly as employers will read it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the control invalid and announces the error", () => {
    render(
      <Field label="Pour cost target" error="Enter a percentage between 10 and 40.">
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Pour cost target" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a percentage between 10 and 40.");
  });
});
