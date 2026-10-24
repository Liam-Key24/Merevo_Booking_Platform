"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { TemplateBrandingPreview } from "@/components/admin/template-branding-preview";
import type { AdminTemplateOption } from "@/lib/templates/catalog";
import { cn } from "@/lib/cn";

type TemplatePickerListProps = {
  businessId: string;
  templates: AdminTemplateOption[];
  assignedTemplateId: string | null;
  businessSlug: string;
  formAction: (payload: FormData) => void;
  pending: boolean;
  stateMessage: string | null;
  stateStatus: "idle" | "success" | "error";
};

export function TemplatePickerList({
  businessId,
  templates,
  assignedTemplateId,
  businessSlug,
  formAction,
  pending,
  stateMessage,
  stateStatus,
}: TemplatePickerListProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(assignedTemplateId ?? "");

  useEffect(() => {
    if (stateStatus === "success") {
      router.refresh();
    }
  }, [router, stateStatus]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="businessId" value={businessId} />
      <input type="hidden" name="templateId" value={selectedId} />

      <ul className="divide-y divide-merevo-border rounded-merevo border border-merevo-border">
        <li>
          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 px-4 py-3 transition",
              selectedId === "" ? "bg-meridian-surface-subtle" : "bg-meridian-surface",
            )}
          >
            <input
              type="radio"
              name="templateChoice"
              value=""
              checked={selectedId === ""}
              onChange={() => setSelectedId("")}
            />
            <span className="text-sm text-merevo-text">No template</span>
          </label>
        </li>

        {templates.map((template) => {
          const selectable =
            template.status === "active" && template.layoutAvailable;
          const isSelected = selectedId === template.id;

          return (
            <li key={template.id}>
              <label
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition",
                  selectable ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                  isSelected ? "bg-meridian-surface-subtle" : "bg-meridian-surface",
                )}
              >
                <input
                  type="radio"
                  name="templateChoice"
                  value={template.id}
                  checked={isSelected}
                  disabled={!selectable}
                  onChange={() => setSelectedId(template.id)}
                  className="shrink-0"
                />
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-merevo bg-meridian-surface-muted">
                  <Image
                    src={template.previewImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-merevo-text">
                      {template.name}
                    </p>
                    <span className="text-xs text-merevo-text-muted">
                      {template.status === "active"
                        ? selectable
                          ? "Ready"
                          : "Active"
                        : "Soon"}
                    </span>
                  </div>
                  <TemplateBrandingPreview branding={template.branding} compact />
                </div>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-merevo-text-muted">
        <a
          href={`/preview/${businessSlug}`}
          className="font-medium text-merevo-teal hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Open preview
        </a>
      </p>

      {stateStatus === "error" && stateMessage ? (
        <p className="text-sm text-merevo-status-declined" role="alert">
          {stateMessage}
        </p>
      ) : null}
      {stateStatus === "success" && stateMessage ? (
        <p className="text-sm text-merevo-status-confirmed" role="status">
          {stateMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save template"}
      </Button>
    </form>
  );
}
