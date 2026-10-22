/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";
import { ColorCirclePicker } from "@/components/admin/color-circle-picker";

function Harness({ initial }: { initial: string }) {
  const [defaultValue, setDefaultValue] = useState(initial);
  return (
    <div>
      <ColorCirclePicker
        label="Primary"
        name="primary_colour"
        defaultValue={defaultValue}
      />
      <button type="button" onClick={() => setDefaultValue("#00ff00")}>
        Change default
      </button>
    </div>
  );
}

describe("ColorCirclePicker", () => {
  afterEach(() => {
    cleanup();
  });

  it("updates the colour input when the default colour changes", async () => {
    const { rerender } = render(
      <ColorCirclePicker
        label="Accent"
        name="accent_colour"
        defaultValue="#112233"
      />,
    );

    const input = screen.getByLabelText("Accent") as HTMLInputElement;
    expect(input.value).toBe("#112233");

    rerender(
      <ColorCirclePicker
        label="Accent"
        name="accent_colour"
        defaultValue="#abcdef"
      />,
    );

    expect((screen.getByLabelText("Accent") as HTMLInputElement).value).toBe(
      "#abcdef",
    );
  });

  it("keeps in sync when a parent state default changes", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(<Harness initial="#ff0000" />);

    expect(
      (screen.getByLabelText("Primary") as HTMLInputElement).value,
    ).toBe("#ff0000");

    await user.click(screen.getByRole("button", { name: "Change default" }));

    expect(
      (screen.getByLabelText("Primary") as HTMLInputElement).value,
    ).toBe("#00ff00");
  });
});
