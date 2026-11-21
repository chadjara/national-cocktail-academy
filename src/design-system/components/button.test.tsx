import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { IconButton } from "./icon-button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Start review</Button>);
    expect(screen.getByRole("button", { name: "Start review" })).toHaveAttribute("type", "button");
  });

  it("renders a link with button styling via asChild", () => {
    render(
      <Button asChild>
        <a href="/learn">Continue lesson</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Continue lesson" });
    expect(link.className).toContain("bg-accent");
  });

  it("gives icon-only buttons an accessible name", () => {
    render(<IconButton label="Save to favorites" icon={<svg aria-hidden />} />);
    expect(screen.getByRole("button", { name: "Save to favorites" })).toBeInTheDocument();
  });
});
