import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("published branded site route", () => {
  it("serves /s/[businessSlug] without the preview banner flag", () => {
    const path = "src/app/s/[businessSlug]/page.tsx";
    expect(existsSync(join(process.cwd(), path))).toBe(true);
    const page = readSrc(path);
    expect(page).toContain("getClientSitePagePayload");
    expect(page).toContain("renderClientSiteLayout");
    expect(page).toContain("preview: false");
    expect(page).toContain("notFound()");
    expect(page).not.toContain("preview: true");
  });

  it("keeps /preview as an unpublished draft surface", () => {
    const preview = readSrc("src/app/preview/[businessSlug]/page.tsx");
    expect(preview).toContain("preview: true");
    expect(preview).toMatch(/not a public publish/i);
  });

  it("revalidates the published site path after settings sync", () => {
    const sync = readSrc("src/lib/templates/sync.ts");
    expect(sync).toContain("`/s/${business.slug}`");
  });
});
