"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ImageDropFieldProps = {
  name: string;
  accept?: string;
  formatsHint?: string;
  disabled?: boolean;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageDropField({
  name,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  formatsHint = "Supports: PNG, JPG, JPEG, WEBP",
  disabled = false,
}: ImageDropFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<{
    name: string;
    size: number;
    preview: string | null;
  } | null>(null);

  function assignFile(file: File | undefined) {
    const input = inputRef.current;
    if (!input || !file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    setSelected((current) => {
      if (current?.preview) URL.revokeObjectURL(current.preview);
      return {
        name: file.name,
        size: file.size,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      };
    });
  }

  function clearSelected() {
    const input = inputRef.current;
    if (input) input.value = "";
    setSelected((current) => {
      if (current?.preview) URL.revokeObjectURL(current.preview);
      return null;
    });
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => assignFile(event.target.files?.[0])}
      />
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) assignFile(event.dataTransfer.files[0]);
        }}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-merevo border-2 border-dashed px-6 py-8 text-center transition-colors",
          disabled && "cursor-not-allowed opacity-60",
          dragging
            ? "border-merevo-blue bg-[color-mix(in_srgb,var(--merevo-soft-blue)_28%,white)]"
            : "border-merevo-border bg-merevo-surface hover:border-merevo-border-strong hover:bg-merevo-surface-subtle",
        )}
      >
        <span
          className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--merevo-soft-blue)_35%,white)] text-merevo-blue"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none">
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
            <path
              d="M3.5 16.5 8 12l3.5 3.5 3-3 6 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm text-merevo-text">
          {dragging ? (
            "Drop your files here"
          ) : (
            <>
              Drop your image here, or{" "}
              <span className="font-semibold text-merevo-teal">browse</span>
            </>
          )}
        </span>
        <span className="text-xs text-merevo-text-muted">{formatsHint}</span>
      </label>
      {selected ? (
        <div className="flex items-center gap-3 rounded-merevo border border-merevo-border bg-merevo-surface px-3 py-2.5">
          {selected.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.preview}
              alt=""
              className="size-10 rounded-merevo-sm object-cover"
            />
          ) : (
            <span className="size-10 rounded-merevo-sm bg-merevo-surface-subtle" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-merevo-text">
              {selected.name}
            </p>
            <p className="text-xs text-merevo-text-muted">
              {formatFileSize(selected.size)} · Ready to save
            </p>
            <span
              className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-merevo-surface-subtle"
              aria-hidden
            >
              <span className="block h-full w-full rounded-full bg-merevo-teal" />
            </span>
          </div>
          <span
            className="flex size-7 items-center justify-center rounded-full bg-merevo-status-confirmed-bg text-merevo-status-confirmed"
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path
                d="M3.5 8.2 6.4 11 12.5 4.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <button
            type="button"
            onClick={clearSelected}
            className="rounded-merevo-sm p-1 text-merevo-text-muted hover:bg-merevo-surface-subtle hover:text-merevo-text"
            aria-label="Remove selected file"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
