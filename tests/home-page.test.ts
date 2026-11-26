import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("platform home page", () => {
  const source = readFileSync(
    join(process.cwd(), "src/app/page.tsx"),
    "utf8",
  );

  it("is a simple sign-in entry, not a stub route map", () => {
    expect(source).toMatch(/Sign in/);
    expect(source).not.toMatch(/Route placeholders/);
    expect(source).not.toMatch(/Booking flow coming soon/);
    expect(source).not.toMatch(/demo-salon/);
  });

  it("ships branded not-found and error routes", () => {
    const notFound = readFileSync(
      join(process.cwd(), "src/app/not-found.tsx"),
      "utf8",
    );
    const error = readFileSync(join(process.cwd(), "src/app/error.tsx"), "utf8");
    expect(notFound).toMatch(/Page not found/);
    expect(error).toMatch(/Try again/);
  });
});
