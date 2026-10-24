import { cn } from "@/lib/cn";
import type { BookingStatus } from "@/types/ui";
import type { HTMLAttributes } from "react";

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement> & {
  status: BookingStatus;
};

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-merevo-status-pending-bg text-merevo-status-pending",
  },
  confirmed: {
    label: "Approved",
    className:
      "bg-merevo-status-confirmed-bg text-merevo-status-confirmed",
  },
  declined: {
    label: "Declined",
    className:
      "bg-merevo-status-declined-bg text-merevo-status-declined",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-merevo-status-cancelled-bg text-merevo-status-cancelled",
  },
  suggested: {
    label: "Rescheduled",
    className:
      "bg-merevo-status-suggested-bg text-merevo-status-suggested",
  },
  no_show: {
    label: "No-show",
    className:
      "bg-merevo-surface-muted text-merevo-text-muted",
  },
};

export function StatusLabel({
  status,
  className,
  ...props
}: StatusLabelProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-merevo-sm px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-current/20",
        config.className,
        className,
      )}
      {...props}
    >
      {config.label}
    </span>
  );
}
