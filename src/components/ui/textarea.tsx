import { cn } from "@/lib/cn";
import {
  CLIENT_SURFACE_ERROR,
  CLIENT_SURFACE_FIELD,
  CLIENT_SURFACE_FIELD_ERROR,
  CLIENT_SURFACE_HINT,
  CLIENT_SURFACE_LABEL,
  type SurfaceTheme,
} from "@/lib/templates/client-surface-theme";
import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  surface?: SurfaceTheme;
};

export function Textarea({
  className,
  label,
  hint,
  error,
  id,
  rows = 4,
  surface = "meridian",
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;
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
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          isClient
            ? cn("w-full resize-y px-4 py-3", CLIENT_SURFACE_FIELD)
            : cn(
                "w-full resize-y rounded-merevo border border-merevo-border bg-merevo-surface px-4 py-3 text-merevo-text",
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
          error
            ? `${textareaId}-error`
            : hint
              ? `${textareaId}-hint`
              : undefined
        }
        {...props}
      />
      {error ? (
        <span
          id={`${textareaId}-error`}
          className={isClient ? CLIENT_SURFACE_ERROR : "text-merevo-status-declined"}
        >
          {error}
        </span>
      ) : hint ? (
        <span
          id={`${textareaId}-hint`}
          className={isClient ? CLIENT_SURFACE_HINT : "text-merevo-text-muted"}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
