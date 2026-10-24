import Link from "next/link";
import { Badge, StatusLabel } from "@/components/ui";
import type { BookingListItem } from "@/lib/dashboard/bookings";

export function BookingList({ bookings }: { bookings: BookingListItem[] }) {
  return (
    <ul className="divide-y divide-merevo-border overflow-hidden rounded-merevo border border-merevo-border bg-merevo-surface">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <Link
            href={`/dashboard/bookings?open=${encodeURIComponent(booking.id)}&period=custom`}
            className="flex cursor-pointer flex-col gap-2 px-4 py-4 transition-colors hover:bg-merevo-surface-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-merevo-text">
                  {booking.customer_name}
                </p>
                <StatusLabel status={booking.status} />
              </div>
              <p className="text-sm text-merevo-text-muted">
                {booking.service?.name ?? "Service removed"} ·{" "}
                {booking.preferred_date} at {booking.preferred_time.slice(0, 5)}
              </p>
              <p className="text-sm text-merevo-text-muted">
                {booking.customer_email}
                {booking.customer_phone ? ` · ${booking.customer_phone}` : ""}
              </p>
            </div>
            <Badge tone="soft">View</Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
