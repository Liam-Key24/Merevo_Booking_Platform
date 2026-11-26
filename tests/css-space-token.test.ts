import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path, files);
    } else if (/\.(tsx?|css)$/.test(name)) {
      files.push(path);
    }
  }
  return files;
}

describe("page spacing CSS token", () => {
  it("defines --merevo-space-page in design tokens", () => {
    const tokens = readFileSync(
      join(process.cwd(), "src/styles/tokens.css"),
      "utf8",
    );
    expect(tokens).toContain("--merevo-space-page:");
  });

  it("does not leave --meridian-space-page references in src", () => {
    const offenders = walk(join(process.cwd(), "src")).filter((file) =>
      readFileSync(file, "utf8").includes("--meridian-space-page"),
    );
    expect(offenders).toEqual([]);
  });
});
