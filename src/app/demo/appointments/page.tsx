import { renderClientSiteLayout } from "@/lib/templates/layouts";
import { getDemoAppointmentsPayload } from "@/lib/demo/payloads";

export const dynamic = "force-static";

export default function DemoAppointmentsPage() {
  const payload = getDemoAppointmentsPayload();
  const rendered = renderClientSiteLayout(payload, { demo: true });
  if (!rendered) {
    return (
      <main className="px-[var(--merevo-space-page)] py-16">
        <p className="text-merevo-text-muted">Demo layout unavailable.</p>
      </main>
    );
  }
  return rendered;
}
