"use server";

import type { SubmitBookingState } from "@/lib/booking/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * Dry-run demo booking. Never writes to Supabase / CRM.
 */
export async function submitDemoBookingRequest(
  _prev: SubmitBookingState,
  formData: FormData,
): Promise<SubmitBookingState> {
  const businessSlug = String(formData.get("businessSlug") ?? "").trim();
  if (businessSlug !== "demo-restaurant" && businessSlug !== "demo-appointments") {
    return { status: "error", message: "This demo booking form is invalid." };
  }

  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerEmail = String(formData.get("customerEmail") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const preferredTime = String(formData.get("preferredTime") ?? "").trim();

  if (customerName.length < 2) {
    return { status: "error", message: "Enter your name." };
  }
  if (!EMAIL_RE.test(customerEmail)) {
    return { status: "error", message: "Enter a valid email." };
  }
  if (!DATE_RE.test(preferredDate) || !TIME_RE.test(preferredTime)) {
    return { status: "error", message: "Choose a date and time." };
  }

  // Artificial pause so the demo feels like a real submit.
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    status: "success",
    message:
      "Demo only — this request was not saved. No email was sent and no CRM booking was created.",
  };
}
