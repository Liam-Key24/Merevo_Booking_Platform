"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function ColorCirclePicker({
  label,
  name,
  defaultValue,
  size = "lg",
}: {
  label: string;
  name: string;
  defaultValue: string;
  size?: "md" | "lg" | "xl";
}) {
  const [value, setValue] = useState(defaultValue);
  const [prevDefault, setPrevDefault] = useState(defaultValue);

  // Sync when the parent default changes (React-recommended render-time adjust).
  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue);
    setValue(defaultValue);
  }

  const dimension =
    size === "xl" ? "size-20" : size === "lg" ? "size-11" : "size-8";

  return (
    <label className="flex flex-col items-center gap-1.5">
      <span className="relative inline-flex">
        <span
          aria-hidden
          className={cn(
            "rounded-full border border-merevo-border shadow-sm",
            dimension,
          )}
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label={label}
          className={cn(
            "absolute inset-0 cursor-pointer rounded-full opacity-0",
            dimension,
          )}
        />
      </span>
      <span
        className={
          size === "xl"
            ? "text-sm font-medium text-merevo-text"
            : "text-[11px] text-merevo-text-muted"
        }
      >
        {label}
      </span>
    </label>
  );
}
