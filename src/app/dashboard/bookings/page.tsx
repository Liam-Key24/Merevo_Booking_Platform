import Link from "next/link";
import { EmptyState } from "@/components/ui";
import {
  BookingsExplorer,
  type BookingsPeriod,
} from "@/components/dashboard/bookings-explorer";
import {
  listBookingsForBusiness,
  type BookingFilters as Filters,
} from "@/lib/dashboard/bookings";
import { resolveWeekRange } from "@/lib/dashboard/analytics-math";
import { formatLocalDate } from "@/lib/dashboard/calendar";
import {
  buildTableLabels,
  defaultWeeklyHours,
  parseCustomTables,
  parseWeeklyHours,
  timeSlotsForDate,
} from "@/lib/dashboard/hospitality-settings";
import { requireDashboardCapability } from "@/lib/dashboard/require-context";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/types/database";

type PageProps = {
  searchParams: Promise<{
    status?: string;
    from?: string;
    to?: string;
    q?: string;
    period?: string;
    open?: string;
  }>;
};

function parseStatus(value?: string): Filters["status"] {
  if (!value || value === "all") return "all";
  if (value === "approved") return "confirmed";
  if (value === "rescheduled") return "suggested";
  const allowed: BookingStatus[] = [
    "pending",
    "confirmed",
    "cancelled",
    "suggested",
    "declined",
    "no_show",
  ];
  if (allowed.includes(value as BookingStatus)) {
    return value as BookingStatus;
  }
  return "all";
}

function parsePeriod(value?: string): BookingsPeriod {
  if (
    value === "daily" ||
    value === "weekly" ||
    value === "monthly" ||
    value === "custom"
  ) {
    return value;
  }
  return "weekly";
}

function resolveListRange(
  period: BookingsPeriod,
  fromParam: string,
  toParam: string,
): { from?: string; to?: string } {
  if (period === "custom") {
    return {
      from: fromParam || undefined,
      to: toParam || undefined,
    };
  }
  if (period === "daily") {
    const today = formatLocalDate(new Date());
    return { from: today, to: today };
  }
  if (period === "weekly") {
    const week = resolveWeekRange();
    return { from: week.from, to: week.to };
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 12);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12);
  return { from: formatLocalDate(start), to: formatLocalDate(end) };
}

export default async function DashboardBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const context = await requireDashboardCapability("booking_requests");

  const period = parsePeriod(params.period);
  const status = parseStatus(params.status);
  const fromParam = params.from ?? "";
  const toParam = params.to ?? "";
  const q = params.q?.trim() ?? "";
  const openId = params.open?.trim() || null;
  const range = resolveListRange(period, fromParam, toParam);

  const supabase = await createClient();
  const [{ data: bookings, error }, { data: settings }] = await Promise.all([
    listBookingsForBusiness(context.business.id, {
      status,
      from: range.from,
      to: range.to,
      q: q || undefined,
    }),
    supabase
      .from("booking_settings")
      .select(
        "tables_2_seat, tables_4_seat, tables_6_seat, custom_tables, opening_hours, booking_slot_minutes",
      )
      .eq("business_id", context.business.id)
      .maybeSingle(),
  ]);

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
  const slotMinutes = settings?.booking_slot_minutes ?? 15;
  const timeOptions = timeSlotsForDate(
    openingHours,
    formatLocalDate(new Date()),
    slotMinutes,
  );

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-[var(--merevo-space-page)] py-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-merevo-text">
          All bookings
        </h1>
      </header>

      {error && bookings.length === 0 ? (
        <EmptyState
          title="Could not load bookings"
          description={error}
          action={
            <Link
              href="/dashboard/bookings"
              className="text-sm font-semibold text-merevo-accent hover:underline"
            >
              Try again
            </Link>
          }
        />
      ) : (
        <BookingsExplorer
          businessId={context.business.id}
          bookings={bookings}
          period={period}
          status={status ?? "all"}
          from={period === "custom" ? fromParam : range.from ?? ""}
          to={period === "custom" ? toParam : range.to ?? ""}
          q={q}
          error={error}
          initialOpenId={openId}
          tableOptions={tableOptions}
          timeOptions={timeOptions}
        />
      )}
    </main>
  );
}
