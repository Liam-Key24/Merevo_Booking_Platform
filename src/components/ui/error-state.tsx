import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  className,
  title = "Something went wrong",
  description = "Please try again. If it keeps happening, email hello@merevo.co.uk.",
  action,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-merevo border border-merevo-status-declined/25 bg-merevo-status-declined-bg/60 px-6 py-10 text-center",
        className,
      )}
      role="alert"
      {...props}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-merevo-surface text-merevo-status-declined"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" strokeLinecap="round" />
          <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-merevo-text">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-merevo-text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
