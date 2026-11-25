"use client";

import Link from "next/link";
import { Button, ErrorState } from "@/components/ui";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-[var(--merevo-space-page)] py-16">
      <ErrorState
        title="Something went wrong"
        description="Try again. If it keeps happening, sign in later or contact Merevo."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Try again
            </Button>
            <Link href="/">
              <Button type="button">Home</Button>
            </Link>
          </div>
        }
      />
    </main>
  );
}
