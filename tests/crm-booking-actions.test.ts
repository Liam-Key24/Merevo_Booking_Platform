import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("CRM booking approve / suggest wiring", () => {
  it("mounts BookingActionsPanel inside the booking detail panel", () => {
    const detail = readSrc("src/components/dashboard/booking-detail-panel.tsx");
    expect(detail).toContain(
      'from "@/components/dashboard/booking-actions-panel"',
    );
    expect(detail).toContain("<BookingActionsPanel");
    expect(detail).toContain('title="Decide"');
    expect(detail).toContain("suggested_date");
    expect(detail).toContain("suggested_time");
  });

  it("exposes approve and suggest actions from the actions panel", () => {
    const panel = readSrc("src/components/dashboard/booking-actions-panel.tsx");
    expect(panel).toContain("approveBooking");
    expect(panel).toContain("suggestBookingTime");
    expect(panel).toContain("Approve booking");
    expect(panel).toContain("Suggest another time");
    expect(panel).toContain("onChanged");
  });

  it("keeps decline and cancel on the actions panel only", () => {
    const detail = readSrc("src/components/dashboard/booking-detail-panel.tsx");
    expect(detail).not.toContain("declineBooking");
    expect(detail).not.toContain("cancelBooking");

    const panel = readSrc("src/components/dashboard/booking-actions-panel.tsx");
    expect(panel).toContain("declineBooking");
    expect(panel).toContain("cancelBooking");
  });
});
