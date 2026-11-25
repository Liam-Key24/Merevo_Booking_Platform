import Link from "next/link";
import { Button, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-[var(--merevo-space-page)] py-16">
      <EmptyState
        title="Page not found"
        description="That link does not exist. Sign in to open your dashboard, or go back to Merevo."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button type="button" variant="secondary">
                Home
              </Button>
            </Link>
            <Link href="/login">
              <Button type="button">Sign in</Button>
            </Link>
          </div>
        }
      />
    </main>
  );
}
