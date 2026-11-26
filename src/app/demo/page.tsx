import Link from "next/link";
import { Button } from "@/components/ui";

export default function DemoHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-[var(--merevo-space-page)] py-16">
      <header className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-merevo-accent uppercase">
          Demo
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-merevo-text">
          Sample Merevo sites
        </h1>
        <p className="max-w-2xl text-base text-merevo-text-muted">
          Show prospects a restaurant and an appointments site. Booking forms
          run in demo mode — nothing is saved to a real CRM.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="rounded-merevo border border-merevo-border bg-merevo-surface p-6">
          <h2 className="text-lg font-semibold text-merevo-text">Restaurant</h2>
          <p className="mt-2 text-sm text-merevo-text-muted">
            Harbour &amp; Hearth — hospitality layout with a table request form.
          </p>
          <div className="mt-5">
            <Link href="/demo/restaurant">
              <Button type="button">Open restaurant demo</Button>
            </Link>
          </div>
        </li>
        <li className="rounded-merevo border border-merevo-border bg-merevo-surface p-6">
          <h2 className="text-lg font-semibold text-merevo-text">Appointments</h2>
          <p className="mt-2 text-sm text-merevo-text-muted">
            Northlight Studio — services list and appointment request form.
          </p>
          <div className="mt-5">
            <Link href="/demo/appointments">
              <Button type="button" variant="secondary">
                Open appointments demo
              </Button>
            </Link>
          </div>
        </li>
      </ul>

      <p className="text-sm text-merevo-text-muted">
        <Link href="/" className="text-merevo-accent underline-offset-2 hover:underline">
          Back to Merevo
        </Link>
      </p>
    </main>
  );
}
