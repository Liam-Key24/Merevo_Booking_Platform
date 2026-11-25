import type { ComponentType } from "react";
import {
  AppointmentsClassicLayout,
  AppointmentsMinimalLayout,
  AppointmentsStudioLayout,
} from "@/components/client-site/layouts/appointments-classic";
import { HospitalityClassicLayout } from "@/components/client-site/layouts/hospitality-classic";
import type { ClientSitePagePayload } from "@/lib/templates/payload";

export type ClientSiteLayoutProps = {
  payload: ClientSitePagePayload;
  preview?: boolean;
  /** Public Merevo sales demo — dry-run bookings, Demo label. */
  demo?: boolean;
};

export const TEMPLATE_LAYOUTS: Record<
  string,
  ComponentType<ClientSiteLayoutProps>
> = {
  "hospitality-classic": HospitalityClassicLayout,
  "appointments-classic": AppointmentsClassicLayout,
  "appointments-minimal": AppointmentsMinimalLayout,
  "appointments-studio": AppointmentsStudioLayout,
};

export const AVAILABLE_TEMPLATE_LAYOUT_SLUGS = new Set(
  Object.keys(TEMPLATE_LAYOUTS),
);

export function resolveClientSiteLayout(slug: string) {
  return TEMPLATE_LAYOUTS[slug] ?? null;
}

export function renderClientSiteLayout(
  payload: ClientSitePagePayload,
  options?: { preview?: boolean; demo?: boolean },
) {
  const Layout = resolveClientSiteLayout(payload.template.slug);
  if (!Layout) return null;
  return (
    <Layout
      payload={payload}
      preview={options?.preview}
      demo={options?.demo}
    />
  );
}
