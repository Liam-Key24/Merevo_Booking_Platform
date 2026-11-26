import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({
  className,
  title,
  description,
  action,
  icon,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-merevo border border-dashed border-merevo-border bg-merevo-surface-subtle/60 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="text-merevo-soft-blue" aria-hidden>
          {icon}
        </div>
      ) : (
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-merevo-surface text-merevo-blue"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeLinejoin="round" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
          </svg>
        </div>
      )}
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
