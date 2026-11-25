import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("manual / walk-in booking without service", () => {
  it("allows createManualBooking with a null service_id", () => {
    const actions = readSrc("src/lib/dashboard/booking-actions.ts");
    expect(actions).toContain("service?.id ?? null");
    expect(actions).toContain('"Walk-in booking"');
    expect(actions).not.toContain('message: "Select a service."');
  });

  it("keeps the manual form usable when no services exist", () => {
    const form = readSrc("src/components/dashboard/manual-booking-form.tsx");
    expect(form).not.toContain(
      "Add an active service before creating a manual booking.",
    );
    expect(form).toContain("Walk-in / no service");
    expect(form).toContain("Walk-in booking — no service catalogue");
  });
});
