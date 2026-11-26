import { cn } from "@/lib/cn";
import {
  CLIENT_SURFACE_ERROR,
  CLIENT_SURFACE_FIELD,
  CLIENT_SURFACE_FIELD_ERROR,
  CLIENT_SURFACE_HINT,
  CLIENT_SURFACE_LABEL,
  type SurfaceTheme,
} from "@/lib/templates/client-surface-theme";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  surface?: SurfaceTheme;
};

export function Input({
  className,
  label,
  hint,
  error,
  id,
  surface = "meridian",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const isClient = surface === "client";

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label ? (
        <span
          className={cn(
            isClient ? CLIENT_SURFACE_LABEL : "font-medium text-merevo-text",
          )}
        >
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          isClient
            ? cn("h-11 w-full px-4", CLIENT_SURFACE_FIELD)
            : cn(
                "h-11 w-full rounded-merevo border border-merevo-border bg-merevo-surface px-4 text-merevo-text",
                "placeholder:text-merevo-text-muted/70",
                "transition-[border-color,box-shadow] focus-visible:border-merevo-blue focus-visible:shadow-[var(--merevo-focus-ring)]",
                "disabled:cursor-not-allowed disabled:bg-merevo-surface-subtle disabled:opacity-70",
              ),
          error &&
            (isClient ? CLIENT_SURFACE_FIELD_ERROR : "border-merevo-status-declined"),
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error ? (
        <span
          id={`${inputId}-error`}
          className={isClient ? CLIENT_SURFACE_ERROR : "text-merevo-status-declined"}
        >
          {error}
        </span>
      ) : hint ? (
        <span
          id={`${inputId}-hint`}
          className={isClient ? CLIENT_SURFACE_HINT : "text-merevo-text-muted"}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
