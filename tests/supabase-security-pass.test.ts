import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

function readSrc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function readAllMigrations(): string {
  const dir = join(process.cwd(), "supabase/migrations");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => readFileSync(join(dir, name), "utf8"))
    .join("\n\n");
}

const PUBLIC_TABLES = [
  "businesses",
  "profiles",
  "business_memberships",
  "booking_settings",
  "services",
  "bookings",
  "booking_events",
  "audit_logs",
  "email_delivery_logs",
  "site_templates",
  "business_template_assignments",
  "business_capabilities",
  "business_staff",
  "restaurant_tables",
  "business_subscriptions",
  "client_site_settings",
] as const;

describe("supabase security pass", () => {
  const sql = readAllMigrations();

  it("enables RLS on every public tenant table", () => {
    for (const table of PUBLIC_TABLES) {
      expect(sql).toMatch(
        new RegExp(
          `alter table public\\.${table} enable row level security`,
          "i",
        ),
      );
    }
  });

  it("forces RLS on tenant tables in the security-pass migration", () => {
    const migration = readdirSync(join(process.cwd(), "supabase/migrations")).find(
      (name) => name.includes("security_pass_rls_storage"),
    );
    expect(migration).toBeTruthy();
    const body = readSrc(`supabase/migrations/${migration}`);
    for (const table of ["bookings", "businesses", "client_site_settings"]) {
      expect(body).toMatch(
        new RegExp(`alter table public\\.${table} force row level security`, "i"),
      );
    }
    expect(body).not.toContain("image/svg+xml");
  });

  it("scopes booking select to active membership of that business", () => {
    expect(sql).toMatch(/bookings_select_member/);
    expect(sql).toMatch(
      /on public\.bookings for select to authenticated[\s\S]*has_active_business_membership\(business_id\)/,
    );
    expect(sql).toMatch(/revoke all on table public\.bookings from anon/i);
  });

  it("keeps the service-role client server-only", () => {
    const admin = readSrc("src/lib/supabase/admin.ts");
    expect(admin).toContain('import "server-only"');
    expect(admin).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(admin).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE");

    const clientFiles: string[] = [];
    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          clientFiles.push(full);
        }
      }
    }
    walk(join(process.cwd(), "src/components"));
    walk(join(process.cwd(), "src/app"));

    for (const file of clientFiles) {
      const source = readFileSync(file, "utf8");
      if (!source.includes('"use client"') && !source.includes("'use client'")) {
        continue;
      }
      expect(source).not.toMatch(/@\/lib\/supabase\/admin/);
      expect(source).not.toMatch(/createServiceRoleClient/);
      expect(source).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
    }
  });

  it("blocks SVG uploads in admin asset actions", () => {
    const actions = readSrc("src/lib/admin/site-settings-actions.ts");
    expect(actions).toContain("SVG uploads are blocked");
    const allowedBlock = actions.match(
      /const ALLOWED_IMAGE_TYPES = new Set\(\[([\s\S]*?)\]\);/,
    );
    expect(allowedBlock?.[1] ?? "").not.toContain("image/svg+xml");
  });

  it("lists every required env var in .env.example", () => {
    expect(existsSync(join(process.cwd(), ".env.example"))).toBe(true);
    const example = readSrc(".env.example");
    for (const name of [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SITE_URL",
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "RESEND_API_KEY",
      "EMAIL_FROM",
      "TURNSTILE_SECRET_KEY",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "BOOKING_RATE_LIMIT_SECRET",
      "TRUSTED_PROXY",
    ]) {
      expect(example).toContain(`${name}=`);
    }
    expect(example).toMatch(/never the service role key/i);
  });

  it("surfaces missing env clearly instead of a bare 500", () => {
    const missing = readSrc("src/lib/env/missing.ts");
    expect(missing).toContain("MissingEnvError");
    expect(missing).toContain(".env.example");

    const env = readSrc("src/lib/supabase/env.ts");
    expect(env).toContain("MissingEnvError");

    const errorPage = readSrc("src/app/error.tsx");
    expect(errorPage).toContain("Configuration needed");
    expect(errorPage).toContain("isMissingEnvError");
  });

  it("keeps public booking selects limited to intended fields", () => {
    const publicPage = readSrc("src/lib/booking/public-page.ts");
    expect(publicPage).toContain(
      '"id, name, slug, status, dashboard_mode"',
    );
    expect(publicPage).toContain(
      '"id, name, description, duration_minutes"',
    );
    expect(publicPage).not.toMatch(/\.from\("bookings"\)/);
    expect(publicPage).not.toContain("customer_email");
    expect(publicPage).not.toContain("idempotency_key");
  });
});
