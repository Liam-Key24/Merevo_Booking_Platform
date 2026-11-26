import Link from "next/link";
import { Button, ErrorState } from "@/components/ui";
import { BookingCalendar } from "@/components/dashboard/booking-calendar";
import {
  calendarRange,
  calendarRangeLabel,
  parseCalendarQuery,
  todayLocalIso,
} from "@/lib/dashboard/calendar";
import { listBookingsForBusiness } from "@/lib/dashboard/bookings";
import {
  buildTableLabels,
  defaultWeeklyHours,
  parseCustomTables,
  parseWeeklyHours,
  timeSlotsForDate,
  weekdayFromIsoDate,
} from "@/lib/dashboard/hospitality-settings";
import { requireDashboardCapability } from "@/lib/dashboard/require-context";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{ view?: string; date?: string }>;
};

export default async function DashboardCalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const context = await requireDashboardCapability("calendar");

  const query = parseCalendarQuery(params);
  const range = calendarRange(query);
  const supabase = await createClient();
  const [{ data: bookings, error }, { data: settings }] = await Promise.all([
    listBookingsForBusiness(context.business.id, {
      status: "confirmed",
      from: range.from,
      to: range.to,
    }),
    supabase
      .from("booking_settings")
      .select(
        "tables_2_seat, tables_4_seat, tables_6_seat, custom_tables, opening_hours, booking_slot_minutes",
      )
      .eq("business_id", context.business.id)
      .maybeSingle(),
  ]);
  const todayIso = todayLocalIso();
  const tableOptions = buildTableLabels({
    tables2Seat: settings?.tables_2_seat,
    tables4Seat: settings?.tables_4_seat,
    tables6Seat: settings?.tables_6_seat,
    customTables: parseCustomTables(settings?.custom_tables),
  });
  const openingHours =
    settings?.opening_hours &&
    typeof settings.opening_hours === "object" &&
    Object.keys(settings.opening_hours as object).length > 0
      ? parseWeeklyHours(settings.opening_hours)
      : defaultWeeklyHours();
  const anchorHours = openingHours[weekdayFromIsoDate(query.date)];
  const dayStartHour = anchorHours && !anchorHours.closed
    ? Number(anchorHours.open.slice(0, 2))
    : 8;
  const dayEndHour = anchorHours && !anchorHours.closed
    ? Math.max(dayStartHour + 1, Number(anchorHours.close.slice(0, 2)))
    : 21;
  const timeOptions = timeSlotsForDate(
    openingHours,
    query.date,
    settings?.booking_slot_minutes ?? 15,
  );

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-[var(--merevo-space-page)] py-6 lg:py-8">
      <header>
        <h2 className="text-3xl font-semibold tracking-tight text-merevo-text">
          Confirmed bookings
        </h2>
      </header>

      <section className="w-full rounded-merevo border border-merevo-border bg-merevo-surface p-4 sm:p-6">
        {error ? (
          <ErrorState
            title="Could not load calendar"
            description={error}
            action={
              <Link href="/dashboard/calendar">
                <Button type="button" variant="secondary">
                  Try again
                </Button>
              </Link>
            }
          />
        ) : (
          <BookingCalendar
            businessId={context.business.id}
            view={query.view}
            anchorDate={query.date}
            days={range.days}
            bookings={bookings}
            todayIso={todayIso}
            rangeLabel={calendarRangeLabel(query.view, range.from, range.to)}
            tableOptions={tableOptions}
            timeOptions={timeOptions}
            dayStartHour={dayStartHour}
            dayEndHour={dayEndHour}
          />
        )}
      </section>
    </main>
  );
}
