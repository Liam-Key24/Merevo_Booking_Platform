"use client";

import Link from "next/link";
import { Button, ErrorState } from "@/components/ui";
import {
  isMissingEnvError,
  missingEnvDescription,
} from "@/lib/env/missing";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const configError = isMissingEnvError(error);
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-[var(--merevo-space-page)] py-16">
      <ErrorState
        title={configError ? "Configuration needed" : "Something went wrong"}
        description={
          configError
            ? missingEnvDescription(error)
            : "Try again. If it keeps happening, sign in later or contact Merevo."
        }
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
