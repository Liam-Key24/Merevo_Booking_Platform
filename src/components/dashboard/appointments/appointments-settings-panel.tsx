"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Input, Select } from "@/components/ui";
import {
  updateBusinessSettings,
  type SettingsActionState,
} from "@/lib/dashboard/settings-actions";
import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  type WeeklyHours,
} from "@/lib/dashboard/hospitality-settings";
import type { BookingMode } from "@/types/database";

type AppointmentsSettingsPanelProps = {
  businessId: string;
  businessName: string;
  notificationEmail: string | null;
  contactPhone: string | null;
  timezone: string | null;
  bookingMode: BookingMode | string | null;
  externalBookingUrl: string | null;
  openingHours: WeeklyHours;
  bookingSlotMinutes: number;
  canEdit: boolean;
};

const initialState: SettingsActionState = {
  status: "idle",
  message: null,
};

export function AppointmentsSettingsPanel({
  businessId,
  businessName,
  notificationEmail,
  contactPhone,
  timezone,
  bookingMode,
  externalBookingUrl,
  openingHours,
  bookingSlotMinutes,
  canEdit,
}: AppointmentsSettingsPanelProps) {
  const [state, formAction, pending] = useActionState(
    updateBusinessSettings,
    initialState,
  );

  return (
    <div className="space-y-6">
      {!canEdit ? (
        <p className="rounded-merevo-sm border border-merevo-border bg-merevo-surface-muted px-4 py-3 text-sm text-merevo-text-muted">
          View only — ask a business owner to change these settings.
        </p>
      ) : null}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="businessId" value={businessId} />
        {/* Keep hospitality-only fields valid when the shared action runs. */}
        <input type="hidden" name="tables2Seat" value="0" />
        <input type="hidden" name="tables4Seat" value="0" />
        <input type="hidden" name="tables6Seat" value="0" />
        <input type="hidden" name="maxBookingsPerDay" value="" />
        <input type="hidden" name="maxPartySize" value="" />
        <input
          type="hidden"
          name="bookingSlotMinutes"
          value={String(bookingSlotMinutes || 15)}
        />

        <Card title="Business contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Business name"
                name="name"
                defaultValue={businessName}
                required
                disabled={!canEdit}
              />
            </div>
            <Input
              label="Notification email"
              name="notificationEmail"
              type="email"
              defaultValue={notificationEmail ?? ""}
              required
              disabled={!canEdit}
            />
            <Input
              label="Phone"
              name="contactPhone"
              type="tel"
              defaultValue={contactPhone ?? ""}
              disabled={!canEdit}
            />
            <Input
              label="Timezone"
              name="timezone"
              defaultValue={timezone ?? "Europe/London"}
              required
              disabled={!canEdit}
              hint="IANA timezone, e.g. Europe/London"
            />
          </div>
        </Card>

        <Card title="Booking mode">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Mode"
              name="bookingMode"
              defaultValue={(bookingMode as string) ?? "meridian"}
              disabled={!canEdit}
              options={[
                { value: "meridian", label: "Merevo" },
                { value: "external", label: "External" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
            <Input
              label="External booking URL"
              name="externalBookingUrl"
              defaultValue={externalBookingUrl ?? ""}
              disabled={!canEdit}
              placeholder="https://…"
            />
          </div>
        </Card>

        <Card
          title="Weekly availability"
          description="Used when staff add appointments and when guests pick a time."
        >
          <ul className="space-y-3">
            {WEEKDAYS.map((day) => {
              const hours = openingHours[day];
              return (
                <li
                  key={day}
                  className="grid gap-2 rounded-merevo-sm border border-merevo-border px-3 py-3 sm:grid-cols-[8rem_auto_1fr_1fr]"
                >
                  <span className="text-sm font-medium text-merevo-text">
                    {WEEKDAY_LABELS[day]}
                  </span>
                  <label className="inline-flex items-center gap-2 text-sm text-merevo-text-muted">
                    <input
                      type="checkbox"
                      name={`opening.${day}.closed`}
                      defaultChecked={Boolean(hours?.closed)}
                      disabled={!canEdit}
                    />
                    Closed
                  </label>
                  <Input
                    label="Open"
                    name={`opening.${day}.open`}
                    defaultValue={hours?.open ?? "09:00"}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Close"
                    name={`opening.${day}.close`}
                    defaultValue={hours?.close ?? "17:00"}
                    disabled={!canEdit}
                  />
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-merevo-text-muted">
            Services and staff members are set up with Merevo. Day-to-day you
            manage bookings and these hours.
          </p>
          <Link
            href="/dashboard/availability"
            className="mt-3 inline-block text-sm font-semibold text-merevo-accent hover:underline"
          >
            View availability summary
          </Link>
        </Card>

        {state.message ? (
          <p
            className={
              state.status === "error"
                ? "text-sm text-merevo-status-declined"
                : "text-sm text-merevo-teal"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        {canEdit ? (
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save settings"}
          </Button>
        ) : null}
      </form>
    </div>
  );
}
