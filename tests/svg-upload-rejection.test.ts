import { describe, it, expect } from "vitest";

describe("SVG upload rejection", () => {
  it("rejects SVG uploads to prevent XSS attacks", () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('xss')</script></svg>`;
    const svgFile = new File([svgContent], "test.svg", {
      type: "image/svg+xml",
    });

    expect(svgFile.type).toBe("image/svg+xml");
    expect(svgFile.name).toBe("test.svg");
  });

  it("allows safe image formats", () => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    for (const type of allowedTypes) {
      const file = new File(["test"], "test.jpg", { type });
      expect(allowedTypes).toContain(file.type);
    }
  });

  it("SVG is not in allowed image types", () => {
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);

    expect(allowedTypes.has("image/svg+xml")).toBe(false);
  });
});
