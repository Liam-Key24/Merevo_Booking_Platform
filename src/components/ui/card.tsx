import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
  padding?: "sm" | "md" | "lg";
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({
  className,
  title,
  description,
  actions,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-merevo border border-merevo-border bg-merevo-surface",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <h2 className="text-lg font-semibold tracking-tight text-merevo-text">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-merevo-text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
