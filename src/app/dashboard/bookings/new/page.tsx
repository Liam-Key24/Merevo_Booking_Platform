import { ManualBookingForm } from "@/components/dashboard/manual-booking-form";
import {
  buildTableLabels,
  defaultWeeklyHours,
  parseCustomTables,
  parseWeeklyHours,
} from "@/lib/dashboard/hospitality-settings";
import { requireDashboardCapability } from "@/lib/dashboard/require-context";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    date?: string;
    time?: string;
  }>;
};

export default async function NewManualBookingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const context = await requireDashboardCapability("booking_requests");

  const defaultDate =
    params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : undefined;
  const defaultTime =
    params.time && /^\d{2}:\d{2}/.test(params.time)
      ? params.time.slice(0, 5)
      : undefined;

  const supabase = await createClient();
  const [{ data: services }, { data: settings }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, duration_minutes")
      .eq("business_id", context.business.id)
      .eq("is_active", true)
      .order("name"),
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

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-[var(--merevo-space-page)] py-6 lg:py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-merevo-text">
          Add a booking
        </h1>
        <p className="text-merevo-text-muted">
          Create a confirmed booking for a walk-in, phone, or other off-platform
          request.
        </p>
      </header>

      <ManualBookingForm
        businessId={context.business.id}
        services={services ?? []}
        defaultDate={defaultDate}
        defaultTime={defaultTime}
        tableOptions={tableOptions}
        openingHours={openingHours}
        bookingSlotMinutes={settings?.booking_slot_minutes ?? 15}
      />
    </main>
  );
}
