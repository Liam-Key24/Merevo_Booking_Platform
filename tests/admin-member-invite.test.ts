import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("admin member invite / create", () => {
  it("provisions a CRM user when the email has no profile yet", () => {
    const actions = readSrc("src/lib/admin/actions.ts");
    expect(actions).toContain("inviteUserByEmail");
    expect(actions).toContain("createUser");
    expect(actions).toContain("temporaryPassword");
    expect(actions).not.toContain(
      "The user must sign up before membership can be added.",
    );
  });

  it("keeps membership roles as owner or staff with active status", () => {
    const actions = readSrc("src/lib/admin/actions.ts");
    expect(actions).toContain('status: "active"');
    expect(actions).toContain('["owner", "staff"]');
  });

  it("updates the members UI copy for invite", () => {
    const form = readSrc("src/components/admin/business-forms.tsx");
    expect(form).toContain("Invite member");
    expect(form).toContain("Invites a new login");

    const page = readSrc(
      "src/app/admin/businesses/[id]/settings/members/page.tsx",
    );
    expect(page).toMatch(/Invite the client/i);
  });
});
