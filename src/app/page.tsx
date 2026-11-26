import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-[var(--merevo-space-page)] py-16">
      <header className="space-y-4">
        <p className="text-sm font-semibold tracking-wide text-merevo-teal uppercase">
          Merevo
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-merevo-text sm:text-5xl">
          Booking for your business
        </h1>
        <p className="max-w-md text-base leading-relaxed text-merevo-text-muted">
          Sign in to manage requests and bookings. Public booking links are on
          each client site.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link href="/login">
          <Button type="button">Sign in</Button>
        </Link>
        <Link href="/login?next=/admin">
          <Button type="button" variant="secondary">
            Merevo admin
          </Button>
        </Link>
      </div>
    </main>
  );
}
