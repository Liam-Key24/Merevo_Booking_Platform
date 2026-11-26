import Link from "next/link";
import { Button, Card, EmptyState } from "@/components/ui";
import {
  WEEKDAY_LABELS,
  WEEKDAYS,
  defaultWeeklyHours,
  parseWeeklyHours,
} from "@/lib/dashboard/hospitality-settings";
import { requireAppointmentsContext } from "@/lib/dashboard/require-appointments";
import { createClient } from "@/lib/supabase/server";

export default async function AvailabilityPage() {
  const context = await requireAppointmentsContext("availability");
  const supabase = await createClient();
  const { data: settings, error } = await supabase
    .from("booking_settings")
    .select("opening_hours, holidays, external_booking_url")
    .eq("business_id", context.business.id)
    .maybeSingle();

  const hours =
    settings?.opening_hours &&
    typeof settings.opening_hours === "object" &&
    Object.keys(settings.opening_hours as object).length > 0
      ? parseWeeklyHours(settings.opening_hours)
      : defaultWeeklyHours();

  const canEdit = context.role === "owner" || context.isMerevoAdmin;

  return (
    <main className="flex flex-1 flex-col gap-8 px-[var(--merevo-space-page)] py-8 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-merevo-text">
            Availability
          </h2>
          <p className="max-w-2xl text-merevo-text-muted">
            Opening hours for {context.business.name}.
          </p>
        </div>
        {canEdit ? (
          <Link href="/dashboard/settings">
            <Button type="button">Edit in settings</Button>
          </Link>
        ) : null}
      </header>

      <Card title="Weekly availability">
        {error ? (
          <EmptyState
            title="Could not load availability"
            description="Please try again."
          />
        ) : (
          <ul className="divide-y divide-merevo-border">
            {WEEKDAYS.map((day) => {
              const dayHours = hours[day];
              return (
                <li
                  key={day}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="font-medium text-merevo-text">
                    {WEEKDAY_LABELS[day]}
                  </span>
                  <span className="text-merevo-text-muted">
                    {!dayHours || dayHours.closed
                      ? "Closed"
                      : `${dayHours.open}–${dayHours.close}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="External booking system">
        {settings?.external_booking_url ? (
          <a
            href={settings.external_booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm font-semibold text-merevo-accent hover:underline"
          >
            {settings.external_booking_url}
          </a>
        ) : (
          <EmptyState
            title="No external booking link"
            description="Optional. Add one in settings if you also use another booking system."
            action={
              canEdit ? (
                <Link href="/dashboard/settings">
                  <Button type="button" variant="secondary">
                    Open settings
                  </Button>
                </Link>
              ) : undefined
            }
          />
        )}
      </Card>
    </main>
  );
}
