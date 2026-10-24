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
  description = "Please try again. If the problem continues, contact Merevo support.",
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
        <span className="text-xl font-semibold">!</span>
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
