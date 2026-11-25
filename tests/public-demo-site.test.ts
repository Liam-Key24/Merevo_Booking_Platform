import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  getDemoAppointmentsPayload,
  getDemoRestaurantPayload,
} from "@/lib/demo/payloads";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("public demo site", () => {
  it("exposes /demo hub plus restaurant and appointments routes", () => {
    expect(existsSync(join(process.cwd(), "src/app/demo/page.tsx"))).toBe(true);
    expect(
      existsSync(join(process.cwd(), "src/app/demo/restaurant/page.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(process.cwd(), "src/app/demo/appointments/page.tsx")),
    ).toBe(true);
  });

  it("builds in-memory demo payloads without Supabase", () => {
    const restaurant = getDemoRestaurantPayload();
    expect(restaurant.business.slug).toBe("demo-restaurant");
    expect(restaurant.template.slug).toBe("hospitality-classic");

    const appointments = getDemoAppointmentsPayload();
    expect(appointments.business.slug).toBe("demo-appointments");
    expect(appointments.booking.services.length).toBeGreaterThan(0);
  });

  it("uses a dry-run booking action that never writes CRM rows", () => {
    const actions = readSrc("src/lib/demo/actions.ts");
    expect(actions).toContain("submitDemoBookingRequest");
    expect(actions).toContain("Never writes to Supabase");
    expect(actions).not.toContain(".from(\"bookings\")");
  });

  it("threads demoMode through the booking widget and layouts", () => {
    const widget = readSrc("src/components/booking/booking-widget.tsx");
    expect(widget).toContain("demoMode");

    const hospitality = readSrc(
      "src/components/client-site/layouts/hospitality-classic.tsx",
    );
    expect(hospitality).toMatch(/Demo/);
    expect(hospitality).toContain("demoMode={demo}");
  });
});
