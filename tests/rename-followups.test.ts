import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("rename follow-ups", () => {
  it("does not expose the DB role name in the admin denial copy", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/admin/layout.tsx"),
      "utf8",
    );
    expect(source).toMatch(/Merevo platform admin/);
    expect(source).not.toMatch(/meridian_admin platform role/);
  });

  it("keeps the stored platform role value unchanged", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/auth/business-context.ts"),
      "utf8",
    );
    expect(source).toContain('platform_role === "meridian_admin"');
  });
});
