import { LoadingState } from "@/components/ui";

export default function AdminLoading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-[var(--merevo-space-page)] py-12">
      <LoadingState label="Loading admin…" />
    </main>
  );
}
