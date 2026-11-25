import { LoadingState } from "@/components/ui";

export default function BookLoading() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-[var(--merevo-space-page)] py-14">
      <LoadingState label="Loading booking…" />
    </main>
  );
}
