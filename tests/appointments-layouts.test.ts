import { describe, expect, it } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  AVAILABLE_TEMPLATE_LAYOUT_SLUGS,
  TEMPLATE_LAYOUTS,
} from "@/lib/templates/layouts";
import { enrichTemplateForAdmin } from "@/lib/templates/catalog";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("appointment template layouts", () => {
  it("registers classic, minimal, and studio appointment layouts", () => {
    expect(AVAILABLE_TEMPLATE_LAYOUT_SLUGS.has("appointments-classic")).toBe(
      true,
    );
    expect(AVAILABLE_TEMPLATE_LAYOUT_SLUGS.has("appointments-minimal")).toBe(
      true,
    );
    expect(AVAILABLE_TEMPLATE_LAYOUT_SLUGS.has("appointments-studio")).toBe(
      true,
    );
    expect(TEMPLATE_LAYOUTS["appointments-classic"]).toBeTruthy();
    expect(
      existsSync(
        join(
          process.cwd(),
          "src/components/client-site/layouts/appointments-classic.tsx",
        ),
      ),
    ).toBe(true);
  });

  it("marks appointment templates as layout-available for admin", () => {
    const classic = enrichTemplateForAdmin({
      id: "a",
      name: "Appointments Classic",
      slug: "appointments-classic",
      status: "active",
      description: null,
      allowed_sections: ["hero", "services", "booking_widget", "contact"],
      dashboard_mode: "appointments",
    });
    expect(classic.layoutAvailable).toBe(true);
  });

  it("includes a migration that activates appointment templates", () => {
    const dir = join(process.cwd(), "supabase/migrations");
    const match = readdirSync(dir).find((name) =>
      name.includes("activate_appointments_templates"),
    );
    expect(match).toBeTruthy();
    const sql = readSrc(`supabase/migrations/${match}`);
    expect(sql).toContain("appointments-classic");
    expect(sql).toContain("appointments-minimal");
    expect(sql).toContain("appointments-studio");
    expect(sql).toContain("status = 'active'");
  });
});
