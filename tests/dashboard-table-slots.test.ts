import { describe, expect, it } from "vitest";
import {
  buildTableLabels,
  buildTimeSlots,
  defaultWeeklyHours,
  timeSlotsForDate,
} from "@/lib/dashboard/hospitality-settings";

describe("table labels from settings", () => {
  it("expands seat counts and custom tables", () => {
    expect(
      buildTableLabels({
        tables2Seat: 2,
        tables4Seat: 1,
        tables6Seat: 0,
        customTables: [{ label: "Booth A", seats: 8 }],
      }),
    ).toEqual(["2-seat 1", "2-seat 2", "4-seat 1", "Booth A"]);
  });
});

describe("time slots from opening hours", () => {
  it("builds slots between open and close", () => {
    expect(buildTimeSlots("09:00", "10:00", 30)).toEqual([
      "09:00",
      "09:30",
    ]);
  });

  it("returns no slots on closed days", () => {
    const hours = defaultWeeklyHours();
    hours.sunday = { open: "09:00", close: "17:00", closed: true };
    // 2026-11-29 is a Sunday
    expect(timeSlotsForDate(hours, "2026-11-29", 30)).toEqual([]);
  });
});
