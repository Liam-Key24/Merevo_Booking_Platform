import { notFound } from "next/navigation";
import { ErrorState } from "@/components/ui";
import { renderClientSiteLayout } from "@/lib/templates/layouts";
import { getClientSitePagePayload } from "@/lib/templates/payload";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ businessSlug: string }>;
};

/**
 * Public published client site. Requires an active business with an assigned
 * active, mode-matched template. Unpublished / unknown slugs 404.
 */
export default async function PublishedClientSitePage({ params }: PageProps) {
  const { businessSlug } = await params;
  let payload = null;
  let loadError = false;

  try {
    payload = await getClientSitePagePayload(businessSlug);
  } catch (error) {
    console.error("[s]", error);
    loadError = true;
  }

  if (loadError) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-[var(--merevo-space-page)] py-14">
        <ErrorState
          title="Site temporarily unavailable"
          description="Please try again in a moment."
        />
      </main>
    );
  }

  if (!payload) {
    notFound();
  }

  const rendered = renderClientSiteLayout(payload, { preview: false });
  if (!rendered) {
    notFound();
  }

  return rendered;
}
